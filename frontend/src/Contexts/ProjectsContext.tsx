// Contexts/ProjectsContext.tsx
import { createContext, useContext, useState } from "react";
import type {
  ApiResponse,
  Pagination,
  ProjectListItem,
  ProjectDetailsResponse,
} from "../Types/Types";

interface GetProjectsParams {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

interface ProjectsContextType {
  projects: ProjectListItem[];
  pagination: Pagination | null;
  loadingProjects: boolean;

  currentProject: ProjectDetailsResponse | null;
  loadingCurrentProject: boolean;

  errorMsg: string | null;

  getProjects: (params?: GetProjectsParams) => Promise<void>;

  createProject: (name: string, description?: string) => Promise<void>;
  loadingCreateProject: boolean;

  getProjectById: (projectId: string) => Promise<void>;

  updateProject: (
    projectId: string,
    data: { name?: string; description?: string }
  ) => Promise<void>;
  loadingUpdateProject: boolean;

  deleteProject: (projectId: string) => Promise<void>;
  loadingDeleteProject: boolean;
}

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export const ProjectsProvider = ({ children }: { children: React.ReactNode }) => {

  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);

  const [currentProject, setCurrentProject] = useState<ProjectDetailsResponse | null>(null);
  const [loadingCurrentProject, setLoadingCurrentProject] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [loadingCreateProject, setLoadingCreateProject] = useState<boolean>(false);
  const [loadingUpdateProject, setLoadingUpdateProject] = useState<boolean>(false);
  const [loadingDeleteProject, setLoadingDeleteProject] = useState<boolean>(false);


  const getProjects = async (params?: GetProjectsParams) => {

    try {
      setLoadingProjects(true);

      const query = new URLSearchParams();
      if (params?.search) query.set("search", params.search);
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));
      if (params?.sort) query.set("sort", params.sort);
      if (params?.order) query.set("order", params.order);

      const queryString = query.toString();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/projects${queryString ? `?${queryString}` : ""}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data: ApiResponse<{ projects: ProjectListItem[]; pagination: Pagination }> =
        await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in fetching projects");
        throw new Error(data.message || "Error in fetching projects");
      }

      setProjects(data.data.projects);
      setPagination(data.data.pagination);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProjects(false);
    }
  };


  const createProject = async (name: string, description?: string) => {

    try {
      setLoadingCreateProject(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
        credentials: "include",
      });

      const data: ApiResponse<{ project: ProjectListItem }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in creating project");
        throw new Error(data.message || "Error in creating project");
      }

      setProjects(prev => [data.data!.project, ...prev]);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCreateProject(false);
    }
  };


  const getProjectById = async (projectId: string) => {

    try {
      setLoadingCurrentProject(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/projects/${projectId}`, {
        method: "GET",
        credentials: "include",
      });

      const data: ApiResponse<{ project: ProjectDetailsResponse }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in fetching project");
        throw new Error(data.message || "Error in fetching project");
      }

      setCurrentProject(data.data.project);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCurrentProject(false);
    }
  };


  const updateProject = async (
    projectId: string,
    projectData: { name?: string; description?: string }
  ) => {

    try {
      setLoadingUpdateProject(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
        credentials: "include",
      });

      const data: ApiResponse<{ project: ProjectListItem }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in updating project");
        throw new Error(data.message || "Error in updating project");
      }

      const updated = data.data.project;

      setProjects(prev =>
        prev.map(p => (p.id === projectId ? { ...p, ...updated } : p))
      );

      setCurrentProject(prev =>
        prev && prev.id === projectId ? { ...prev, ...updated } : prev
      );

      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUpdateProject(false);
    }
  };


  const deleteProject = async (projectId: string) => {

    try {
      setLoadingDeleteProject(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/projects/${projectId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data: ApiResponse<null> = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Error in deleting project");
        throw new Error(data.message || "Error in deleting project");
      }

      setProjects(prev => prev.filter(p => p.id !== projectId));

      setCurrentProject(prev => (prev && prev.id === projectId ? null : prev));

      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDeleteProject(false);
    }
  };


  return (
    <ProjectsContext.Provider
      value={{
        projects,
        pagination,
        loadingProjects,

        currentProject,
        loadingCurrentProject,

        errorMsg,

        getProjects,

        createProject,
        loadingCreateProject,

        getProjectById,

        updateProject,
        loadingUpdateProject,

        deleteProject,
        loadingDeleteProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};



export const useProjectsContext = () => {

  const context = useContext(ProjectsContext);

  if (!context) {
    throw new Error("Please use the useProjectsContext hook inside a ProjectsProvider");
  }

  return context;
};