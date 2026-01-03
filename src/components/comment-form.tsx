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

        if (data.editToken) {
          localStorage.setItem(`comment_token_${data.id}`, data.editToken);
        }

        localStorage.setItem('comment_name', name);
        localStorage.setItem('comment_email', email);
        if (website) {
          localStorage.setItem('comment_website', website);
        }
      }

      setStatus('success');
      setMessage('');

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
    'w-full px-2 py-1 font-mono text-sm bg-white text-black border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white focus:outline-none focus:ring-2 focus:ring-orange-400';

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600"
    >
      {!isEditing && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="comment-name" className="block text-sm font-bold mb-1 text-black">
                Name <span className="text-red-600">*</span>
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
              <label htmlFor="comment-email" className="block text-sm font-bold mb-1 text-black">
                Email <span className="text-red-600">*</span>
                <span className="text-gray-600 font-normal"> (secret!)</span>
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
            <label htmlFor="comment-website" className="block text-sm font-bold mb-1 text-black">
              Website <span className="text-gray-600 font-normal">(optional)</span>
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
        <label htmlFor="comment-message" className="block text-sm font-bold mb-1 text-black">
          {isEditing ? 'Edit your comment' : 'Comment'} <span className="text-red-600">*</span>
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
        <p className="text-xs text-gray-700 mt-1 font-mono">{message.length}/1000</p>
      </div>

      {status === 'error' && <p className="text-red-600 text-sm font-bold">{errorMessage}</p>}

      {status === 'success' && (
        <p className="text-green-700 text-sm font-bold">
          {isEditing ? 'Updated!' : 'Posted!'} ✓ <span className="font-normal text-gray-600">showing in a sec...</span>
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

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="px-4 py-1.5 bg-[#c0c0c0] text-black font-bold border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 hover:bg-[#d0d0d0] active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'submitting'
            ? isEditing
              ? 'Saving...'
              : 'Posting...'
            : isEditing
              ? 'Save'
              : 'Post Comment'}
        </button>

        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={status === 'submitting'}
            className="px-4 py-1.5 bg-[#c0c0c0] text-black font-bold border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 hover:bg-[#d0d0d0] active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
