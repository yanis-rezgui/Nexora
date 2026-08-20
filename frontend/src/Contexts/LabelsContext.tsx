import { createContext, useContext, useEffect, useState } from "react";
import type { ApiResponse, Label, TaskLabel } from "../Types/Types";
import { socket } from "../socket/socket.js";

interface LabelsContextType {

  // Labels du projet (pour la gestion : création/édition/suppression)
  projectLabels: Label[];
  loadingProjectLabels: boolean;
  getProjectLabels: (projectId: string) => Promise<void>;

  createLabel: (projectId: string, name: string, color: string) => Promise<void>;
  loadingCreateLabel: boolean;

  updateLabel: (labelId: string, data: { name?: string; color?: string }) => Promise<void>;
  loadingUpdateLabel: boolean;

  deleteLabel: (labelId: string) => Promise<void>;
  loadingDeleteLabel: boolean;

  // Labels d'une tâche (pour le picker dans TaskDetailsModal)
  taskLabels: TaskLabel[];
  loadingTaskLabels: boolean;
  getTaskLabels: (taskId: string, initial: TaskLabel[]) => void;

  attachLabelToTask: (taskId: string, labelId: string) => Promise<void>;
  loadingAttachLabel: boolean;

  detachLabelFromTask: (taskId: string, labelId: string) => Promise<void>;
  loadingDetachLabel: boolean;

  errorMsg: string | null;
}

const LabelsContext = createContext<LabelsContextType | null>(null);

