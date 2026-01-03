import { useState, useEffect } from 'react';

interface CommentFormProps {
  parentType: 'trip' | 'note';
  parentSlug: string;
  editingComment?: {
    id: string;
    message: string;
  };
  onCancelEdit?: () => void;
  onSuccess?: () => void;
}

export default function CommentForm({
  parentType,
  parentSlug,
  editingComment,
  onCancelEdit,
  onSuccess,
}: CommentFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = !!editingComment;

  // Load saved name/email/website from localStorage
  useEffect(() => {
    if (!isEditing) {
      const savedName = localStorage.getItem('comment_name');
      const savedEmail = localStorage.getItem('comment_email');
      const savedWebsite = localStorage.getItem('comment_website');
      if (savedName) setName(savedName);
      if (savedEmail) setEmail(savedEmail);
      if (savedWebsite) setWebsite(savedWebsite);
    }
  }, [isEditing]);

  // Set message when editing
  useEffect(() => {
    if (editingComment) {
      setMessage(editingComment.message);
    }
  }, [editingComment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      if (isEditing) {
        // Update existing comment
        const editToken = localStorage.getItem(`comment_token_${editingComment.id}`);
        if (!editToken) {
          throw new Error('Edit token not found');
        }

        const response = await fetch('/api/comments', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingComment.id,
            editToken,
            message,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Something went wrong');
        }
      } else {
        // Create new comment
        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            website: website || undefined,
            message,
            parentType,
            parentSlug,
            _gotcha: honeypot,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Something went wrong');
        }

        const data = await response.json();

        // Save edit token to localStorage
        if (data.editToken) {
          localStorage.setItem(`comment_token_${data.id}`, data.editToken);
        }

        // Save user info for future comments
        localStorage.setItem('comment_name', name);
        localStorage.setItem('comment_email', email);
        if (website) {
          localStorage.setItem('comment_website', website);
        }
      }

      setStatus('success');
      setMessage('');

      // Callback after short delay
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      }, 1500);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const inputClass =
    'w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-light focus:border-transparent transition-colors';

  const labelClass = 'block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isEditing && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="comment-name" className={labelClass}>
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="comment-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                placeholder="Your name"
                className={inputClass}
                disabled={status === 'submitting'}
              />
            </div>
            <div>
              <label htmlFor="comment-email" className={labelClass}>
                Email <span className="text-red-500">*</span>
                <span className="text-gray-400 dark:text-gray-500 font-normal"> (not displayed)</span>
              </label>
              <input
                type="email"
                id="comment-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className={inputClass}
                disabled={status === 'submitting'}
              />
            </div>
          </div>
          <div>
            <label htmlFor="comment-website" className={labelClass}>
              Website <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              id="comment-website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yoursite.com"
              className={inputClass}
              disabled={status === 'submitting'}
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor="comment-message" className={labelClass}>
          {isEditing ? 'Edit your comment' : 'Comment'} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="comment-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={1000}
          rows={4}
          placeholder="Leave a comment..."
          className={inputClass + ' resize-none'}
          disabled={status === 'submitting'}
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{message.length}/1000</p>
      </div>

      {status === 'error' && (
        <p className="text-red-600 dark:text-red-400 text-sm">{errorMessage}</p>
      )}

      {status === 'success' && (
        <p className="text-green-600 dark:text-green-400 text-sm">
          {isEditing ? 'Comment updated!' : 'Comment posted!'}
        </p>
      )}

      {/* Honeypot field */}
      {!isEditing && (
        <div aria-hidden="true" className="absolute left-[-9999px]">
          <label htmlFor="comment-gotcha">Don't fill this out</label>
          <input
            type="text"
            id="comment-gotcha"
            name="_gotcha"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="px-4 py-2 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:bg-gray-700 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'submitting'
            ? isEditing
              ? 'Saving...'
              : 'Posting...'
            : isEditing
              ? 'Save Changes'
              : 'Post Comment'}
        </button>

        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={status === 'submitting'}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
