"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClientForServer } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ItemInsert, ItemUpdate } from "@/types";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClientForServer();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClientForServer();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClientForServer();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClientForServer();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClientForServer();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const createItemAction = async (formData: FormData) => {
  const itemType = formData.get("itemtype")?.toString();

  if (!itemType) {
    return encodedRedirect("error", "/create", "Item type is required");
  }

  const supabase = await createClientForServer();
  const title = formData.get("title") as string;
  const publishedYear = Number(formData.get("publishedYear"));
  const redo = formData.get("redo") === "on";
  const currentYear = new Date().getFullYear();

  const newItem: ItemInsert = {
    title,
    itemtype: itemType,
    belongs_to_year: currentYear,
    published_year: publishedYear,
    redo,
  };

  if (itemType === "Book") {
    newItem.author = formData.get("author") as string;
  } else if (itemType === "Movie") {
    newItem.director = formData.get("director") as string;
  } else if (itemType === "Show") {
    newItem.season = Number(formData.get("season")) || null;
  }

  const { error } = await supabase.from("items").insert(newItem);

  if (error) {
    return encodedRedirect("error", "/create", error.message);
  }

  return redirect(`/year/${currentYear}`);
};

export const deleteItemAction = async (formData: FormData) => {
  const supabase = await createClientForServer();
  const itemId = formData.get("id")?.toString();
  const belongsToYear = Number(formData.get("belongsToYear"));

  if (!itemId) {
    return encodedRedirect("error", "/", "Item ID is required for deletion.");
  }

  const { error } = await supabase.from("items").delete().eq("id", itemId);

  if (error) {
    return encodedRedirect("error", "/", error.message);
  }

  return redirect(`/year/${belongsToYear}`);
};

export const updateItemAction = async (formData: FormData) => {
  const supabase = await createClientForServer();
  const itemId = formData.get("id")?.toString();
  const itemType = formData.get("itemtype")?.toString();
  const belongsToYear = Number(formData.get("belongsToYear")); // Get the manually set year

  if (!itemId || !itemType) {
    return encodedRedirect("error", "/", "Invalid update request.");
  }

  const updatedItem: ItemUpdate = {
    title: formData.get("title") as string,
    published_year: Number(formData.get("publishedYear")),
    belongs_to_year: belongsToYear,
    redo: formData.get("redo") === "on",
  };

  if (itemType === "Book") {
    updatedItem.author = formData.get("author") as string;
  } else if (itemType === "Movie") {
    updatedItem.director = formData.get("director") as string;
  } else if (itemType === "Show") {
    updatedItem.season = Number(formData.get("season")) || null;
  }

  const { error } = await supabase
    .from("items")
    .update(updatedItem)
    .eq("id", itemId);

  if (error) {
    return encodedRedirect("error", `/item/update/${itemId}`, error.message);
  }

  return redirect(`/year/${belongsToYear}`);
};
