import type { APIRoute } from "astro";
import { writeClient } from "@/sanity/writeClient.ts";
import { nanoid } from "nanoid";

export const prerender = false;

// GET comments for a parent
export const GET: APIRoute = async ({ url }) => {
  try {
    const parentType = url.searchParams.get("parentType");
    const parentSlug = url.searchParams.get("parentSlug");

    if (!parentType || !parentSlug) {
      return new Response(JSON.stringify({ error: "parentType and parentSlug are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const comments = await writeClient.fetch(
      `*[_type == "comment" && parentType == $parentType && parentSlug == $parentSlug] | order(createdAt asc) {
        _id,
        name,
        email,
        website,
        message,
        createdAt,
        updatedAt
      }`,
      { parentType, parentSlug }
    );

    return new Response(JSON.stringify({ comments }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch comments" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// Helper to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// CREATE comment
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, website, message, parentType, parentSlug, _gotcha } = body;

    // Honeypot check
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

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Valid email is required" }), {
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

    if (!parentType || !["trip", "note"].includes(parentType)) {
      return new Response(JSON.stringify({ error: "Invalid parent type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!parentSlug || typeof parentSlug !== "string") {
      return new Response(JSON.stringify({ error: "Parent slug is required" }), {
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

    if (message.length > 1000) {
      return new Response(JSON.stringify({ error: "Message must be 1000 characters or less" }), {
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

    // Generate edit token
    const editToken = nanoid(32);

    // Create the comment
    const comment = await writeClient.create({
      _type: "comment",
      name: name.trim(),
      email: email.trim().toLowerCase(),
      website: website || undefined,
      message: message.trim(),
      parentType,
      parentSlug,
      editToken,
      createdAt: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true, id: comment._id, editToken }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Comment creation error:", error);
    return new Response(JSON.stringify({ error: "Failed to save comment" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, editToken, name, email, website, message } = body;

    if (!id || !editToken) {
      return new Response(JSON.stringify({ error: "Comment ID and edit token required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Valid email is required" }), {
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

    if (name.length > 100) {
      return new Response(JSON.stringify({ error: "Name must be 100 characters or less" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (message.length > 1000) {
      return new Response(JSON.stringify({ error: "Message must be 1000 characters or less" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    // Verify the edit token matches
    const existingComment = await writeClient.fetch(
      `*[_type == "comment" && _id == $id][0]{ editToken }`,
      { id }
    );

    if (!existingComment) {
      return new Response(JSON.stringify({ error: "Comment not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (existingComment.editToken !== editToken) {
      return new Response(JSON.stringify({ error: "Invalid edit token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    await writeClient
      .patch(id)
      .set({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        website: website || undefined,
        message: message.trim(),
        updatedAt: new Date().toISOString(),
      })
      .commit();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Comment update error:", error);
    return new Response(JSON.stringify({ error: "Failed to update comment" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, editToken } = body;

    if (!id || !editToken) {
      return new Response(JSON.stringify({ error: "Comment ID and edit token required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify the edit token matches
    const existingComment = await writeClient.fetch(
      `*[_type == "comment" && _id == $id][0]{ editToken }`,
      { id }
    );

    if (!existingComment) {
      return new Response(JSON.stringify({ error: "Comment not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (existingComment.editToken !== editToken) {
      return new Response(JSON.stringify({ error: "Invalid edit token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    await writeClient.delete(id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Comment deletion error:", error);
    return new Response(JSON.stringify({ error: "Failed to delete comment" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
