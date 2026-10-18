import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PropertyDetailView } from "@/components/property";
import { PROPERTIES } from "@/data/properties";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { generateStaticParams, generateMetadata } from "@/app/properties/[id]/page";

describe("Property Detail Page Integration Suite", () => {
  const property = PROPERTIES[0];

  it("renders property detail view with breadcrumbs, title, photo gallery, facts, narrative, and sidebar", () => {
    render(
      <FavoritesProvider>
        <PropertyDetailView property={property} />
      </FavoritesProvider>
    );

    // Breadcrumbs
    expect(screen.getByRole("navigation", { name: /breadcrumb/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /acquisitions/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: new RegExp(property.address.neighborhood, "i") })).toBeInTheDocument();

    // Title
    expect(screen.getByRole("heading", { level: 1, name: property.title })).toBeInTheDocument();

    // FactsBar
    expect(screen.getByTestId("property-facts-bar")).toBeInTheDocument();

    // Amenities
    expect(screen.getByText("Interior Architecture")).toBeInTheDocument();

    // AgentCard
    expect(screen.getByTestId("listing-agent-card")).toBeInTheDocument();

    // Sidebar CTAs
    expect(screen.getByRole("button", { name: /schedule private viewing/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /request video walkthrough/i })).toBeInTheDocument();
  });

  it("opens viewing modal when Schedule Private Viewing button is clicked", () => {
    render(
      <FavoritesProvider>
        <PropertyDetailView property={property} />
      </FavoritesProvider>
    );

    const scheduleBtn = screen.getByRole("button", { name: /schedule private viewing/i });
    fireEvent.click(scheduleBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Schedule a Private Viewing")).toBeInTheDocument();
  });

  it("generates static params for all properties", () => {
    const params = generateStaticParams();
    expect(params.length).toBeGreaterThanOrEqual(16);
    expect(params.some((p) => p.id === property.id)).toBe(true);
  });

  it("generates accurate SEO metadata for property detail page", async () => {
    const metadata = await generateMetadata({ params: { id: property.id } });
    expect(metadata.title).toContain(property.title);
    expect(metadata.description).toBeTruthy();

    const notFoundMeta = await generateMetadata({ params: { id: "non-existent-99" } });
    expect(notFoundMeta.title).toContain("Residence Not Found");
  });
});