export const LabelsProvider = ({ children }: { children: React.ReactNode }) => {

  const [projectLabels, setProjectLabels] = useState<Label[]>([]);
  const [loadingProjectLabels, setLoadingProjectLabels] = useState<boolean>(false);

  const [loadingCreateLabel, setLoadingCreateLabel] = useState<boolean>(false);
  const [loadingUpdateLabel, setLoadingUpdateLabel] = useState<boolean>(false);
  const [loadingDeleteLabel, setLoadingDeleteLabel] = useState<boolean>(false);

  const [taskLabels, setTaskLabels] = useState<TaskLabel[]>([]);
  const [loadingTaskLabels, setLoadingTaskLabels] = useState<boolean>(false);
  const [loadingAttachLabel, setLoadingAttachLabel] = useState<boolean>(false);
  const [loadingDetachLabel, setLoadingDetachLabel] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);


  // ==========================================================
  // PROJECT LABELS
  // ==========================================================

  const getProjectLabels = async (projectId: string) => {
    try {
      setLoadingProjectLabels(true);

      const res = await fetch(
        `http://localhost:5000/api/v1/projects/${projectId}/labels`,
        { method: "GET", credentials: "include" }
      );

      const data: ApiResponse<{ labels: Label[] }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in fetching labels");
        throw new Error(data.message || "Error in fetching labels");
      }

      setProjectLabels(data.data.labels);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProjectLabels(false);
    }
  };


  const createLabel = async (projectId: string, name: string, color: string) => {
    try {
      setLoadingCreateLabel(true);

      const res = await fetch(
        `http://localhost:5000/api/v1/projects/${projectId}/labels`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, color }),
          credentials: "include",
        }
      );

      const data: ApiResponse<{ label: Label }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in creating label");
        throw new Error(data.message || "Error in creating label");
      }

      setProjectLabels(prev =>
        prev.some(l => l.id === data.data!.label.id) ? prev : [...prev, data.data!.label]
      );

      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCreateLabel(false);
    }
  };


  const updateLabel = async (labelId: string, labelData: { name?: string; color?: string }) => {
    try {
      setLoadingUpdateLabel(true);

      const res = await fetch(
        `http://localhost:5000/api/v1/labels/${labelId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(labelData),
          credentials: "include",
        }
      );

      const data: ApiResponse<{ label: Label }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in updating label");
        throw new Error(data.message || "Error in updating label");
      }

      setProjectLabels(prev =>
        prev.map(l => (l.id === labelId ? { ...l, ...data.data!.label } : l))
      );

      // Un label modifié (nom/couleur) peut être affiché dans taskLabels aussi
      setTaskLabels(prev =>
        prev.map(tl => (tl.labelId === labelId ? { ...tl, label: data.data!.label } : tl))
      );

      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUpdateLabel(false);
    }
  };


  const deleteLabel = async (labelId: string) => {
    try {
      setLoadingDeleteLabel(true);

      const res = await fetch(
        `http://localhost:5000/api/v1/labels/${labelId}`,
        { method: "DELETE", credentials: "include" }
      );

      const data: ApiResponse<null> = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Error in deleting label");
        throw new Error(data.message || "Error in deleting label");
      }

      setProjectLabels(prev => prev.filter(l => l.id !== labelId));
      setTaskLabels(prev => prev.filter(tl => tl.labelId !== labelId));

      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDeleteLabel(false);
    }
  };


  // ==========================================================
  // TASK LABELS
  // ==========================================================

  // Pas d'appel réseau : on hydrate depuis currentTask.labels (déjà renvoyé par getTaskById)
  const getTaskLabels = (taskId: string, initial: TaskLabel[]) => {
    setCurrentTaskId(taskId);
    setTaskLabels(initial);
  };


  const attachLabelToTask = async (taskId: string, labelId: string) => {
    try {
      setLoadingAttachLabel(true);

      const res = await fetch(
        `http://localhost:5000/api/v1/tasks/${taskId}/labels`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ labelId }),
          credentials: "include",
        }
      );

      const data: ApiResponse<{ labels: TaskLabel[] }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in attaching label");
        throw new Error(data.message || "Error in attaching label");
      }

      setTaskLabels(data.data.labels);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAttachLabel(false);
    }
  };


  const detachLabelFromTask = async (taskId: string, labelId: string) => {
    try {
      setLoadingDetachLabel(true);

      const res = await fetch(
        `http://localhost:5000/api/v1/tasks/${taskId}/labels/${labelId}`,
        { method: "DELETE", credentials: "include" }
      );

      const data: ApiResponse<{ labels: TaskLabel[] }> = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Error in detaching label");
        throw new Error(data.message || "Error in detaching label");
      }

      setTaskLabels(prev => prev.filter(tl => tl.labelId !== labelId));
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetachLabel(false);
    }
  };


  // ==========================================================
  // SOCKET LISTENERS
  // ==========================================================

  useEffect(() => {

    const handleLabelCreated = ({ label }: { projectId: string; label: Label }) => {
      setProjectLabels(prev => (prev.some(l => l.id === label.id) ? prev : [...prev, label]));
    };

    const handleLabelUpdated = ({ label }: { projectId: string; label: Label }) => {
      setProjectLabels(prev => prev.map(l => (l.id === label.id ? label : l)));
      setTaskLabels(prev => prev.map(tl => (tl.labelId === label.id ? { ...tl, label } : tl)));
    };

    const handleLabelDeleted = ({ labelId }: { projectId: string; labelId: string }) => {
      setProjectLabels(prev => prev.filter(l => l.id !== labelId));
      setTaskLabels(prev => prev.filter(tl => tl.labelId !== labelId));
    };

    const handleTaskLabelsUpdated = ({ taskId, labels }: { taskId: string; labels: TaskLabel[] }) => {
      if (taskId !== currentTaskId) return;
      setTaskLabels(labels);
    };

    socket.on("label:created", handleLabelCreated);
    socket.on("label:updated", handleLabelUpdated);
    socket.on("label:deleted", handleLabelDeleted);
    socket.on("task:labels_updated", handleTaskLabelsUpdated);

    return () => {
      socket.off("label:created", handleLabelCreated);
      socket.off("label:updated", handleLabelUpdated);
      socket.off("label:deleted", handleLabelDeleted);
      socket.off("task:labels_updated", handleTaskLabelsUpdated);
    };

  }, [currentTaskId]);


  return (
    <LabelsContext.Provider
      value={{
        projectLabels,
        loadingProjectLabels,
        getProjectLabels,
        createLabel,
        loadingCreateLabel,
        updateLabel,
        loadingUpdateLabel,
        deleteLabel,
        loadingDeleteLabel,

        taskLabels,
        loadingTaskLabels,
        getTaskLabels,
        attachLabelToTask,
        loadingAttachLabel,
        detachLabelFromTask,
        loadingDetachLabel,

        errorMsg,
      }}
    >
      {children}
    </LabelsContext.Provider>
  );
};

export const useLabelsContext = () => {
  const context = useContext(LabelsContext);
  if (!context) {
    throw new Error("Please use the useLabelsContext hook inside a LabelsProvider");
  }
  return context;
};