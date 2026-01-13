import { useState, useEffect } from "react";
import {
  RetroForm,
  RetroInput,
  RetroTextarea,
  RetroButton,
  RetroLabel,
  RetroCharCount,
} from "./ui/retro-form";

interface CommentFormProps {
  parentType: "trip" | "note";
  parentSlug: string;
  editingComment?: {
    id: string;
    name: string;
    email: string;
    website?: string;
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isEditing = !!editingComment;

  // Load fields when editing, or from localStorage when not
  useEffect(() => {
    setStatus("idle");
    setErrorMessage("");
    if (editingComment) {
      setName(editingComment.name);
      setEmail(editingComment.email);
      setWebsite(editingComment.website || "");
      setMessage(editingComment.message);
    } else {
      const savedName = localStorage.getItem("comment_name");
      const savedEmail = localStorage.getItem("comment_email");
      const savedWebsite = localStorage.getItem("comment_website");
      setName(savedName || "");
      setEmail(savedEmail || "");
      setWebsite(savedWebsite || "");
      setMessage("");
    }
  }, [editingComment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      if (isEditing) {
        const editToken = localStorage.getItem(`comment_token_${editingComment.id}`);
        if (!editToken) {
          throw new Error("Edit token not found");
        }

        const response = await fetch("/api/comments", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingComment.id,
            editToken,
            name,
            email,
            website: website || undefined,
            message,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Something went wrong");
        }
      } else {
        const response = await fetch("/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
          throw new Error(data.error || "Something went wrong");
        }

        const data = await response.json();

        if (data.editToken) {
          localStorage.setItem(`comment_token_${data.id}`, data.editToken);
        }

        localStorage.setItem("comment_name", name);
        localStorage.setItem("comment_email", email);
        if (website) {
          localStorage.setItem("comment_website", website);
        }
      }

      setStatus("success");
      setMessage("");

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      }, 1500);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <RetroForm onSubmit={handleSubmit} className="mb-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <RetroLabel htmlFor="comment-name" required>
            Name
          </RetroLabel>
          <RetroInput
            type="text"
            id="comment-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            placeholder="Your name"
            disabled={status === "submitting"}
          />
        </div>
        <div>
          <RetroLabel htmlFor="comment-email" required hint="(secret!)">
            Email
          </RetroLabel>
          <RetroInput
            type="email"
            id="comment-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            disabled={status === "submitting"}
          />
        </div>
      </div>

      <div>
        <RetroLabel htmlFor="comment-website" optional>
          Website
        </RetroLabel>
        <RetroInput
          type="url"
          id="comment-website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://yoursite.com"
          disabled={status === "submitting"}
        />
      </div>

      <div>
        <RetroLabel htmlFor="comment-message" required>
          {isEditing ? "Edit your comment" : "Comment"}
        </RetroLabel>
        <RetroTextarea
          id="comment-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={1000}
          rows={4}
          placeholder="Leave a comment..."
          disabled={status === "submitting"}
        />
        <RetroCharCount current={message.length} max={1000} />
      </div>

      {status === "error" && <p className="text-red-600 text-sm font-bold">{errorMessage}</p>}
      {status === "success" && (
        <p className="text-green-700 text-sm font-bold">
          {isEditing ? "Updated!" : "Posted!"} ✓{" "}
          <span className="font-normal text-gray-600">showing in a sec...</span>
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
        <RetroButton type="submit" disabled={status === "submitting"}>
          {status === "submitting"
            ? isEditing
              ? "Saving..."
              : "Posting..."
            : isEditing
              ? "Save"
              : "Post Comment"}
        </RetroButton>

        {isEditing && onCancelEdit && (
          <RetroButton type="button" onClick={onCancelEdit} disabled={status === "submitting"}>
            Cancel
          </RetroButton>
        )}
      </div>
    </RetroForm>
  );
}
