import { describe, it, expect } from 'vitest';
import { calculateAverageRatings } from './utils';
import type { Review } from './types';

describe('calculateAverageRatings', () => {
  it('should return zeros for empty reviews array', () => {
    const result = calculateAverageRatings([]);
    
    expect(result.quietness).toBe(0);
    expect(result.comfort).toBe(0);
    expect(result.lighting).toBe(0);
    expect(result.overall).toBe(0);
  });

  it('should calculate correct averages for single review', () => {
    const reviews: Review[] = [
      {
        id: '1',
        venue_id: 'venue1',
        user_id: 'user1',
        quietness: 4,
        comfort: 5,
        lighting: 3,
        text: 'Great place',
        created_at: '2024-01-01',
      },
    ];

    const result = calculateAverageRatings(reviews);
    
    expect(result.quietness).toBe(4);
    expect(result.comfort).toBe(5);
    expect(result.lighting).toBe(3);
    expect(result.overall).toBe(4);
  });

  it('should calculate correct averages for multiple reviews', () => {
    const reviews: Review[] = [
      {
        id: '1',
        venue_id: 'venue1',
        user_id: 'user1',
        quietness: 4,
        comfort: 5,
        lighting: 3,
        text: 'Great place',
        created_at: '2024-01-01',
      },
      {
        id: '2',
        venue_id: 'venue1',
        user_id: 'user2',
        quietness: 5,
        comfort: 4,
        lighting: 5,
        text: 'Excellent!',
        created_at: '2024-01-02',
      },
    ];

    const result = calculateAverageRatings(reviews);
    
    expect(result.quietness).toBe(4.5);
    expect(result.comfort).toBe(4.5);
    expect(result.lighting).toBe(4);
    expect(result.overall).toBe(4.3);
  });

  it('should round to one decimal place', () => {
    const reviews: Review[] = [
      {
        id: '1',
        venue_id: 'venue1',
        user_id: 'user1',
        quietness: 3,
        comfort: 3,
        lighting: 3,
        text: 'OK',
        created_at: '2024-01-01',
      },
      {
        id: '2',
        venue_id: 'venue1',
        user_id: 'user2',
        quietness: 4,
        comfort: 4,
        lighting: 4,
        text: 'Good',
        created_at: '2024-01-02',
      },
      {
        id: '3',
        venue_id: 'venue1',
        user_id: 'user3',
        quietness: 5,
        comfort: 5,
        lighting: 5,
        text: 'Great',
        created_at: '2024-01-03',
      },
    ];

    const result = calculateAverageRatings(reviews);
    
    expect(result.quietness).toBe(4);
    expect(result.comfort).toBe(4);
    expect(result.lighting).toBe(4);
    expect(result.overall).toBe(4);
  });
});
