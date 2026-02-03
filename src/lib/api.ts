import { supabase } from './supabase';
import type { Venue, Review, Bookmark, VenueWithReviews } from './types';

export async function getVenues(): Promise<Venue[]> {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getVenueById(id: string): Promise<VenueWithReviews | null> {
  const { data: venue, error: venueError } = await supabase
    .from('venues')
    .select('*')
    .eq('id', id)
    .single();

  if (venueError) throw venueError;
  if (!venue) return null;

  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('*')
    .eq('venue_id', id)
    .order('created_at', { ascending: false });

  if (reviewsError) throw reviewsError;

  const averageRatings = calculateAverageRatings(reviews || []);

  return {
    ...venue,
    reviews: reviews || [],
    averageRatings,
  };
}

export async function createReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserBookmarks(userId: string): Promise<Venue[]> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('venue_id, venues(*)')
    .eq('user_id', userId);

  if (error) throw error;
  return data?.map((b: any) => b.venues) || [];
}

export async function addBookmark(userId: string, venueId: string): Promise<Bookmark> {
  const { data, error } = await supabase
    .from('bookmarks')
    .insert([{ user_id: userId, venue_id: venueId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeBookmark(userId: string, venueId: string): Promise<void> {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('venue_id', venueId);

  if (error) throw error;
}

export async function isBookmarked(userId: string, venueId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('venue_id', venueId)
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
    { quietness: 0, comfort: 0, lighting: 0 }
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
