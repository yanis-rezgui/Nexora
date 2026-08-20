import { memo, useEffect, useState } from "react";
import { useCommentsContext } from "../../Contexts/CommentsContext";
import { useAuthContext } from "../../Contexts/AuthContext";
import type { Comment } from "../../Types/Types";

interface Props {
  taskId: string;
  canModerate: boolean; // OWNER / MANAGER du projet
}

const TaskComments = ({ taskId, canModerate }: Props) => {
  const {
    comments, loadingComments, getTaskComments,
    createComment, loadingCreateComment,
    updateComment, deleteComment,
  } = useCommentsContext();
  const { user } = useAuthContext();

  const [content, setContent] = useState("");

  useEffect(() => {
    getTaskComments(taskId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await createComment(taskId, content.trim());
    setContent("");
  };

  return (
    <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <h3 style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 600,
        letterSpacing: "0.06em", textTransform: "uppercase", color: "#8D897E", margin: "0 0 12px",
      }}>
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      {loadingComments ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} style={{ height: 44, borderRadius: 10, background: "#0D0E12", border: "1px solid rgba(255,255,255,0.06)" }} />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#5B5850", margin: "0 0 14px" }}>
          No comments yet.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14, maxHeight: 260, overflowY: "auto" }}>
          {comments.map(c => (
            <CommentItem
              key={c.id}
              comment={c}
              isAuthor={c.authorId === user?.id}
              canModerate={canModerate}
              onUpdate={(newContent) => updateComment(c.id, newContent)}
              onDelete={() => deleteComment(c.id)}
            />
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write a comment…"
          maxLength={2000}
          style={{
            flex: 1, background: "#0D0E12", border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 8, padding: "9px 12px", color: "#F4F2EC",
            fontFamily: "'Inter', sans-serif", fontSize: 12.5, outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loadingCreateComment || !content.trim()}
          style={{
            padding: "9px 14px", background: "#E8A33D", border: "none", borderRadius: 8,
            color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600,
            cursor: loadingCreateComment || !content.trim() ? "not-allowed" : "pointer",
            opacity: loadingCreateComment || !content.trim() ? 0.55 : 1, flexShrink: 0,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};


// ============================================================
// Un commentaire
// ============================================================

interface ItemProps {
  comment: Comment;
  isAuthor: boolean;
  canModerate: boolean;
  onUpdate: (content: string) => void;
  onDelete: () => void;
}

const CommentItem = ({ comment, isAuthor, canModerate, onUpdate, onDelete }: ItemProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);

  const canDelete = isAuthor || canModerate;

  const saveEdit = () => {
    if (draft.trim() && draft.trim() !== comment.content) onUpdate(draft.trim());
    setEditing(false);
  };

  return (
    <div style={{ background: "#0D0E12", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: "#F4F2EC" }}>
          {comment.author?.firstName} {comment.author?.lastName}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#5B5850" }}>
            {new Date(comment.createdAt).toLocaleString()}
          </span>
          {isAuthor && !editing && (
            <button onClick={() => { setDraft(comment.content); setEditing(true); }} aria-label="Edit comment" style={iconBtn}>
              <i className="ti ti-pencil" style={{ fontSize: 12 }} aria-hidden="true" />
            </button>
          )}
          {canDelete && (
            <button onClick={onDelete} aria-label="Delete comment" style={{ ...iconBtn, color: "#E8654F" }}>
              <i className="ti ti-trash" style={{ fontSize: 12 }} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <div style={{ display: "flex", gap: 6 }}>
          <input
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === "Enter" && saveEdit()}
            style={{
              flex: 1, background: "#15161B", border: "1px solid rgba(232,163,61,0.4)",
              borderRadius: 6, padding: "6px 9px", color: "#F4F2EC",
              fontFamily: "'Inter', sans-serif", fontSize: 12, outline: "none",
            }}
          />
          <button onClick={saveEdit} style={{ ...iconBtn, color: "#5FBF8B" }} aria-label="Save">
            <i className="ti ti-check" style={{ fontSize: 13 }} aria-hidden="true" />
          </button>
          <button onClick={() => setEditing(false)} style={iconBtn} aria-label="Cancel">
            <i className="ti ti-x" style={{ fontSize: 13 }} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#C9C5B9", margin: 0, lineHeight: 1.5, wordBreak: "break-word" }}>
          {comment.content}
        </p>
      )}
    </div>
  );
};

const iconBtn: React.CSSProperties = {
  width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
  background: "transparent", border: "none", color: "#5B5850", cursor: "pointer", padding: 0,
};

export default memo(TaskComments);