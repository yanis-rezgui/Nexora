// Components/ProjectDetailsComponents/MemberCard.tsx
import { memo, useState } from "react";
import { motion } from "framer-motion";
import { useMembersContext } from "../../Contexts/MembersContext";
import type { ProjectMember, ProjectRole } from "../../Types/Types";
import ConfirmDeleteModal from "../ProjectsComponents/ConfirmDeleteModal";


const ROLE_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  OWNER:     { color: "#E8A33D", bg: "rgba(232,163,61,0.12)", border: "rgba(232,163,61,0.35)" },
  MANAGER:   { color: "#7B9BE8", bg: "rgba(123,155,232,0.12)", border: "rgba(123,155,232,0.35)" },
  DEVELOPER: { color: "#5FBF8B", bg: "rgba(95,191,139,0.12)", border: "rgba(95,191,139,0.35)" },
};

interface Props {
  member: ProjectMember;
  index?: number;
  projectId: string;
  currentRole: string;
  isOwner: boolean;
}

const MemberCard = ({ member, index = 0, projectId, currentRole, isOwner }: Props) => {
  const { updateProjectMemberRole, removeProjectMember, loadingRemoveMember } = useMembersContext();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const style = ROLE_STYLE[isOwner ? "OWNER" : member.role] ?? ROLE_STYLE.DEVELOPER;
  const canManage = !isOwner && (currentRole === "OWNER" || (currentRole === "MANAGER" && member.role !== "MANAGER"));
  const canChangeRole = currentRole === "OWNER" && !isOwner;

  const initials = `${member.firstName?.[0] ?? ""}${member.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.2) }}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        background: "#15161B", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, padding: "12px 16px",
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg, #E8A33D, #F2C368)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#151116",
      }}>
        {initials}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#F4F2EC" }}>
          {member.firstName} {member.lastName}
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#8D897E" }}>
          {member.email}
        </div>
      </div>

      {canChangeRole ? (
        <select
          value={member.role}
          onChange={e => updateProjectMemberRole(projectId, member.id, e.target.value as ProjectRole)}
          style={{
            background: style.bg, border: `1px solid ${style.border}`, borderRadius: 6,
            color: style.color, fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            padding: "4px 6px", outline: "none",
          }}
        >
          <option value="MANAGER">MANAGER</option>
          <option value="DEVELOPER">DEVELOPER</option>
        </select>
      ) : (
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 600,
          color: style.color, background: style.bg, border: `1px solid ${style.border}`,
          borderRadius: 5, padding: "3px 8px", flexShrink: 0,
        }}>
          {isOwner ? "OWNER" : member.role}
        </span>
      )}

      {canManage && (
        <button
          onClick={() => setConfirmOpen(true)}
          aria-label="Remove member"
          style={{
            width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent", border: "none", color: "#5B5850", cursor: "pointer", flexShrink: 0,
          }}
        >
          <i className="ti ti-x" style={{ fontSize: 14 }} aria-hidden="true" />
        </button>
      )}

      <ConfirmDeleteModal
        open={confirmOpen}
        title="Remove member"
        description={`Remove ${member.firstName} ${member.lastName} from this project?`}
        loading={loadingRemoveMember}
        onConfirm={async () => { await removeProjectMember(projectId, member.id); setConfirmOpen(false); }}
        onClose={() => setConfirmOpen(false)}
      />
    </motion.div>
  );
};

export default memo(MemberCard);