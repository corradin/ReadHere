<script lang="ts">
    import { onMount, onDestroy, mount } from "svelte";
    import maplibregl from "maplibre-gl";
    import { DEFAULT_MAP_CONFIG } from "../lib/mapbox";
    import type { Venue } from "../lib/types";
    import PoiPopupContent from "./PoiPopupContent.svelte";

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
    let poiLayers: string[] | undefined;

    onMount(() => {
        map = new maplibregl.Map({
            container: mapContainer,
            style: "https://tiles.openfreemap.org/styles/bright",
            center,
            zoom,
        });

        map.addControl(new maplibregl.NavigationControl(), "top-right");

        map.on("idle", () => {
            console.log("I am idle");
            poiLayers = map
                ?.getLayersOrder()
                .filter((layer) => layer.startsWith("poi_"));

            if (poiLayers && map) {
                map.on("mouseenter", poiLayers, (e) => {
                    map!.getCanvas().style.cursor = "pointer";
                });

                map.on("mouseleave", poiLayers, (e) => {
                    map!.getCanvas().style.cursor = "";
                });
            }
        });

        map.on("click", (e) => {
            const features = map?.queryRenderedFeatures(e.point);
            const poiFeature = features?.find(
                (feature) => feature.sourceLayer === "poi",
            );

            if (!poiFeature) return;

            const title = poiFeature.properties?.name
                ? String(poiFeature.properties.name)
                : "Point of interest";
            const searchQuery = encodeURIComponent(
                `${title} ${e.lngLat.lat},${e.lngLat.lng}`,
            );

            const popupContainer = document.createElement("div");
            mount(PoiPopupContent, {
                target: popupContainer,
                props: {
                    id: "",
                    address: "",
                    name: title,
                },
            });

            new maplibregl.Popup()
                .setLngLat(e.lngLat)
                .setDOMContent(popupContainer)
                .addTo(map);
        });
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
            console.log(bounds);
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

    :global(.poi-popup) {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    :global(.poi-popup h3) {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
    }

    :global(.poi-popup a) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        border: 1px solid #111827;
        border-radius: 9999px;
        padding: 6px 12px;
        background: #f9fafb;
        color: #111827;
        font-size: 0.875rem;
        font-weight: 600;
        line-height: 1;
        text-decoration: none;
    }

    :global(.poi-popup a:hover) {
        background: #f3f4f6;
    }
</style>
