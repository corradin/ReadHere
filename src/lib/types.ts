export interface Venue {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  category?: string;
  created_at: string;
}

export interface Review {
  id: string;
  venue_id: string;
  user_id: string;
  quietness: number;
  comfort: number;
  lighting: number;
  text: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  venue_id: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface VenueWithReviews extends Venue {
  reviews?: Review[];
  averageRatings?: {
    quietness: number;
    comfort: number;
    lighting: number;
    overall: number;
  };
}
