-- AlterTable
ALTER TABLE "users" ADD COLUMN     "notify_comments" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notify_deadlines" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notify_email" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notify_mentions" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notify_project_activity" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notify_task_assigned" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notify_task_updated" BOOLEAN NOT NULL DEFAULT true;
