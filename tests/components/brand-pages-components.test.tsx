import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { QuickDiscoveryConsole } from "@/components/discovery/QuickDiscoveryConsole";
import { SellInquiryForm } from "@/components/inquiry/SellInquiryForm";
import { ContactForm } from "@/components/inquiry/ContactForm";
import HomePage from "@/app/page";
import SellPage from "@/app/sell/page";
import AboutPage from "@/app/about/page";
import ContactPage from "@/app/contact/page";
import NotFoundPage from "@/app/not-found";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("Milestone 4: Brand Pages & Inquiry Components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("QuickDiscoveryConsole", () => {
    it("renders console with Buy/Rent tabs, location input, typology select, and search button", () => {
      render(<QuickDiscoveryConsole />);

      expect(screen.getByRole("tab", { name: /acquisitions \(buy\)/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /turnkey leases \(rent\)/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/mayfair, belgravia, soho/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/architectural typology/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /explore acquisitions/i })).toBeInTheDocument();
    });

    it("switches tabs between Buy and Rent", () => {
      render(<QuickDiscoveryConsole />);

      const rentTab = screen.getByRole("tab", { name: /turnkey leases \(rent\)/i });
      fireEvent.click(rentTab);

      expect(rentTab).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("button", { name: /explore leases/i })).toBeInTheDocument();
    });

    it("populates location when clicking prime enclave suggestions", () => {
      render(<QuickDiscoveryConsole />);

      const mayfairPill = screen.getByRole("button", { name: /^mayfair$/i });
      fireEvent.click(mayfairPill);

      const locationInput = screen.getByPlaceholderText(/mayfair, belgravia, soho/i) as HTMLInputElement;
      expect(locationInput.value).toBe("Mayfair");
    });

    it("navigates to /buy with query parameters on submission", () => {
      render(<QuickDiscoveryConsole />);

      const locationInput = screen.getByPlaceholderText(/mayfair, belgravia, soho/i);
      fireEvent.change(locationInput, { target: { value: "Belgravia" } });

      const typeSelect = screen.getByLabelText(/architectural typology/i);
      fireEvent.change(typeSelect, { target: { value: "penthouse" } });

      const searchBtn = screen.getByRole("button", { name: /explore acquisitions/i });
      fireEvent.click(searchBtn);

      expect(mockPush).toHaveBeenCalledWith("/buy?location=Belgravia&type=penthouse");
    });

    it("navigates to /rent when rent tab is active", () => {
      render(<QuickDiscoveryConsole />);

      const rentTab = screen.getByRole("tab", { name: /turnkey leases \(rent\)/i });
      fireEvent.click(rentTab);

      const locationInput = screen.getByPlaceholderText(/mayfair, belgravia, soho/i);
      fireEvent.change(locationInput, { target: { value: "Chelsea" } });

      const searchBtn = screen.getByRole("button", { name: /explore leases/i });
      fireEvent.click(searchBtn);

      expect(mockPush).toHaveBeenCalledWith("/rent?location=Chelsea");
    });
  });

  describe("SellInquiryForm", () => {
    it("renders all required and optional owner valuation intake fields", () => {
      render(<SellInquiryForm />);

      expect(screen.getByLabelText(/owner full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/telephone \/ direct mobile/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/property address & postal code/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/unit \/ suite/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/property typology/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^bedrooms/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^bathrooms/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/estimated value bracket/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/marketing channel preference/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/target timeline/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/architectural highlights & private notes/i)).toBeInTheDocument();
    });

    it("provides RFC 2368 mailto fallback link to acquisitions@vaneandsterling.com", () => {
      render(<SellInquiryForm />);

      const mailtoLink = screen.getByRole("link", { name: /open in email client/i });
      expect(mailtoLink).toBeInTheDocument();
      expect(mailtoLink.getAttribute("href")).toContain("mailto:acquisitions@vaneandsterling.com");
    });

    it("validates empty required fields and renders accessible role=alert error summary", async () => {
      render(<SellInquiryForm />);

      const submitBtn = screen.getByRole("button", { name: /submit confidential valuation request/i });
      fireEvent.click(submitBtn);

      expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Owner name must be at least 2 characters.").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Please provide a valid email address.").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Please provide a valid telephone number.").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Please specify the full property address or postal code.").length).toBeGreaterThan(0);
    });

    it("submits valid owner valuation inquiry and renders honest confirmation state with fiduciary invariant", async () => {
      render(<SellInquiryForm />);

      fireEvent.change(screen.getByLabelText(/owner full name/i), {
        target: { value: "Lord Alistair Sterling-Grey" },
      });
      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: "alistair@kensington-manor.com" },
      });
      fireEvent.change(screen.getByLabelText(/telephone \/ direct mobile/i), {
        target: { value: "+44 20 7946 0889" },
      });
      fireEvent.change(screen.getByLabelText(/property address & postal code/i), {
        target: { value: "15 Holland Park Gardens, London W14" },
      });

      const submitBtn = screen.getByRole("button", { name: /submit confidential valuation request/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByRole("status")).toBeInTheDocument();
      });

      expect(screen.getByText("Valuation Request Received")).toBeInTheDocument();
      expect(screen.getByText(/Lord Alistair Sterling-Grey/i)).toBeInTheDocument();
      expect(screen.getByText(/Strict Fiduciary Invariant:/i)).toBeInTheDocument();
      expect(screen.getByText(/Your property details remain 100% confidential/i)).toBeInTheDocument();

      // Reset action
      const resetBtn = screen.getByRole("button", { name: /submit another property/i });
      fireEvent.click(resetBtn);
      expect(screen.getByLabelText(/owner full name/i)).toBeInTheDocument();
    });
  });

  describe("ContactForm", () => {
    it("renders client inquiry fields, validation, and mailto fallback to concierge@vaneandsterling.com", async () => {
      render(<ContactForm />);

      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/preferred office desk/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/inquiry subject/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message & requirements/i)).toBeInTheDocument();

      // Mailto link check
      const mailtoLink = screen.getByRole("link", { name: /open in email client/i });
      expect(mailtoLink).toHaveAttribute("href", expect.stringContaining("mailto:concierge@vaneandsterling.com"));

      // Trigger validation on empty form
      const submitBtn = screen.getByRole("button", { name: /transmit client inquiry/i });
      fireEvent.click(submitBtn);

      expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
      expect(screen.getAllByText(/please provide your full name/i).length).toBeGreaterThan(0);

      // Enter valid fields
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Clara Oswald" } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "clara@tardis.org" } });
      fireEvent.change(screen.getByLabelText(/message & requirements/i), {
        target: { value: "Looking for an off-market penthouse in Mayfair." },
      });

      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByRole("status")).toBeInTheDocument();
      });

      expect(screen.getByText("Client Inquiry Received")).toBeInTheDocument();
      expect(screen.getByText(/Clara Oswald/i)).toBeInTheDocument();
    });
  });

  describe("Editorial Homepage (/)", () => {
    it("renders editorial hero, collections, featured listings, vignettes, manifesto, header, and footer", () => {
      render(
        <FavoritesProvider>
          <HomePage />
        </FavoritesProvider>
      );

      // Hero
      expect(
        screen.getByRole("heading", {
          name: /Curators of Architectural Pedigree & Historic Provenance/i,
        })
      ).toBeInTheDocument();

      // Curated Collections
      expect(screen.getByText("Curated Collections")).toBeInTheDocument();
      expect(screen.getByText("Penthouses of Mayfair & Tribeca")).toBeInTheDocument();
      expect(screen.getByText("Historic Townhouses & Mansions")).toBeInTheDocument();
      expect(screen.getByText("Cast-Iron Lofts & Sanctuaries")).toBeInTheDocument();

      // Featured Listings
      expect(screen.getByText("Featured Private Portfolio")).toBeInTheDocument();

      // Neighborhood Vignettes
      expect(screen.getByText("Neighborhood Vignettes")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Mayfair" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Belgravia" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Kensington" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Chelsea" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Marylebone" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "SoHo" })).toBeInTheDocument();

      // Manifesto & Trust Signals
      expect(
        screen.getByText(/Private Exclusive Representation\. Without Compromise\./i)
      ).toBeInTheDocument();
      expect(screen.getByText("£1.4B+")).toBeInTheDocument();

      // Global Header & Footer
      expect(screen.getAllByText("AURA")[0]).toBeInTheDocument();
      expect(screen.getByText(/14 Berkeley Square, Mayfair, London W1J 6BD/i)).toBeInTheDocument();
    });
  });

  describe("Sell with Us Page (/sell)", () => {
    it("renders sell page with value pillars, statistics, and SellInquiryForm", () => {
      render(
        <FavoritesProvider>
          <SellPage />
        </FavoritesProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: /Discreet Representation for Architecturally Significant Residences/i,
        })
      ).toBeInTheDocument();

      // Hero Architectural Image & Editorial Badges
      const heroImg = screen.getByRole("img", {
        name: /Architecturally significant modern residential estate/i,
      });
      expect(heroImg).toBeInTheDocument();
      expect(heroImg).toHaveAttribute("loading", "eager");
      expect(screen.getAllByText(/The Grosvenor Belvedere Pavilion/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Private Placement • Prime Enclave/i)).toBeInTheDocument();

      // Primary & Secondary Hero CTAs
      const primaryCta = screen.getByRole("link", {
        name: /Request a Confidential Valuation/i,
      });
      expect(primaryCta).toHaveAttribute("href", "#valuation-form");

      const secondaryLink = screen.getByRole("link", {
        name: /Contact Our Team/i,
      });
      expect(secondaryLink).toHaveAttribute("href", "/contact");

      expect(screen.getByText("100% Off-Market Discretion")).toBeInTheDocument();
      expect(screen.getByText("Architectural Monograph Production")).toBeInTheDocument();
      expect(screen.getByText("Managing Partner Oversight")).toBeInTheDocument();
      expect(screen.getByText("Request Private Owner Consultation")).toBeInTheDocument();
      expect(screen.getByText("Private Client Office (Acquisitions & Exclusives)")).toBeInTheDocument();
    });
  });

  describe("About Us Page (/about)", () => {
    it("renders heritage narrative, 4 pillars, and 4 dedicated partner profiles", () => {
      render(
        <FavoritesProvider>
          <AboutPage />
        </FavoritesProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: /A Confluence of Architectural Discretion & Fiduciary Rigor/i,
        })
      ).toBeInTheDocument();

      expect(screen.getByText("The Four Pillars of AURA Real Estate")).toBeInTheDocument();
      expect(screen.getByText("The Dedicated Partners")).toBeInTheDocument();

      // 4 Partners
      expect(screen.getByText("Julian Vane")).toBeInTheDocument();
      expect(screen.getByText("Eleanor Sterling")).toBeInTheDocument();
      expect(screen.getByText("Alistair Finch")).toBeInTheDocument();
      expect(screen.getByText("Clara Montagu")).toBeInTheDocument();

      // RICS regulation
      expect(screen.getByText(/RICS Regulation & Global Fiduciary Oversight/i)).toBeInTheDocument();
    });

    it("renders architectural hero image, curatorial philosophy image, and hero CTAs", () => {
      render(
        <FavoritesProvider>
          <AboutPage />
        </FavoritesProvider>
      );

      // Hero Architectural Image
      const heroImg = screen.getByAltText(/Historic cast-iron architecture and classical European facade/i);
      expect(heroImg).toBeInTheDocument();
      expect(heroImg).toHaveAttribute("loading", "eager");
      expect(heroImg).toHaveAttribute("src", expect.stringContaining("photo-1545324418-cc1a3fa10c00"));
      expect(heroImg).toHaveAttribute("width", "1600");
      expect(heroImg).toHaveAttribute("height", "2000");
      expect(heroImg).toHaveAttribute("decoding", "async");
      expect(screen.getByText("Curatorial Heritage • Founded 2014")).toBeInTheDocument();
      expect(screen.getByText("Cast-Iron Architectural Provenance")).toBeInTheDocument();

      // Hero CTAs
      const primaryCta = screen.getByRole("link", { name: /explore private portfolio/i });
      expect(primaryCta).toHaveAttribute("href", "/buy");
      const secondaryCta = screen.getByRole("link", { name: /consult with advisory/i });
      expect(secondaryCta).toHaveAttribute("href", "/contact");

      // Curatorial Philosophy Supporting Image
      const curatorialImg = screen.getByAltText(/Refined interior light study with honed stone and gallery proportions/i);
      expect(curatorialImg).toBeInTheDocument();
      expect(curatorialImg).toHaveAttribute("loading", "lazy");
      expect(curatorialImg).toHaveAttribute("src", expect.stringContaining("photo-1600607687920-4e2a09cf159d"));
      expect(curatorialImg).toHaveAttribute("width", "1600");
      expect(curatorialImg).toHaveAttribute("height", "1200");
      expect(curatorialImg).toHaveAttribute("decoding", "async");
      expect(screen.getByText("Spatial Light & Materiality Study")).toBeInTheDocument();

      // Image Fallback Handling — primary fallback
      fireEvent.error(heroImg);
      expect(heroImg).toHaveAttribute("src", expect.stringContaining("photo-1600585154340-be6161a56a0c"));

      // Secondary offline fallback handling
      fireEvent.error(heroImg);
      expect(heroImg.getAttribute("src")).toContain("data:image/svg+xml");
    });
  });

  describe("Contact Page (/contact)", () => {
    it("renders centralized office directory for London, New York, Zurich and general inquiry form", () => {
      render(
        <FavoritesProvider>
          <ContactPage />
        </FavoritesProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: /Engage With Our Private Client Advisory Desks/i,
        })
      ).toBeInTheDocument();

      expect(screen.getByText("Three Global Financial & Architectural Capitals")).toBeInTheDocument();
      expect(screen.getByText("London")).toBeInTheDocument();
      expect(screen.getByText("New York")).toBeInTheDocument();
      expect(screen.getByText("Zurich")).toBeInTheDocument();
      expect(screen.getByText("General Client Inquiry")).toBeInTheDocument();
      expect(screen.getByText("Specialized Departmental Channels")).toBeInTheDocument();
    });

    it("renders architectural hero image, editorial trust indicators, and quick action anchors", () => {
      render(
        <FavoritesProvider>
          <ContactPage />
        </FavoritesProvider>
      );

      // Hero Architectural Image
      const heroImg = screen.getByAltText(/Prime modern private client residence and architectural pavilion/i);
      expect(heroImg).toBeInTheDocument();
      expect(heroImg).toHaveAttribute("loading", "eager");
      expect(heroImg).toHaveAttribute("src", expect.stringContaining("photo-1512917774080-9991f1c4c750"));
      expect(heroImg).toHaveAttribute("width", "1600");
      expect(heroImg).toHaveAttribute("height", "2000");
      expect(heroImg).toHaveAttribute("decoding", "async");
      expect(screen.getByText("Private Client Reception • Advisory")).toBeInTheDocument();
      expect(screen.getByText("Prime Architectural Pavilion")).toBeInTheDocument();

      // Action CTAs
      const inquiryCta = screen.getByRole("link", { name: /transmit client inquiry/i });
      expect(inquiryCta).toHaveAttribute("href", "#inquiry-form");
      const officeLink = screen.getByRole("link", { name: /view global offices/i });
      expect(officeLink).toHaveAttribute("href", "#office-directory");

      // Micro-Trust Indicators
      expect(screen.getByText("3 Cities")).toBeInTheDocument();
      expect(screen.getByText("< 24h")).toBeInTheDocument();
      expect(screen.getByText("Senior Partner SLA")).toBeInTheDocument();

      // Image Fallback Handling — primary fallback
      fireEvent.error(heroImg);
      expect(heroImg).toHaveAttribute("src", expect.stringContaining("photo-1600585154340-be6161a56a0c"));

      // Secondary offline fallback handling
      fireEvent.error(heroImg);
      expect(heroImg.getAttribute("src")).toContain("data:image/svg+xml");
    });
  });

  describe("404 Not Found Page (/not-found)", () => {
    it("renders editorial not-found page with recovery links to /, /buy, /rent, and /contact", () => {
      render(
        <FavoritesProvider>
          <NotFoundPage />
        </FavoritesProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: /Residence Not Found/i,
        })
      ).toBeInTheDocument();

      expect(screen.getByRole("link", { name: /explore private portfolio/i })).toHaveAttribute("href", "/buy");
      expect(screen.getByRole("link", { name: /view turnkey leases/i })).toHaveAttribute("href", "/rent");
      expect(screen.getByRole("link", { name: /return to residence index/i })).toHaveAttribute("href", "/");
      expect(screen.getByRole("link", { name: /inquire with our private client advisory desk/i })).toHaveAttribute(
        "href",
        "/contact"
      );
    });
  });
});
