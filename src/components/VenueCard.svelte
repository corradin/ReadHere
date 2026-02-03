<script lang="ts">
  import type { Venue } from '../lib/types';

  interface Props {
    venue: Venue;
    averageRating?: number;
    onClick?: () => void;
  }

  let { venue, averageRating, onClick }: Props = $props();

  function renderStars(rating: number) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return {
      full: fullStars,
      half: hasHalfStar ? 1 : 0,
      empty: emptyStars,
    };
  }

  const stars = $derived(renderStars(averageRating || 0));
</script>

<div class="venue-card" role="button" tabindex="0" on:click={onClick} on:keypress={onClick}>
  <div class="card-content">
    <h3 class="venue-name">{venue.name}</h3>
    <p class="venue-address">{venue.address}</p>
    
    {#if averageRating}
      <div class="rating">
        <div class="stars">
          {#each Array(stars.full) as _}
            <span class="star full">★</span>
          {/each}
          {#each Array(stars.half) as _}
            <span class="star half">★</span>
          {/each}
          {#each Array(stars.empty) as _}
            <span class="star empty">★</span>
          {/each}
        </div>
        <span class="rating-value">{averageRating.toFixed(1)}</span>
      </div>
    {/if}

    {#if venue.description}
      <p class="venue-description">{venue.description}</p>
    {/if}
  </div>
</div>

<style>
  .venue-card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .venue-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .card-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .venue-name {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
  }

  .venue-address {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
  }

  .rating {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .stars {
    display: flex;
    gap: 2px;
  }

  .star {
    font-size: 1.125rem;
  }

  .star.full {
    color: #fbbf24;
  }

  .star.half {
    color: #fbbf24;
    opacity: 0.5;
  }

  .star.empty {
    color: #d1d5db;
  }

  .rating-value {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }

  .venue-description {
    margin: 0;
    color: #4b5563;
    font-size: 0.875rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
