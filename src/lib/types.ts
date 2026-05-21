export interface Place {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  place_type?: string;
  created_at: string;
}

export interface Review {
  id: string;
  place_id: string;
  user_id: string;
  quietness: number;
  comfort: number;
  lighting: number;
  comment: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  place_id: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface PlaceWithReviews extends Place {
  reviews?: Review[];
  averageRatings?: {
    quietness: number;
    comfort: number;
    lighting: number;
    overall: number;
  };
}

// Backwards compatibility alias
export type Venue = Place;
export type VenueWithReviews = PlaceWithReviews;
