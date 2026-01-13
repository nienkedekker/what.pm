import { useState } from "react";

interface GuestbookFormProps {
  onSuccess?: () => void;
}

export default function GuestbookForm({ onSuccess }: GuestbookFormProps) {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, website: website || undefined, message, _gotcha: honeypot }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setName("");
      setWebsite("");
      setMessage("");

      // Notify parent to refresh entries
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const inputClass =
    "w-full px-2 py-1 font-mono text-sm bg-white dark:bg-neutral-800 text-black dark:text-gray-100 border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white dark:border-t-neutral-950 dark:border-l-neutral-950 dark:border-b-neutral-600 dark:border-r-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-[#c0c0c0] dark:bg-neutral-700 border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 dark:border-t-neutral-600 dark:border-l-neutral-600 dark:border-b-neutral-900 dark:border-r-neutral-900"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-bold mb-1 text-black dark:text-gray-100">
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
            disabled={status === "submitting"}
          />
        </div>
        <div>
          <label htmlFor="website" className="block text-sm font-bold mb-1 text-black dark:text-gray-100">
            Website <span className="text-gray-500 dark:text-gray-400">(optional)</span>
          </label>
          <input
            type="url"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yoursite.com"
            className={inputClass}
            disabled={status === "submitting"}
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-bold mb-1 text-black dark:text-gray-100">
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
          className={inputClass + " resize-none"}
          disabled={status === "submitting"}
        />
        <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-mono">{message.length}/500 characters</p>
      </div>

      {status === "error" && <p className="text-red-600 text-sm font-bold">{errorMessage}</p>}

      {status === "success" && (
        <p className="text-green-700 text-sm font-bold">Thanks for signing!</p>
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
        disabled={status === "submitting"}
        className="px-4 py-1.5 bg-[#c0c0c0] dark:bg-neutral-600 text-black dark:text-gray-100 font-bold border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 dark:border-t-neutral-500 dark:border-l-neutral-500 dark:border-b-neutral-800 dark:border-r-neutral-800 hover:bg-[#d0d0d0] dark:hover:bg-neutral-500 active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white dark:active:border-t-neutral-800 dark:active:border-l-neutral-800 dark:active:border-b-neutral-500 dark:active:border-r-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Signing..." : "Sign Guestbook"}
      </button>
    </form>
  );
}
