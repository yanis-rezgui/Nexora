import { createContext, useContext, useEffect, useState } from "react";
import type { ApiResponse, Comment } from "../Types/Types";
import { socket } from "../socket/socket.js";

interface CommentsContextType {
  comments: Comment[];
  loadingComments: boolean;

  getTaskComments: (taskId: string) => Promise<void>;

  createComment: (
    taskId: string,
    content: string,
    mentionedUserIds?: string[]
  ) => Promise<void>;
  loadingCreateComment: boolean;

  updateComment: (commentId: string, content: string) => Promise<void>;
  loadingUpdateComment: boolean;

  deleteComment: (commentId: string) => Promise<void>;
  loadingDeleteComment: boolean;

  errorMsg: string | null;
}

const CommentsContext = createContext<CommentsContextType | null>(null);

export const CommentsProvider = ({ children }: { children: React.ReactNode }) => {

  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);

  const [loadingCreateComment, setLoadingCreateComment] = useState<boolean>(false);
  const [loadingUpdateComment, setLoadingUpdateComment] = useState<boolean>(false);
  const [loadingDeleteComment, setLoadingDeleteComment] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tâche actuellement affichée (pour filtrer les events socket)
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);


  const getTaskComments = async (taskId: string) => {
    try {
      setLoadingComments(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/tasks/${taskId}/comments`,
        { method: "GET", credentials: "include" }
      );

      const data: ApiResponse<{ comments: Comment[] }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in fetching comments");
        throw new Error(data.message || "Error in fetching comments");
      }

      setComments(data.data.comments);
      setCurrentTaskId(taskId);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };


  const createComment = async (
    taskId: string,
    content: string,
    mentionedUserIds: string[] = []
  ) => {
    try {
      setLoadingCreateComment(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/tasks/${taskId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, mentionedUserIds }),
          credentials: "include",
        }
      );

      const data: ApiResponse<{ comment: Comment }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in adding comment");
        throw new Error(data.message || "Error in adding comment");
      }

      setComments(prev =>
        prev.some(c => c.id === data.data!.comment.id)
          ? prev
          : [...prev, data.data!.comment]
      );

      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCreateComment(false);
    }
  };


  const updateComment = async (commentId: string, content: string) => {
    try {
      setLoadingUpdateComment(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/comments/${commentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
          credentials: "include",
        }
      );

      const data: ApiResponse<{ comment: Comment }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in updating comment");
        throw new Error(data.message || "Error in updating comment");
      }

      setComments(prev =>
        prev.map(c => (c.id === commentId ? { ...c, ...data.data!.comment } : c))
      );

      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUpdateComment(false);
    }
  };


  const deleteComment = async (commentId: string) => {
    try {
      setLoadingDeleteComment(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/comments/${commentId}`,
        { method: "DELETE", credentials: "include" }
      );

      const data: ApiResponse<null> = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Error in deleting comment");
        throw new Error(data.message || "Error in deleting comment");
      }

      setComments(prev => prev.filter(c => c.id !== commentId));

      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDeleteComment(false);
    }
  };


  // ==========================================================
  // SOCKET LISTENERS (temps réel)
  // ==========================================================

  useEffect(() => {

    const handleCommentCreated = ({ taskId, comment }: { taskId: string; comment: Comment }) => {
      if (taskId !== currentTaskId) return;
      setComments(prev =>
        prev.some(c => c.id === comment.id) ? prev : [...prev, comment]
      );
    };

    const handleCommentUpdated = ({ taskId, comment }: { taskId: string; comment: Comment }) => {
      if (taskId !== currentTaskId) return;
      setComments(prev => prev.map(c => (c.id === comment.id ? comment : c)));
    };

    const handleCommentDeleted = ({ taskId, commentId }: { taskId: string; commentId: string }) => {
      if (taskId !== currentTaskId) return;
      setComments(prev => prev.filter(c => c.id !== commentId));
    };

    socket.on("comment:created", handleCommentCreated);
    socket.on("comment:updated", handleCommentUpdated);
    socket.on("comment:deleted", handleCommentDeleted);

    return () => {
      socket.off("comment:created", handleCommentCreated);
      socket.off("comment:updated", handleCommentUpdated);
      socket.off("comment:deleted", handleCommentDeleted);
    };

  }, [currentTaskId]);


  return (
    <CommentsContext.Provider
      value={{
        comments,
        loadingComments,
        getTaskComments,
        createComment,
        loadingCreateComment,
        updateComment,
        loadingUpdateComment,
        deleteComment,
        loadingDeleteComment,
        errorMsg,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
};

export const useCommentsContext = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error("Please use the useCommentsContext hook inside a CommentsProvider");
  }
  return context;
};