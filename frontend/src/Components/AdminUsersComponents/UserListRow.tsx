// Components/AdminComponents/UserListRow.tsx
import { memo } from "react";
import { motion } from "framer-motion";

interface UserListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  projectCount: number;
  taskCount: number;
}

interface UserListRowProps {
  user: UserListItem;
  index: number;
  onView: (userId: string) => void;
  onToggleSuspend: (user: UserListItem) => void;
}

const initials = (first: string, last: string) => `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

const UserListRow = ({ user, index, onView, onToggleSuspend }: UserListRowProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.24) }}
    onClick={() => onView(user.id)}
    style={{
      display: "flex", alignItems: "center", gap: 14,
      background: "#15161B", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 12, padding: "13px 15px", cursor: "pointer",
      transition: "border-color 0.15s",
    }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.3)")}
    onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
  >
    {/* Avatar */}
    <div
      style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: user.role === "ADMIN" ? "rgba(232,163,61,0.14)" : "rgba(123,155,232,0.14)",
        border: `1px solid ${user.role === "ADMIN" ? "rgba(232,163,61,0.35)" : "rgba(123,155,232,0.35)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600,
        color: user.role === "ADMIN" ? "#E8A33D" : "#7B9BE8",
      }}>
        {initials(user.firstName, user.lastName)}
      </span>
    </div>

    {/* Name + email */}
    <div style={{ minWidth: 0, flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500, color: "#F4F2EC",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {user.firstName} {user.lastName}
        </span>
        {user.role === "ADMIN" && (
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: "0.04em",
            color: "#E8A33D", background: "rgba(232,163,61,0.12)", border: "1px solid rgba(232,163,61,0.35)",
            borderRadius: 5, padding: "2px 6px", flexShrink: 0,
          }}>
            ADMIN
          </span>
        )}
        <span style={{
          display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
          fontFamily: "'Inter', sans-serif", fontSize: 10.5,
          color: user.isActive ? "#5FBF8B" : "#E8654F",
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%",
            background: user.isActive ? "#5FBF8B" : "#E8654F",
          }} />
          {user.isActive ? "Active" : "Suspended"}
        </span>
      </div>
      <span style={{
        fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#8D897E",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block",
      }}>
        {user.email}
      </span>
    </div>

    {/* Counts — hidden on narrow screens */}
    <div className="max-[720px]:hidden" style={{ display: "flex", alignItems: "center", gap: 18, flexShrink: 0 }}>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "#C9C5B9" }}>{user.projectCount}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9.5, color: "#5B5850" }}>projects</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "#C9C5B9" }}>{user.taskCount}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9.5, color: "#5B5850" }}>tasks</div>
      </div>
    </div>

    <span
      className="max-[560px]:hidden"
      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850", flexShrink: 0, width: 78 }}
    >
      {new Date(user.createdAt).toLocaleDateString()}
    </span>

    {/* Actions */}
    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
      <button
        onClick={() => onToggleSuspend(user)}
        aria-label={user.isActive ? "Suspend user" : "Unsuspend user"}
        style={{
          width: 30, height: 30, borderRadius: 7, border: "1px solid rgba(255,255,255,0.08)",
          background: "transparent", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: user.isActive ? "#8D897E" : "#5FBF8B",
          transition: "border-color 0.15s, color 0.15s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = user.isActive ? "rgba(232,101,79,0.4)" : "rgba(95,191,139,0.4)";
          e.currentTarget.style.color = user.isActive ? "#E8654F" : "#5FBF8B";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          e.currentTarget.style.color = user.isActive ? "#8D897E" : "#5FBF8B";
        }}
      >
        <i className={`ti ${user.isActive ? "ti-lock" : "ti-lock-open"}`} style={{ fontSize: 14 }} aria-hidden="true" />
      </button>
      <button
        onClick={() => onView(user.id)}
        aria-label="View user"
        style={{
          width: 30, height: 30, borderRadius: 7, border: "1px solid rgba(255,255,255,0.08)",
          background: "transparent", color: "#8D897E", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "border-color 0.15s, color 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(232,163,61,0.4)"; e.currentTarget.style.color = "#E8A33D"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#8D897E"; }}
      >
        <i className="ti ti-chevron-right" style={{ fontSize: 14 }} aria-hidden="true" />
      </button>
    </div>
  </motion.div>
);

export default memo(UserListRow);
