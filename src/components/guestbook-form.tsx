import { useState } from "react";
import {
  RetroForm,
  RetroInput,
  RetroTextarea,
  RetroButton,
  RetroLabel,
  RetroCharCount,
} from "./ui/retro-form";

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

      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <RetroForm onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <RetroLabel htmlFor="name" required>
            Name
          </RetroLabel>
          <RetroInput
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            placeholder="Your name"
            disabled={status === "submitting"}
          />
        </div>
        <div>
          <RetroLabel htmlFor="website" optional>
            Website
          </RetroLabel>
          <RetroInput
            type="url"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yoursite.com"
            disabled={status === "submitting"}
          />
        </div>
      </div>

      <div>
        <RetroLabel htmlFor="message" required>
          Message
        </RetroLabel>
        <RetroTextarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={500}
          rows={3}
          placeholder="Leave a message..."
          disabled={status === "submitting"}
        />
        <RetroCharCount current={message.length} max={500} />
      </div>

      {status === "error" && <p className="text-red-600 text-sm font-bold">{errorMessage}</p>}
      {status === "success" && (
        <p className="text-sm text-stone-700 dark:text-stone-300">Done! Showing in a sec...</p>
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

      <RetroButton type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Signing..." : "Sign Guestbook"}
      </RetroButton>
    </RetroForm>
  );
}
