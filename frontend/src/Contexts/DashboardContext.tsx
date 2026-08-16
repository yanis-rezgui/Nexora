// Contexts/DashboardContext.tsx
import { createContext, useContext, useState } from "react";
import type { ApiResponse, DashboardOverview } from "../Types/Types";

interface DashboardContextType {
  overview: DashboardOverview | null;
  loadingOverview: boolean;
  errorMsg: string | null;
  getDashboardOverview: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {

  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loadingOverview, setLoadingOverview] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);


  const getDashboardOverview = async () => {

    try {

      setLoadingOverview(true);

      const res = await fetch(
        "http://localhost:5000/api/v1/dashboard/overview",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data: ApiResponse<DashboardOverview> = await res.json();

      if (!res.ok || !data.data) {

        setErrorMsg(
          data.message || "Error in fetching dashboard overview"
        );

        throw new Error(
          data.message || "Error in fetching dashboard overview"
        );
      }

      setOverview(data.data);
      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingOverview(false);

    }
  };


  return (
    <DashboardContext.Provider
      value={{
        overview,
        loadingOverview,
        errorMsg,
        getDashboardOverview,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};


export const useDashboardContext = () => {

  const context = useContext(DashboardContext);

  if (!context) {

    throw new Error(
      "Please use the useDashboardContext hook inside a DashboardProvider"
    );

  }

  return context;
};