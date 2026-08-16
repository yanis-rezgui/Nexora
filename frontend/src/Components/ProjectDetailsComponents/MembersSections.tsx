// Components/ProjectDetailsComponents/MembersSection.tsx
import { memo, useState } from "react";
import { useMembersContext } from "../../Contexts/MembersContext";
import MemberCard from "./MemberCard";
import AddMemberModal from "./AddMemberModal";

interface Props {
  projectId: string;
  role: string;
  ownerId: string;
}

const MembersSection = ({ projectId, role, ownerId }: Props) => {
  const { members, loadingMembers } = useMembersContext();
  const canManage = role === "OWNER" || role === "MANAGER";
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div>
      <div className="max-[560px]:!flex-col max-[560px]:!items-stretch"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <h2 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 16, fontWeight: 600, color: "#F4F2EC", margin: 0 }}>
          Members
        </h2>
        {canManage && (
          <button
            onClick={() => setAddOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
              background: "#E8A33D", border: "none", borderRadius: 8,
              color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <i className="ti ti-user-plus" style={{ fontSize: 14 }} aria-hidden="true" />
            Add member
          </button>
        )}
      </div>

      {loadingMembers ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ height: 60, borderRadius: 12, background: "#15161B", border: "1px solid rgba(255,255,255,0.06)" }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {members.map((member, i) => (
            <MemberCard
              key={member.id}
              member={member}
              index={i}
              projectId={projectId}
              currentRole={role}
              isOwner={member.id === ownerId}
            />
          ))}
        </div>
      )}

      <AddMemberModal open={addOpen} onClose={() => setAddOpen(false)} projectId={projectId} />
    </div>
  );
};

export default memo(MembersSection);