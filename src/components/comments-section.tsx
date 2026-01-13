import { useState, useEffect, useCallback } from "react";
import CommentForm from "./comment-form";
import { getRandomSparkle } from "../utils/sparkles";

interface Comment {
  _id: string;
  name: string;
  email: string;
  website?: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
}

interface CommentsSectionProps {
  parentType: "trip" | "note";
  parentSlug: string;
}

export default function CommentsSection({ parentType, parentSlug }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [ownedCommentIds, setOwnedCommentIds] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sparkle] = useState(getRandomSparkle);

  const handleEdit = (commentId: string) => {
    setEditingId(commentId);
    // Scroll to form
    document
      .getElementById("comment-form")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/comments?parentType=${encodeURIComponent(parentType)}&parentSlug=${encodeURIComponent(parentSlug)}`
      );
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  }, [parentType, parentSlug]);

  useEffect(() => {
    void fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    const owned = new Set<string>();
    comments.forEach((comment) => {
      const token = localStorage.getItem(`comment_token_${comment._id}`);
      if (token) {
        owned.add(comment._id);
      }
    });
    setOwnedCommentIds(owned);
  }, [comments]);

  const handleDelete = async (commentId: string) => {
    if (!confirm("Delete this comment?")) {
      return;
    }

    setDeletingId(commentId);
    const editToken = localStorage.getItem(`comment_token_${commentId}`);

    try {
      const response = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: commentId, editToken }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Failed to delete");
        setDeletingId(null);
        return;
      }

      localStorage.removeItem(`comment_token_${commentId}`);
      await fetchComments();
      setDeletingId(null);
    } catch {
      alert("Failed to delete");
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const editingComment = editingId ? comments.find((c) => c._id === editingId) : null;

  return (
    <section className="mt-16 pt-8 border-t border-dashed border-stone-200 dark:border-stone-700">
      <div className="mb-6 overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 py-1">
        <div className="animate-marquee whitespace-nowrap font-mono text-sm text-stone-500 dark:text-stone-400">
          <span className="mx-4">
            {sparkle} Welcome to the comment zone {sparkle}
          </span>
          <span className="mx-4">~*~ Thanks for reading ~*~</span>
          <span className="mx-4">
            {sparkle} Welcome to the comment zone {sparkle}
          </span>
          <span className="mx-4">~*~ Thanks for reading ~*~</span>
        </div>
      </div>

      <h2 className="font-serif text-2xl font-bold mb-2">
        {comments.length > 0
          ? `${comments.length} ${comments.length === 1 ? "comment" : "comments"}`
          : "Comments"}
      </h2>

      {comments.length > 0 && (
        <p className="text-sm text-stone-400 dark:text-stone-500 mb-6 font-mono">
          ↳ you could be #{comments.length + 1}!
        </p>
      )}

      {/* Form at the top */}
      <div id="comment-form">
        <CommentForm
          parentType={parentType}
          parentSlug={parentSlug}
          editingComment={
            editingComment
              ? {
                  id: editingComment._id,
                  name: editingComment.name,
                  email: editingComment.email,
                  website: editingComment.website,
                  message: editingComment.message,
                }
              : undefined
          }
          onCancelEdit={() => setEditingId(null)}
          onSuccess={() => {
            setEditingId(null);
            // Small delay to let Sanity propagate the new comment
            setTimeout(() => fetchComments(), 2000);
          }}
        />
      </div>

      {/* Comments */}
      {loading ? (
        <p className="text-stone-500 dark:text-stone-400 font-mono text-sm">Loading comments...</p>
      ) : comments.length > 0 ? (
        <div className="space-y-8">
          {comments.map((comment, index) => (
            <article key={comment._id} className="group">
              <div className="flex items-start gap-3">
                {/* Numbered avatar */}
                <div className="shrink-0 size-10 rounded-sm bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-mono font-bold text-sm border-2 border-orange-200 dark:border-orange-800">
                  #{index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    {comment.website ? (
                      <a
                        href={comment.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-orange-700 dark:text-orange-400 hover:underline"
                      >
                        {comment.name}
                      </a>
                    ) : (
                      <span className="font-semibold">{comment.name}</span>
                    )}
                    <span className="text-sm text-stone-400 dark:text-stone-500 font-mono">
                      ✧ {formatDate(comment.createdAt)}
                      {comment.updatedAt && " · edited"}
                    </span>

                    {ownedCommentIds.has(comment._id) && (
                      <span className="text-sm space-x-2 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                        <button
                          onClick={() => handleEdit(comment._id)}
                          className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                          disabled={deletingId === comment._id}
                        >
                          [edit]
                        </button>
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="text-stone-400 hover:text-red-500 dark:hover:text-red-400"
                          disabled={deletingId === comment._id}
                        >
                          {deletingId === comment._id ? "[...]" : "[del]"}
                        </button>
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                    {comment.message}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-stone-500 dark:text-stone-400 font-mono text-sm">No comments yet.</p>
      )}
    </section>
  );
}
