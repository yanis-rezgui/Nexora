// Contexts/ActivityContext.tsx
import { createContext, useContext, useState } from "react";
import type { ApiResponse, Pagination, ActivityLog } from "../Types/Types";

interface ActivityContextType {
  logs: ActivityLog[];
  pagination: Pagination | null;
  loadingActivity: boolean;

  errorMsg: string | null;

  getProjectActivity: (
    projectId: string,
    params?: { page?: number; limit?: number }
  ) => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | null>(null);

export const ActivityProvider = ({ children }: { children: React.ReactNode }) => {

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loadingActivity, setLoadingActivity] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);


  // ============================================================
  // GET PROJECT ACTIVITY
  // ============================================================

  const getProjectActivity = async (
    projectId: string,
    params?: { page?: number; limit?: number }
  ) => {

    try {

      setLoadingActivity(true);

      const query = new URLSearchParams();
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));

      const queryString = query.toString();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/projects/${projectId}/activity${queryString ? `?${queryString}` : ""}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data: ApiResponse<{ logs: ActivityLog[]; pagination: Pagination }> =
        await res.json();

      if (!res.ok || !data.data) {

        setErrorMsg(
          data.message || "Error in fetching project activity"
        );

        throw new Error(
          data.message || "Error in fetching project activity"
        );
      }

      setLogs(data.data.logs);
      setPagination(data.data.pagination);

      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingActivity(false);

    }
  };


  // ============================================================
  // PROVIDER
  // ============================================================

  return (
    <ActivityContext.Provider
      value={{
        logs,
        pagination,
        loadingActivity,
        errorMsg,
        getProjectActivity,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};


// ============================================================
// HOOK
// ============================================================

export const useActivityContext = () => {

  const context = useContext(ActivityContext);

  if (!context) {

    throw new Error(
      "Please use the useActivityContext hook inside an ActivityProvider"
    );

  }

  return context;
};