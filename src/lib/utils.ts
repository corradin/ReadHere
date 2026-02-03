import type { Review } from './types';

export function calculateAverageRatings(reviews: Review[]) {
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

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
