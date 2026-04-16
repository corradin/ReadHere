<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import maplibregl from "maplibre-gl";
    import { DEFAULT_MAP_CONFIG } from "../lib/mapbox";
    import type { Venue } from "../lib/types";

    interface Props {
        venues?: Venue[];
        center?: [number, number];
        zoom?: number;
        onVenueClick?: (venue: Venue) => void;
    }

    let {
        venues = [],
        center = DEFAULT_MAP_CONFIG.center,
        zoom = DEFAULT_MAP_CONFIG.zoom,
        onVenueClick,
    }: Props = $props();

    let mapContainer: HTMLDivElement;
    let map: maplibregl.Map | null = null;
    let markers: maplibregl.Marker[] = [];

    onMount(() => {
        map = new maplibregl.Map({
            container: mapContainer,
            style: DEFAULT_MAP_CONFIG.style,
            center,
            zoom,
        });

        map.addControl(new maplibregl.NavigationControl(), "top-right");

        updateMarkers();
    });

    onDestroy(() => {
        markers.forEach((marker) => marker.remove());
        map?.remove();
    });

    function updateMarkers() {
        if (!map) return;

        markers.forEach((marker) => marker.remove());
        markers = [];

        venues.forEach((venue) => {
            const el = document.createElement("div");
            el.className = "marker";
            el.style.backgroundColor = "#3b82f6";
            el.style.width = "30px";
            el.style.height = "30px";
            el.style.borderRadius = "50%";
            el.style.cursor = "pointer";
            el.style.border = "3px solid white";
            el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

            const marker = new maplibregl.Marker(el)
                .setLngLat([venue.longitude, venue.latitude])
                .setPopup(
                    new maplibregl.Popup({ offset: 25 }).setHTML(
                        `<h3 style="margin: 0 0 8px 0; font-weight: 600;">${venue.name}</h3>
             <p style="margin: 0; color: #666;">${venue.address}</p>`,
                    ),
                )
                .addTo(map!);

            if (onVenueClick) {
                el.addEventListener("click", () => onVenueClick(venue));
            }

            markers.push(marker);
        });

        if (venues.length > 0) {
            const bounds = new maplibregl.LngLatBounds();
            venues.forEach((venue) => {
                bounds.extend([venue.longitude, venue.latitude]);
            });
            map?.fitBounds(bounds, { padding: 50 });
        }
    }

    $effect(() => {
        venues;
        updateMarkers();
    });
</script>

<div bind:this={mapContainer} class="map-container"></div>

<style>
    .map-container {
        width: 100%;
        height: 100%;
        min-height: 500px;
    }

    :global(.maplibregl-popup-content) {
        padding: 12px;
        border-radius: 8px;
    }

    :global(.maplibregl-popup-close-button) {
        font-size: 18px;
        padding: 4px 8px;
    }
</style>
