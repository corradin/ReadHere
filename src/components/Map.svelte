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

            if (features && features.length > 0) {
                features.map((feature) => {
                    if (feature.sourceLayer === "poi") {
                        console.log(feature);
                    }
                });
            }
            // const coordinates = e.features[0].geometry.coordinates.slice();
            // const description = e.features[0].properties.description;
            // // Ensure that if the map is zoomed out such that multiple
            // // copies of the feature are visible, the popup appears
            // // over the copy being pointed to.
            // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            // }
            // new maplibregl.Popup()
            //     .setLngLat(coordinates)
            //     .setHTML(description)
            //     .addTo(map);
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        // map.on("mouseenter", "places", () => {
        //     map.getCanvas().style.cursor = "pointer";
        // });

        // // Change it back to a pointer when it leaves.
        // map.on("mouseleave", "places", () => {
        //     map.getCanvas().style.cursor = "";
        // });

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
</style>
