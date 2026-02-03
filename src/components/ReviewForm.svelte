<script lang="ts">
    import { clamp } from "../lib/utils";
    import type { Review } from "../lib/types";

    interface Props {
        venueId: string;
        userId: string;
        onSubmit: (review: Omit<Review, "id" | "created_at">) => void;
    }

    let { venueId, userId, onSubmit }: Props = $props();

    let quietness = $state(3);
    let comfort = $state(3);
    let lighting = $state(3);
    let text = $state("");
    let isSubmitting = $state(false);
    let error = $state("");

    async function handleSubmit(e: Event) {
        e.preventDefault();

        if (text.trim().length < 10) {
            error = "Please write at least 10 characters";
            return;
        }

        isSubmitting = true;
        error = "";

        try {
            await onSubmit({
                venue_id: venueId,
                user_id: userId,
                quietness: clamp(quietness, 1, 5),
                comfort: clamp(comfort, 1, 5),
                lighting: clamp(lighting, 1, 5),
                text: text.trim(),
            });

            quietness = 3;
            comfort = 3;
            lighting = 3;
            text = "";
        } catch (err) {
            error =
                err instanceof Error ? err.message : "Failed to submit review";
        } finally {
            isSubmitting = false;
        }
    }
</script>

<form class="review-form" on:submit={handleSubmit}>
    <h3>Write a Review</h3>

    <div class="rating-group">
        <label for="quietness">
            Quietness
            <span class="rating-value">{quietness}/5</span>
        </label>
        <input
            id="quietness"
            type="range"
            min="1"
            max="5"
            bind:value={quietness}
            disabled={isSubmitting}
        />
    </div>

    <div class="rating-group">
        <label for="comfort">
            Comfort
            <span class="rating-value">{comfort}/5</span>
        </label>
        <input
            id="comfort"
            type="range"
            min="1"
            max="5"
            bind:value={comfort}
            disabled={isSubmitting}
        />
    </div>

    <div class="rating-group">
        <label for="lighting">
            Lighting
            <span class="rating-value">{lighting}/5</span>
        </label>
        <input
            id="lighting"
            type="range"
            min="1"
            max="5"
            bind:value={lighting}
            disabled={isSubmitting}
        />
    </div>

    <div class="form-group">
        <label for="review-text">Your Review</label>
        <textarea
            id="review-text"
            bind:value={text}
            placeholder="Share your experience at this venue..."
            rows="4"
            disabled={isSubmitting}
            required
        ></textarea>
    </div>

    {#if error}
        <p class="error">{error}</p>
    {/if}

    <button type="submit" class="submit-button" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
    </button>
</form>

<style>
    .review-form {
        background: white;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    h3 {
        margin: 0 0 24px 0;
        font-size: 1.5rem;
        color: #1f2937;
    }

    .rating-group {
        margin-bottom: 20px;
    }

    label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-weight: 500;
        color: #374151;
    }

    .rating-value {
        color: #3b82f6;
        font-weight: 600;
    }

    input[type="range"] {
        width: 100%;
        height: 8px;
        background: #e5e7eb;
        border-radius: 4px;
        outline: none;
        -webkit-appearance: none;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border-radius: 50%;
        cursor: pointer;
    }

    input[type="range"]::-moz-range-thumb {
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border-radius: 50%;
        cursor: pointer;
        border: none;
    }

    input[type="range"]:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .form-group {
        margin-bottom: 20px;
    }

    textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-family: inherit;
        font-size: 1rem;
        resize: vertical;
    }

    textarea:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    textarea:disabled {
        background: #f9fafb;
        cursor: not-allowed;
    }

    .error {
        color: #dc2626;
        font-size: 0.875rem;
        margin: 12px 0;
    }

    .submit-button {
        width: 100%;
        padding: 12px 24px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
    }

    .submit-button:hover:not(:disabled) {
        background: #2563eb;
    }

    .submit-button:disabled {
        background: #9ca3af;
        cursor: not-allowed;
    }
</style>
