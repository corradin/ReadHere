import type { APIRoute } from "astro";
import { createReview } from "../../../lib/api";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Check authentication
    const accessToken = cookies.get("sb-access-token");
    const refreshToken = cookies.get("sb-refresh-token");

    if (!accessToken || !refreshToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify session
    const { data: sessionData, error: sessionError } =
      await supabase.auth.setSession({
        refresh_token: refreshToken.value,
        access_token: accessToken.value,
      });

    if (sessionError || !sessionData.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse request body
    // const body = await request.json();
    // const { venue_id, quietness, comfort, lighting, text } = body;
    const formData = await request.formData();

    const place_id = formData.get("place_id") as string;
    const quietness = Number(formData.get("quietness"));
    const comfort = Number(formData.get("comfort"));
    const lighting = Number(formData.get("lighting"));
    const text = formData.get("review-text") as string;

    const data = await createReview({
      place_id: place_id!,
      user_id: sessionData.user.id,
      quietness: quietness,
      comfort: comfort,
      lighting: lighting,
      comment: text?.trim(),
    });

    // // Validate required fields
    // if (!venue_id || !text) {
    //   return new Response(
    //     JSON.stringify({ error: "Missing required fields" }),
    //     { status: 400, headers: { "Content-Type": "application/json" } },
    //   );
    // }

    // // Validate ratings
    // const quietnessNum = Number(quietness);
    // const comfortNum = Number(comfort);
    // const lightingNum = Number(lighting);

    // if (
    //   isNaN(quietnessNum) ||
    //   quietnessNum < 1 ||
    //   quietnessNum > 5 ||
    //   isNaN(comfortNum) ||
    //   comfortNum < 1 ||
    //   comfortNum > 5 ||
    //   isNaN(lightingNum) ||
    //   lightingNum < 1 ||
    //   lightingNum > 5
    // ) {
    //   return new Response(
    //     JSON.stringify({ error: "Ratings must be between 1 and 5" }),
    //     { status: 400, headers: { "Content-Type": "application/json" } },
    //   );
    // }

    // // Validate text length
    // if (text.trim().length < 10) {
    //   return new Response(
    //     JSON.stringify({ error: "Review text must be at least 10 characters" }),
    //     { status: 400, headers: { "Content-Type": "application/json" } },
    //   );
    // }

    // if (text.trim().length > 1000) {
    //   return new Response(
    //     JSON.stringify({
    //       error: "Review text must not exceed 1000 characters",
    //     }),
    //     { status: 400, headers: { "Content-Type": "application/json" } },
    //   );
    // }

    // // Create review
    // const { data, error } = await supabase
    //   .from("reviews")
    //   .insert([
    //     {
    //       venue_id,
    //       user_id: sessionData.user.id,
    //       quietness: Math.round(quietnessNum),
    //       comfort: Math.round(comfortNum),
    //       lighting: Math.round(lightingNum),
    //       text: text.trim(),
    //     },
    //   ])
    //   .select()
    //   .single();

    // if (error) {
    //   console.error("Database error:", error);
    //   return new Response(
    //     JSON.stringify({ error: "Failed to create review" }),
    //     { status: 500, headers: { "Content-Type": "application/json" } },
    //   );
    // }

    return new Response(JSON.stringify({ success: true, review: data }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
