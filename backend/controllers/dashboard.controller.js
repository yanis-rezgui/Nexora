// controllers/dashboard.controller.js
import prisma from "../config/prisma.js";


// ============================================================
// GET DASHBOARD OVERVIEW
// GET /api/v1/dashboard/overview
// ============================================================

export const getDashboardOverview = async (req, res, next) => {

  try {

    const userId = req.user.id;
    const now = new Date();

    // ----------------------------------------------------------
    // PROJECTS THE USER CAN SEE (owner or member)
    // ----------------------------------------------------------

    const accessibleProjects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      select: {
        id: true,
        name: true,
        ownerId: true,
        members: {
          where: { userId },
          select: { role: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const projectIds = accessibleProjects.map((p) => p.id);

    // Projects where the current user is OWNER or MANAGER
    const managedProjectIds = accessibleProjects
      .filter((p) => p.ownerId === userId || p.members[0]?.role === "MANAGER")
      .map((p) => p.id);

    const isManager = managedProjectIds.length > 0;


    // ----------------------------------------------------------
    // PARALLEL QUERIES
    // ----------------------------------------------------------

    const [
      myStatusCounts,
      myOverdueCount,
      myUpcomingTasks,
      projectTaskCounts,
      projectMemberCounts,
      recentActivity,
      rawWorkload,
    ] = await Promise.all([

      // Status breakdown of tasks assigned to me
      prisma.task.groupBy({
        by: ["status"],
        where: { assigneeId: userId },
        _count: { _all: true },
      }),

      // Overdue tasks assigned to me
      prisma.task.count({
        where: {
          assigneeId: userId,
          status: { not: "DONE" },
          dueDate: { lt: now },
        },
      }),

      // My next tasks, soonest due date first
      prisma.task.findMany({
        where: {
          assigneeId: userId,
          status: { not: "DONE" },
        },
        include: {
          project: {
            select: { id: true, name: true },
          },
        },
        orderBy: [
          { dueDate: "asc" },
          { priority: "desc" },
        ],
        take: 5,
      }),

      // Task status breakdown per project (for progress bars)
      projectIds.length
        ? prisma.task.groupBy({
            by: ["projectId", "status"],
            where: { projectId: { in: projectIds } },
            _count: { _all: true },
          })
        : Promise.resolve([]),

      // Member count per project
      projectIds.length
        ? prisma.projectMember.groupBy({
            by: ["projectId"],
            where: { projectId: { in: projectIds } },
            _count: { _all: true },
          })
        : Promise.resolve([]),

      // Recent activity across accessible projects
      projectIds.length
        ? prisma.activityLog.findMany({
            where: { projectId: { in: projectIds } },
            include: {
              user: {
                select: { id: true, firstName: true, lastName: true },
              },
              project: {
                select: { id: true, name: true },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 10,
          })
        : Promise.resolve([]),

      // Active (non-done) task count per assignee, for projects I manage
      isManager
        ? prisma.task.groupBy({
            by: ["assigneeId"],
            where: {
              projectId: { in: managedProjectIds },
              assigneeId: { not: null },
              status: { not: "DONE" },
            },
            _count: { _all: true },
          })
        : Promise.resolve([]),
    ]);


    // ----------------------------------------------------------
    // STATS
    // ----------------------------------------------------------

    const counts = { TODO: 0, IN_PROGRESS: 0, IN_REVIEW: 0, DONE: 0 };

    myStatusCounts.forEach((entry) => {
      counts[entry.status] = entry._count._all;
    });

    const stats = {
      total: Object.values(counts).reduce((a, b) => a + b, 0),
      inProgress: counts.IN_PROGRESS,
      completed: counts.DONE,
      overdue: myOverdueCount,
    };


    // ----------------------------------------------------------
    // PROJECTS OVERVIEW
    // ----------------------------------------------------------

    const projectStatsMap = {};

    projectTaskCounts.forEach((entry) => {
      if (!projectStatsMap[entry.projectId]) {
        projectStatsMap[entry.projectId] = { total: 0, done: 0 };
      }
      projectStatsMap[entry.projectId].total += entry._count._all;
      if (entry.status === "DONE") {
        projectStatsMap[entry.projectId].done += entry._count._all;
      }
    });

    const memberCountMap = {};

    projectMemberCounts.forEach((entry) => {
      memberCountMap[entry.projectId] = entry._count._all;
    });

    const projects = accessibleProjects.map((project) => {
      const taskStats = projectStatsMap[project.id] || { total: 0, done: 0 };
      const isOwner = project.ownerId === userId;

      return {
        id: project.id,
        name: project.name,
        role: isOwner ? "OWNER" : project.members[0]?.role ?? "DEVELOPER",
        taskCount: taskStats.total,
        completedTaskCount: taskStats.done,
        completionPercent: taskStats.total
          ? Math.round((taskStats.done / taskStats.total) * 100)
          : 0,
        memberCount: memberCountMap[project.id] || 0,
      };
    });


    // ----------------------------------------------------------
    // TEAM WORKLOAD (managers/owners only)
    // ----------------------------------------------------------

    let teamWorkload = [];

    if (rawWorkload.length) {

      const assigneeIds = rawWorkload.map((entry) => entry.assigneeId);

      const users = await prisma.user.findMany({
        where: { id: { in: assigneeIds } },
        select: { id: true, firstName: true, lastName: true },
      });

      const userMap = Object.fromEntries(
        users.map((u) => [u.id, u])
      );

      teamWorkload = rawWorkload
        .map((entry) => ({
          user: userMap[entry.assigneeId],
          activeTaskCount: entry._count._all,
        }))
        .filter((entry) => entry.user)
        .sort((a, b) => b.activeTaskCount - a.activeTaskCount)
        .slice(0, 8);
    }


    // ----------------------------------------------------------
    // RESPONSE
    // ----------------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Dashboard overview fetched successfully",
      data: {
        stats,
        myTasks: myUpcomingTasks,
        recentActivity,
        projects,
        teamWorkload,
        isManager,
      },
    });

  } catch (err) {
    next(err);
  }
};