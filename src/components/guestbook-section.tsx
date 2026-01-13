import { useState, useEffect } from "react";
import GuestbookForm from "./guestbook-form";

interface GuestbookEntry {
  _id: string;
  name: string;
  website?: string;
  message: string;
  createdAt: string;
}

export default function GuestbookSection() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/guestbook");
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error("Failed to fetch guestbook entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEntries();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    );
  };

  return (
    <>
      <GuestbookForm onSuccess={() => setTimeout(() => fetchEntries(), 2000)} />

      <div className="mt-12">
        <h2 className="font-serif text-xl font-semibold mb-6">
          {loading ? "Loading..." : `${entries.length} ${entries.length === 1 ? "message" : "messages"}`}
        </h2>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading messages...</p>
        ) : entries.length > 0 ? (
          <div className="space-y-6">
            {entries.map((entry) => (
              <article
                key={entry._id}
                className="border-b border-gray-100 dark:border-neutral-800 pb-6 last:border-0"
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-medium">
                    {entry.website ? (
                      <a
                        href={entry.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent dark:hover:text-accent-light transition-colors"
                      >
                        {entry.name}
                      </a>
                    ) : (
                      entry.name
                    )}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(entry.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {entry.message}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            No messages yet. Be the first to sign!
          </p>
        )}
      </div>
    </>
  );
}
