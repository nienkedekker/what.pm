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
    'w-full px-2 py-1 font-mono text-sm bg-white text-black border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-bold mb-1 text-black">
            Name <span className="text-red-600">*</span>
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
          <label htmlFor="website" className="block text-sm font-bold mb-1 text-black">
            Website <span className="text-gray-600">(optional)</span>
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
        <label htmlFor="message" className="block text-sm font-bold mb-1 text-black">
          Message <span className="text-red-600">*</span>
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
        <p className="text-xs text-gray-700 mt-1 font-mono">
          {message.length}/500 characters
        </p>
      </div>

      {status === 'error' && (
        <p className="text-red-600 text-sm font-bold">{errorMessage}</p>
      )}

      {status === 'success' && (
        <p className="text-green-700 text-sm font-bold">
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
        className="px-4 py-1.5 bg-[#c0c0c0] text-black font-bold border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 hover:bg-[#d0d0d0] active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Signing...' : 'Sign Guestbook'}
      </button>
    </form>
  );
}
