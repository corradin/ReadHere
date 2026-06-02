<script lang="ts">
    interface Props {
        id: string;
        name: string;
        address: string;
        buttonText: string;
    }

    let { id, name, address, buttonText }: Props = $props();
</script>

<div class="popup-content">
    <h3 class="popup-title">{name}</h3>
    <p class="popup-address">{address}</p>
    <a href={`/venues/${id}`} class="popup-link">{buttonText}</a>
</div>

<style>
    .popup-content {
        font-family:
            system-ui,
            -apple-system,
            sans-serif;
    }

    .popup-title {
        margin: 0 0 8px 0;
        font-weight: 600;
        font-size: 16px;
        color: #1f2937;
    }

    .popup-address {
        margin: 0 0 12px 0;
        color: #6b7280;
        font-size: 14px;
        line-height: 1.5;
    }

    .popup-link {
        display: inline-block;
        color: #3b82f6;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: color 0.2s;
    }

    .popup-link:hover {
        color: #2563eb;
        text-decoration: underline;
    }
</style>
