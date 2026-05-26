import { createPoiPopupContent } from "./PoiPopupContent";

describe("createPoiPopupContent", () => {
    it("renders a title and link button", () => {
        const popupContent = createPoiPopupContent({
            title: "Canvas",
            href: "https://www.openstreetmap.org/search?query=Canvas",
        });

        const heading = popupContent.querySelector("h3");
        expect(heading?.textContent).toBe("Canvas");

        const link = popupContent.querySelector("a");
        expect(link?.textContent).toBe("View place");
        expect(link?.getAttribute("href")).toBe(
            "https://www.openstreetmap.org/search?query=Canvas",
        );
        expect(link?.getAttribute("target")).toBe("_blank");
        expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
    });
});
