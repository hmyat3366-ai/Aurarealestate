import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import EmptyState from "@/components/EmptyState";
import { PROPERTIES } from "@/data/properties";

// Mock next/image for fast jsdom testing, filtering Next-specific props
vi.mock("next/image", () => ({
  default: ({ src, alt, fill, priority, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt || ""} {...props} />;
  },
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Header Component", () => {
  it("renders the agency brand name and essential navigation links", () => {
    render(<Header />);
    expect(screen.getByText("Vane & Sterling")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^buy$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^rent$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^locations$/i })).toBeInTheDocument();
    expect(screen.getAllByText(/sell with us/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /^about us$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^contact$/i })).toBeInTheDocument();
  });
});

describe("PropertyCard Component", () => {
  it("renders outright capital value for properties for sale", () => {
    const saleProperty = PROPERTIES.find((p) => p.purpose === "sale")!;
    render(<PropertyCard property={saleProperty} />);

    expect(screen.getByText(saleProperty.title)).toBeInTheDocument();
    expect(screen.getByText("For Sale")).toBeInTheDocument();
    expect(screen.getByText(`£${saleProperty.price.toLocaleString("en-GB")}`)).toBeInTheDocument();
    expect(screen.getByTitle("Bedrooms")).toBeInTheDocument();
    expect(screen.getByTitle("Bathrooms")).toBeInTheDocument();
    expect(screen.getByTitle("Floor Area")).toBeInTheDocument();
  });

  it("renders PCM and PW rental pricing for properties to let", () => {
    const rentProperty = PROPERTIES.find((p) => p.purpose === "rent")!;
    render(<PropertyCard property={rentProperty} />);

    expect(screen.getByText(rentProperty.title)).toBeInTheDocument();
    expect(screen.getByText("To Let")).toBeInTheDocument();
    expect(screen.getByText(/pcm/i)).toBeInTheDocument();
    expect(screen.getByText(/pw/i)).toBeInTheDocument();
    expect(screen.getByTitle("Bedrooms")).toBeInTheDocument();
  });
});

describe("EmptyState Component", () => {
  it("renders clear guidance and triggers onReset when clicked", () => {
    const onResetMock = vi.fn();
    render(<EmptyState onReset={onResetMock} purpose="sale" />);

    expect(screen.getByText("No Matching Residences Found")).toBeInTheDocument();
    const clearBtn = screen.getByRole("button", { name: /clear filter criteria/i });
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn);
    expect(onResetMock).toHaveBeenCalledTimes(1);
  });
});
