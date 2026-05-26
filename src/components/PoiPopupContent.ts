interface PoiPopupContentProps {
    title: string;
    href: string;
}

export function createPoiPopupContent({
    title,
    href,
}: PoiPopupContentProps): HTMLDivElement {
    const wrapper = document.createElement("div");
    wrapper.className = "poi-popup";

    const heading = document.createElement("h3");
    heading.textContent = title;

    const link = document.createElement("a");
    link.textContent = "View place";
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    wrapper.append(heading, link);

    return wrapper;
}
