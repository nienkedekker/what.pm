import type { APIRoute } from "astro";
import { writeClient } from "@/sanity/writeClient.ts";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const entries = await writeClient.fetch(
      `*[_type == "guestbookEntry"] | order(createdAt desc) {
        _id,
        name,
        website,
        message,
        createdAt
      }`
    );

    return new Response(JSON.stringify({ entries }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch guestbook entries:", error);
    return new Response(JSON.stringify({ entries: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, website, message, _gotcha } = body;

    // Honeypot check - if filled, silently reject (bots think it worked)
    if (_gotcha) {
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate lengths
    if (name.length > 100) {
      return new Response(JSON.stringify({ error: "Name must be 100 characters or less" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (message.length > 500) {
      return new Response(JSON.stringify({ error: "Message must be 500 characters or less" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate website URL if provided
    if (website) {
      try {
        new URL(website);
      } catch {
        return new Response(JSON.stringify({ error: "Invalid website URL" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Create the guestbook entry
    const entry = await writeClient.create({
      _type: "guestbookEntry",
      name: name.trim(),
      website: website || undefined,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true, id: entry._id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Guestbook submission error:", error);
    return new Response(JSON.stringify({ error: "Failed to save entry" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
