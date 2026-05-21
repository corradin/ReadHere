import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    // 1. Check authentication - get access_token and refresh_token cookies
    const accessToken = cookies.get("sb-access-token");
    const refreshToken = cookies.get("sb-refresh-token");

    if (!accessToken || !refreshToken) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Please sign in" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 2. Verify session with Supabase
    const { data: sessionData, error: sessionError } =
      await supabase.auth.setSession({
        access_token: accessToken.value,
        refresh_token: refreshToken.value,
      });

    if (sessionError || !sessionData.user) {
      return new Response(
        JSON.stringify({ error: "Invalid session - Please sign in again" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 3. Parse FormData and extract required fields
    const formData = await request.formData();
    const venue_id = formData.get("venue_id")?.toString();
    const quietnessStr = formData.get("quietness")?.toString();
    const comfortStr = formData.get("comfort")?.toString();
    const lightingStr = formData.get("lighting")?.toString();
    const text = formData.get("text")?.toString();

    // 4. Validate all required fields exist
    if (!venue_id || !quietnessStr || !comfortStr || !lightingStr || !text) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required fields: venue_id, quietness, comfort, lighting, text",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 5. Validate ratings are numbers between 1-5
    const quietness = Number(quietnessStr);
    const comfort = Number(comfortStr);
    const lighting = Number(lightingStr);

    if (
      isNaN(quietness) ||
      quietness < 1 ||
      quietness > 5 ||
      isNaN(comfort) ||
      comfort < 1 ||
      comfort > 5 ||
      isNaN(lighting) ||
      lighting < 1 ||
      lighting > 5
    ) {
      return new Response(
        JSON.stringify({
          error: "Ratings must be numbers between 1 and 5",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 6. Validate text is 10-1000 characters
    const trimmedText = text.trim();
    if (trimmedText.length < 10) {
      return new Response(
        JSON.stringify({
          error: "Review text must be at least 10 characters long",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (trimmedText.length > 1000) {
      return new Response(
        JSON.stringify({
          error: "Review text must not exceed 1000 characters",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 7. Insert review into Supabase
    // Note: The database uses 'place_id' (per schema), but we map from 'venue_id'
    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          place_id: venue_id,
          user_id: sessionData.user.id,
          quietness: Math.round(quietness),
          comfort: Math.round(comfort),
          lighting: Math.round(lighting),
          comment: trimmedText,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Database error creating review:", error);

      // Handle specific database errors
      if (error.code === "23505") {
        // Unique constraint violation - user already reviewed this venue
        return new Response(
          JSON.stringify({
            error: "You have already submitted a review for this venue",
          }),
          {
            status: 409,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      return new Response(
        JSON.stringify({
          error: "Failed to create review. Please try again.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 8. On success: redirect to /venues/${venue_id}
    return redirect(`/venues/${venue_id}`);
  } catch (err) {
    // 9. On error: return JSON error response
    console.error("Unexpected error creating review:", err);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred. Please try again.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
