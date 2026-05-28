import { render, screen } from "@testing-library/svelte";
import PoiPopupContent from "./PoiPopupContent.svelte";

describe("PoiPopupContent", () => {
  it("renders name, address, and link to venue details", () => {
    render(PoiPopupContent, {
      props: {
        id: "123",
        name: "Canvas Coffee Shop",
        address: "123 Main St, Seattle, WA",
      },
    });

    // Check that the name is rendered as a heading
    const heading = screen.getByRole("heading", {
      level: 3,
      name: "Canvas Coffee Shop",
    });
    expect(heading).toBeInTheDocument();

    // Check that the address is displayed
    const address = screen.getByText("123 Main St, Seattle, WA");
    expect(address).toBeInTheDocument();

    // Check that the link to venue details exists and has correct href
    const link = screen.getByRole("link", { name: /View More/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("/venues/123");
  });

  it("handles minimal data correctly", () => {
    render(PoiPopupContent, {
      props: {
        id: "456",
        name: "Test Place",
        address: "Unknown Location",
      },
    });

    expect(screen.getByText("Test Place")).toBeInTheDocument();
    expect(screen.getByText("Unknown Location")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/venues/456");
  });
});
