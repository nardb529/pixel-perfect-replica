import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AnimatedSelect, ListingCard } from "@/components/campus/shared";
import { CampusProvider } from "@/components/campus/store";
import type { Listing } from "@/lib/campus/data";

vi.mock("@tanstack/react-router", async () => {
  const actual =
    await vi.importActual<typeof import("@tanstack/react-router")>("@tanstack/react-router");
  return {
    ...actual,
    Link: ({
      children,
      to,
      className,
    }: {
      children: React.ReactNode;
      to: string;
      className?: string;
    }) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
    useNavigate: () => vi.fn(),
    useRouter: () => ({ invalidate: vi.fn() }),
    useRouterState: () => "/discover",
  };
});

import { AdminPage } from "@/components/campus/admin";
import { AuthPage } from "@/components/campus/auth";
import { DiscoverPage } from "@/components/campus/discovery";
import { ErrorBoundary } from "@/components/error-boundary";
import { analyticsService, clearAnalyticsSessionCache } from "@/services/analyticsService";

const productFixture: Listing = {
  id: "prod-1",
  title: "HP EliteBook 840 G6",
  type: "product",
  category: "Electronics",
  price: 3400,
  image: "https://cdn.example.com/laptop.jpg",
  seller: "Ama Boateng",
  university: "KNUST",
  audience: ["KNUST"],
  description: "Clean Core i5 laptop with original charger.",
  time: "2h ago",
  status: "Active",
  views: 12,
  likes: 2,
  contact: "0241112233",
  contactMethod: "WhatsApp",
};

const serviceFixture: Listing = {
  id: "serv-1",
  title: "Campus Flyer & Brand Design",
  type: "service",
  category: "Graphic Design",
  price: 120,
  priceType: "Starting from",
  image: "https://cdn.example.com/design.jpg",
  seller: "Kofi Mensah",
  university: "University of Ghana",
  audience: ["All Universities"],
  description: "Fast turnaround event posters and club branding.",
  time: "1h ago",
  status: "Active",
  views: 8,
  likes: 1,
  contact: "0552223344",
  contactMethod: "WhatsApp",
};

describe("AnimatedSelect dropdown", () => {
  it("opens options, updates value, and syncs hidden form input", () => {
    const onChange = vi.fn();
    const { container } = render(
      <form>
        <AnimatedSelect
          name="university"
          ariaLabel="University"
          defaultValue="KNUST"
          onValueChange={onChange}
          options={["KNUST", "University of Ghana", "UCC"]}
        />
      </form>,
    );

    const trigger = screen.getByRole("button", { name: "University" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    const hidden = container.querySelector('input[type="hidden"][name="university"]');
    expect(hidden).toHaveAttribute("value", "KNUST");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const option = screen.getByRole("option", { name: "University of Ghana" });
    fireEvent.click(option);

    expect(onChange).toHaveBeenCalledWith("University of Ghana");
    expect(hidden).toHaveAttribute("value", "University of Ghana");
  });
});

describe("ListingCard actions", () => {
  it("renders 'Get now' on product listings and opens quick connect dialog", () => {
    render(
      <CampusProvider>
        <ListingCard listing={productFixture} />
      </CampusProvider>,
    );

    const getNowBtn = screen.getByRole("button", { name: "Get now" });
    expect(getNowBtn).toBeInTheDocument();

    fireEvent.click(getNowBtn);
    expect(screen.getByText(`Get ${productFixture.title}`)).toBeInTheDocument();
  });

  it("renders 'Contact' on service listings and opens quick connect dialog", () => {
    render(
      <CampusProvider>
        <ListingCard listing={serviceFixture} />
      </CampusProvider>,
    );

    const contactBtn = screen.getByRole("button", { name: "Contact" });
    expect(contactBtn).toBeInTheDocument();

    fireEvent.click(contactBtn);
    expect(screen.getByText(`Contact ${serviceFixture.seller}`)).toBeInTheDocument();
  });
});

describe("Commercial marketplace & fail-closed security gates", () => {
  it("renders empty marketplace state with zero demo listings when no backend items exist", () => {
    render(
      <CampusProvider>
        <DiscoverPage />
      </CampusProvider>,
    );

    expect(screen.getByText(/No listings in .* yet/i)).toBeInTheDocument();
  });

  it("clears active search query when clicking the 'All items' category shortcut", () => {
    render(
      <CampusProvider>
        <DiscoverPage />
      </CampusProvider>,
    );

    const input = screen.getByPlaceholderText(/Search products, services, sellers/i);
    fireEvent.change(input, { target: { value: "laptop" } });
    expect(screen.getByText("0 results")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "All items" }));
    expect(input).toHaveValue("");
    expect(screen.getByText("Just dropped")).toBeInTheDocument();
  });

  it("disables authentication submission when backend credentials are unavailable", () => {
    render(
      <CampusProvider>
        <AuthPage />
      </CampusProvider>,
    );

    expect(screen.getByRole("button", { name: /Create account/i })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /Log In/i }));
    expect(screen.getByRole("button", { name: /Sign in/i })).toBeDisabled();
  });

  it("denies access to AdminPage when unauthenticated or non-admin", () => {
    render(
      <CampusProvider>
        <AdminPage />
      </CampusProvider>,
    );

    expect(
      screen.getByRole("heading", { name: "Admin authorization required" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Access restricted")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Platform Administration" }),
    ).not.toBeInTheDocument();
  });
});

describe("Global ErrorBoundary & free-tier analytics cache", () => {
  it("catches render errors and recovers cleanly when Try again is clicked", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    let shouldThrow = true;

    function FlakyChild() {
      if (shouldThrow) {
        throw new Error("Simulated render crash");
      }
      return <div>Recovered marketplace view</div>;
    }

    render(
      <ErrorBoundary>
        <FlakyChild />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Something unexpected happened")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reload page/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Go to Discover/i })).toBeInTheDocument();

    shouldThrow = false;
    fireEvent.click(screen.getByRole("button", { name: /Try again/i }));
    expect(screen.getByText("Recovered marketplace view")).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it("safely returns false for recordView when backend is unconfigured and clears session cache", async () => {
    clearAnalyticsSessionCache();
    expect(await analyticsService.recordView("listing-123")).toBe(false);
  });
});
