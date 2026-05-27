import { screen } from "@testing-library/svelte";
import { createPoiPopupContent } from "./PoiPopupContent";

describe("createPoiPopupContent", () => {
    it("renders a title and link button", () => {
        document.body.innerHTML = "";
        const popupContent = createPoiPopupContent({
            title: "Canvas",
            href: "https://www.openstreetmap.org/search?query=Canvas",
        });

        document.body.append(popupContent);

        const heading = screen.getByRole("heading", { level: 3, name: "Canvas" });
        expect(heading.textContent).toBe("Canvas");

        const link = screen.getByRole("link", { name: "View place" });
        expect(link.getAttribute("href")).toBe(
            "https://www.openstreetmap.org/search?query=Canvas",
        );
        expect(link.getAttribute("target")).toBe("_blank");
        expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    });
});
