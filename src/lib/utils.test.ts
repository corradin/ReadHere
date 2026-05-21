import { describe, it, expect } from "vitest";
import { calculateAverageRatings } from "./utils";
import type { Review } from "./types";

describe("calculateAverageRatings", () => {
  it("should return zeros for empty reviews array", () => {
    const result = calculateAverageRatings([]);

    expect(result.quietness).toBe(0);
    expect(result.comfort).toBe(0);
    expect(result.lighting).toBe(0);
    expect(result.overall).toBe(0);
  });

  it("should calculate correct averages for single review", () => {
    const reviews: Review[] = [
      {
        id: "1",
        place_id: "9c6b28a1-748c-44ed-9476-ac53a0091e37",
        user_id: "user1",
        quietness: 4,
        comfort: 5,
        lighting: 3,
        comment: "Great place",
        created_at: "2024-01-01",
      },
    ];

    const result = calculateAverageRatings(reviews);

    expect(result.quietness).toBe(4);
    expect(result.comfort).toBe(5);
    expect(result.lighting).toBe(3);
    expect(result.overall).toBe(4);
  });

  it("should calculate correct averages for multiple reviews", () => {
    const reviews: Review[] = [
      {
        id: "1",
        place_id: "20f364d8-c2ee-40dc-9889-ec3a89910c1d",
        user_id: "user1",
        quietness: 4,
        comfort: 5,
        lighting: 3,
        comment: "Great place",
        created_at: "2024-01-01",
      },
      {
        id: "2",
        place_id: "f88fc4f3-8be0-4db3-847c-8409b9e2b18a",
        user_id: "user2",
        quietness: 5,
        comfort: 4,
        lighting: 5,
        comment: "Excellent!",
        created_at: "2024-01-02",
      },
    ];

    const result = calculateAverageRatings(reviews);

    expect(result.quietness).toBe(4.5);
    expect(result.comfort).toBe(4.5);
    expect(result.lighting).toBe(4);
    expect(result.overall).toBe(4.3);
  });

  it("should round to one decimal place", () => {
    const reviews: Review[] = [
      {
        id: "1",
        place_id: "bf052ce9-3781-4800-9da5-d137d704be5c",
        user_id: "user1",
        quietness: 3,
        comfort: 3,
        lighting: 3,
        comment: "OK",
        created_at: "2024-01-01",
      },
      {
        id: "2",
        place_id: "0c302606-d736-4793-b204-d8599e9a6c0e",
        user_id: "user2",
        quietness: 4,
        comfort: 4,
        lighting: 4,
        comment: "Good",
        created_at: "2024-01-02",
      },
      {
        id: "3",
        place_id: "f831bb77-66e1-4637-b31d-f4547e1a6e84",
        user_id: "user3",
        quietness: 5,
        comfort: 5,
        lighting: 5,
        comment: "Great",
        created_at: "2024-01-03",
      },
    ];

    const result = calculateAverageRatings(reviews);

    expect(result.quietness).toBe(4);
    expect(result.comfort).toBe(4);
    expect(result.lighting).toBe(4);
    expect(result.overall).toBe(4);
  });
});
