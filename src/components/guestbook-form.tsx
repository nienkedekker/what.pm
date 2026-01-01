import { useState } from 'react';

export default function GuestbookForm() {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, website: website || undefined, message, _gotcha: honeypot }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      setName('');
      setWebsite('');
      setMessage('');

      // Reload page after short delay to show new entry
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const inputClass =
    'w-full px-3 py-2 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-light focus:border-transparent transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
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
          <label htmlFor="website" className="block text-sm font-medium mb-1">
            Website <span className="text-gray-400 dark:text-gray-500">(optional)</span>
          </label>
          <input
            type="url"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yoursite.com"
            className={inputClass}
            disabled={status === 'submitting'}
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={500}
          rows={3}
          placeholder="Leave a message..."
          className={inputClass + ' resize-none'}
          disabled={status === 'submitting'}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {message.length}/500 characters
        </p>
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      )}

      {status === 'success' && (
        <p className="text-green-600 dark:text-green-400 text-sm">
          Thanks for signing! Reloading...
        </p>
      )}

      {/* Honeypot field - hidden from humans, bots will fill it */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="_gotcha">Don't fill this out</label>
        <input
          type="text"
          id="_gotcha"
          name="_gotcha"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="px-4 py-2 bg-accent dark:bg-accent-light text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Signing...' : 'Sign Guestbook'}
      </button>
    </form>
  );
}
