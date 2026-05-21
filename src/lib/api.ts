import { supabase } from "./supabase";
import type { Place, Review, Bookmark, PlaceWithReviews } from "./types";

export async function getVenues(): Promise<Place[]> {
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getPlaceById(
  id: string,
): Promise<PlaceWithReviews | null> {
  const { data: place, error: placeError } = await supabase
    .from("places")
    .select("*")
    .eq("id", id)
    .single();

  if (placeError) throw placeError;
  if (!place) return null;

  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("*")
    .eq("place_id", id)
    .order("created_at", { ascending: false });

  if (reviewsError) throw reviewsError;

  const averageRatings = calculateAverageRatings(reviews || []);

  return {
    ...place,
    reviews: reviews || [],
    averageRatings,
  };
}

export async function createReview(
  review: Omit<Review, "id" | "created_at">,
): Promise<Review> {
  const { data, error } = await supabase
    .from("reviews")
    .insert([review])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserBookmarks(userId: string): Promise<Place[]> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("place_id, places(*)")
    .eq("user_id", userId);

  if (error) throw error;
  return data?.map((b: any) => b.places) || [];
}

export async function addBookmark(
  userId: string,
  placeId: string,
): Promise<Bookmark> {
  const { data, error } = await supabase
    .from("bookmarks")
    .insert([{ user_id: userId, place_id: placeId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeBookmark(
  userId: string,
  placeId: string,
): Promise<void> {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", userId)
    .eq("place_id", placeId);

  if (error) throw error;
}

export async function isBookmarked(
  userId: string,
  placeId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("place_id", placeId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

function calculateAverageRatings(reviews: Review[]) {
  if (reviews.length === 0) {
    return {
      quietness: 0,
      comfort: 0,
      lighting: 0,
      overall: 0,
    };
  }

  const sum = reviews.reduce(
    (acc, review) => ({
      quietness: acc.quietness + review.quietness,
      comfort: acc.comfort + review.comfort,
      lighting: acc.lighting + review.lighting,
    }),
    { quietness: 0, comfort: 0, lighting: 0 },
  );

  const quietness = sum.quietness / reviews.length;
  const comfort = sum.comfort / reviews.length;
  const lighting = sum.lighting / reviews.length;
  const overall = (quietness + comfort + lighting) / 3;

  return {
    quietness: Math.round(quietness * 10) / 10,
    comfort: Math.round(comfort * 10) / 10,
    lighting: Math.round(lighting * 10) / 10,
    overall: Math.round(overall * 10) / 10,
  };
}
