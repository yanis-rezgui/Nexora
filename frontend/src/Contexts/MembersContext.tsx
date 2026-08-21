// Contexts/MembersContext.tsx

import { createContext, useContext, useState } from "react";
import type {
  ApiResponse,
  ProjectMember,
  ProjectRole,
} from "../Types/Types";


// ============================================================
// TYPES
// ============================================================

interface MembersContextType {
  members: ProjectMember[];
  loadingMembers: boolean;
  errorMsg: string | null;
  getProjectMembers: (projectId: string) => Promise<void>;

  addProjectMember: (
    projectId: string,
    email: string,
    role: ProjectRole
  ) => Promise<void>;
  loadingAddMember: boolean;

  updateProjectMemberRole: (
    projectId: string,
    memberId: string,
    role: ProjectRole
  ) => Promise<void>;
  loadingUpdateMemberRole: boolean;

  removeProjectMember: (
    projectId: string,
    memberId: string
  ) => Promise<void>;
  loadingRemoveMember: boolean;
}


// ============================================================
// CONTEXT
// ============================================================

const MembersContext = createContext<MembersContextType | null>(null);


// ============================================================
// PROVIDER
// ============================================================

export const MembersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const [members, setMembers] = useState<ProjectMember[]>([]);

  const [loadingMembers, setLoadingMembers] =
    useState<boolean>(false);

  const [loadingAddMember, setLoadingAddMember] =
    useState<boolean>(false);

  const [loadingUpdateMemberRole, setLoadingUpdateMemberRole] =
    useState<boolean>(false);

  const [loadingRemoveMember, setLoadingRemoveMember] =
    useState<boolean>(false);

  const [errorMsg, setErrorMsg] =
    useState<string | null>(null);


  // ============================================================
  // GET PROJECT MEMBERS
  // ============================================================

  const getProjectMembers = async (projectId: string) => {

    try {

      setLoadingMembers(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/projects/${projectId}/members`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data: ApiResponse<{ members: ProjectMember[] }> =
        await res.json();

      if (!res.ok || !data.data) {

        setErrorMsg(
          data.message || "Error in fetching project members"
        );

        throw new Error(
          data.message || "Error in fetching project members"
        );
      }

      setMembers(data.data.members);

      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingMembers(false);

    }
  };


  // ============================================================
  // ADD PROJECT MEMBER
  // ============================================================

 // ============================================================
  // ADD PROJECT MEMBER
  // ============================================================

  const addProjectMember = async (
    projectId: string,
    email: string,
    role: ProjectRole
  ) => {

    try {

      setLoadingAddMember(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/projects/${projectId}/members`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email,
            role,
          }),
        }
      );

      const data: ApiResponse<{ member: ProjectMember }> =
        await res.json();

      if (!res.ok || !data.data) {

        setErrorMsg(
          data.message || "Error in adding project member"
        );

        throw new Error(
          data.message || "Error in adding project member"
        );
      }

      setMembers(prev => [
        ...prev,
        data.data!.member,
      ]);

      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingAddMember(false);

    }
  };


  // ============================================================
  // UPDATE MEMBER ROLE
  // ============================================================

  const updateProjectMemberRole = async (
    projectId: string,
    memberId: string,
    role: ProjectRole
  ) => {

    try {

      setLoadingUpdateMemberRole(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/projects/${projectId}/members/${memberId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            role,
          }),
        }
      );

      const data: ApiResponse<{ member: ProjectMember }> =
        await res.json();

      if (!res.ok || !data.data) {

        setErrorMsg(
          data.message ||
          "Error in updating project member role"
        );

        throw new Error(
          data.message ||
          "Error in updating project member role"
        );
      }

      const updatedMember = data.data.member;

      setMembers(prev =>
        prev.map(member =>
          member.id === memberId
            ? {
                ...member,
                ...updatedMember,
              }
            : member
        )
      );

      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingUpdateMemberRole(false);

    }
  };


  // ============================================================
  // REMOVE PROJECT MEMBER
  // ============================================================

  const removeProjectMember = async (
    projectId: string,
    memberId: string
  ) => {

    try {

      setLoadingRemoveMember(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/projects/${projectId}/members/${memberId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data: ApiResponse<null> =
        await res.json();

      if (!res.ok) {

        setErrorMsg(
          data.message ||
          "Error in removing project member"
        );

        throw new Error(
          data.message ||
          "Error in removing project member"
        );
      }

      setMembers(prev =>
        prev.filter(member => member.id !== memberId)
      );

      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingRemoveMember(false);

    }
  };


  // ============================================================
  // PROVIDER
  // ============================================================

  return (
    <MembersContext.Provider
      value={{

        members,
        loadingMembers,

        errorMsg,

        getProjectMembers,

        addProjectMember,
        loadingAddMember,

        updateProjectMemberRole,
        loadingUpdateMemberRole,

        removeProjectMember,
        loadingRemoveMember,

      }}
    >
      {children}
    </MembersContext.Provider>
  );
};


// ============================================================
// HOOK
// ============================================================

export const useMembersContext = () => {

  const context = useContext(MembersContext);

  if (!context) {

    throw new Error(
      "Please use the useMembersContext hook inside a MembersProvider"
    );

  }

  return context;
};