import { useState, useEffect } from 'react';
import CommentForm from './comment-form';

interface Comment {
  _id: string;
  name: string;
  website?: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
}

interface CommentsSectionProps {
  parentType: 'trip' | 'note';
  parentSlug: string;
}

export default function CommentsSection({ parentType, parentSlug }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [ownedCommentIds, setOwnedCommentIds] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch comments via our API endpoint
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `/api/comments?parentType=${encodeURIComponent(parentType)}&parentSlug=${encodeURIComponent(parentSlug)}`
      );
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [parentType, parentSlug]);

  // Check which comments the user owns (has edit tokens for)
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
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setDeletingId(commentId);
    const editToken = localStorage.getItem(`comment_token_${commentId}`);

    try {
      const response = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId, editToken }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete comment');
      }

      // Remove token from localStorage
      localStorage.removeItem(`comment_token_${commentId}`);

      // Refetch comments
      await fetchComments();
      setDeletingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete comment');
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }) +
      ' at ' +
      date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    );
  };

  const editingComment = editingId ? comments.find((c) => c._id === editingId) : null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="font-serif text-2xl font-bold mb-6">Comments</h2>

      {/* Comment form - now at the top */}
      <div className="mb-10">
        <CommentForm
          parentType={parentType}
          parentSlug={parentSlug}
          editingComment={
            editingComment
              ? { id: editingComment._id, message: editingComment.message }
              : undefined
          }
          onCancelEdit={() => setEditingId(null)}
          onSuccess={() => {
            setEditingId(null);
            fetchComments();
          }}
        />
      </div>

      {/* Comments list */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading comments...</p>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <article
              key={comment._id}
              className="border-b border-gray-100 dark:border-neutral-800 pb-6 last:border-0"
            >
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium">
                    {comment.website ? (
                      <a
                        href={comment.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent dark:hover:text-accent-light transition-colors"
                      >
                        {comment.name}
                      </a>
                    ) : (
                      comment.name
                    )}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(comment.createdAt)}
                    {comment.updatedAt && ' (edited)'}
                  </span>
                </div>

                {ownedCommentIds.has(comment._id) && (
                  <div className="flex gap-3 text-sm">
                    <button
                      onClick={() => setEditingId(comment._id)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      disabled={deletingId === comment._id}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                      disabled={deletingId === comment._id}
                    >
                      {deletingId === comment._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comment.message}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No comments yet. Be the first to comment!</p>
      )}
    </section>
  );
}
