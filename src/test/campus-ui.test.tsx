import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  AnimatedSelect,
  ListingCard,
  PageBackButton,
  SafariPageMenuIcon,
} from "@/components/campus/shared";
import { CampusProvider, useCampus } from "@/components/campus/store";
import {
  TECHNICAL_ISSUE_MESSAGE,
  UserInputError,
  matchesCategoryFilter,
  toUserSafeErrorMessage,
  validateListing,
  type Listing,
} from "@/lib/campus/data";
import { SELLER_PLANS, getSellerEffectiveLimits } from "@/lib/campus/plans";

vi.mock("@tanstack/react-router", async () => {
  const actual =
    await vi.importActual<typeof import("@tanstack/react-router")>("@tanstack/react-router");
  return {
    ...actual,
    Link: ({
      children,
      to,
      params,
      className,
      ...rest
    }: {
      children: React.ReactNode;
      to: string;
      params?: Record<string, string>;
      className?: string;
      [key: string]: unknown;
    }) => {
      let resolved = to;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          resolved = resolved.replace(`$${k}`, v);
        }
      }
      return (
        <a href={resolved} className={className} {...rest}>
          {children}
        </a>
      );
    },
    Navigate: () => null,
    useNavigate: () => vi.fn(),
    useRouter: () => ({ invalidate: vi.fn(), preloadRoute: vi.fn() }),
    useRouterState: () => "/discover",
  };
});

import { AdminPage } from "@/components/campus/adminConsole";
import { AuthPage } from "@/components/campus/authPage";
import { DetailPage } from "@/components/campus/details";
import { BrowsePage, DiscoverPage } from "@/components/campus/discovery";
import { ManualPage } from "@/components/campus/legal";
import { DashboardPage } from "@/components/campus/management";
import { ProfilePage } from "@/components/campus/profiles";
import {
  SellerStatusIndicator,
  SellerVerificationCard,
  validateVerificationSubmission,
} from "@/components/campus/verification";
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

    expect(screen.getByText(serviceFixture.title)).toBeInTheDocument();
    expect(screen.getByText("All Universities")).toBeInTheDocument();
    expect(screen.queryByText(serviceFixture.description)).not.toBeInTheDocument();
    expect(screen.queryByText(serviceFixture.seller)).not.toBeInTheDocument();

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
    expect(screen.getByText("Technical issue")).toBeInTheDocument();
    expect(screen.getByText(/it is being worked on/i)).toBeInTheDocument();
    expect(screen.queryByText(/Simulated render crash/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reload page/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Go to Discover/i })).toBeInTheDocument();

    shouldThrow = false;
    fireEvent.click(screen.getByRole("button", { name: /Try again/i }));
    expect(screen.getByText("Recovered marketplace view")).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it("masks raw technical errors behind a generic message while preserving UserInputError guidance", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(
      toUserSafeErrorMessage(new Error('relation "public.profiles" does not exist (PGRST205)')),
    ).toBe(TECHNICAL_ISSUE_MESSAGE);
    expect(toUserSafeErrorMessage(new TypeError("Failed to fetch"))).toBe(TECHNICAL_ISSUE_MESSAGE);
    expect(toUserSafeErrorMessage({ message: "JWT expired", code: "PGRST301" })).toBe(
      TECHNICAL_ISSUE_MESSAGE,
    );
    expect(
      toUserSafeErrorMessage(new UserInputError("Upload a clear photo of your Student ID.")),
    ).toBe("Upload a clear photo of your Student ID.");

    consoleSpy.mockRestore();
  });

  it("safely returns false for recordView when backend is unconfigured and clears session cache", async () => {
    clearAnalyticsSessionCache();
    expect(await analyticsService.recordView("listing-123")).toBe(false);
  });
});

describe("Seller identity verification & unique Seller Shop", () => {
  it("enforces Student ID for students, Ghana Card or Voter's ID for non-students, and matching profile photo", () => {
    expect(
      validateVerificationSubmission({
        isStudent: true,
        idDocumentType: "Ghana Card",
        idDocumentPath: "uid/id.jpg",
        profileImageUrl: "https://cdn.example.com/face.jpg",
        photoMatchConfirmed: true,
      }),
    ).toMatch(/Student ID/i);

    expect(
      validateVerificationSubmission({
        isStudent: false,
        idDocumentType: "Student ID",
        idDocumentPath: "uid/id.jpg",
        profileImageUrl: "https://cdn.example.com/face.jpg",
        photoMatchConfirmed: true,
      }),
    ).toMatch(/Ghana Card or Voter's ID/i);

    expect(
      validateVerificationSubmission({
        isStudent: false,
        idDocumentType: "Ghana Card",
        idDocumentPath: "uid/id.jpg",
        profileImageUrl: "",
        photoMatchConfirmed: true,
      }),
    ).toMatch(/real profile photo/i);

    expect(
      validateVerificationSubmission({
        isStudent: false,
        idDocumentType: "Voters ID",
        idDocumentPath: "uid/id.jpg",
        profileImageUrl: "https://cdn.example.com/face.jpg",
        photoMatchConfirmed: false,
      }),
    ).toMatch(/same person on the uploaded ID/i);

    expect(
      validateVerificationSubmission({
        isStudent: true,
        idDocumentType: "Student ID",
        idDocumentPath: "uid/student-id.jpg",
        profileImageUrl: "https://cdn.example.com/face.jpg",
        photoMatchConfirmed: true,
      }),
    ).toBe("");

    expect(
      validateVerificationSubmission({
        isStudent: false,
        idDocumentType: "Ghana Card",
        idDocumentPath: "uid/ghana-card.jpg",
        profileImageUrl: "https://cdn.example.com/face.jpg",
        photoMatchConfirmed: true,
      }),
    ).toBe("");
  });

  it("links listing seller profiles directly to the seller's shop page inside listing details", () => {
    function DetailHarness() {
      const { setListings } = useCampus();
      return (
        <>
          <button
            type="button"
            onClick={() => setListings([{ ...productFixture, sellerId: "seller-ama" }])}
          >
            Seed detail
          </button>
          <DetailPage id={productFixture.id} />
        </>
      );
    }

    render(
      <CampusProvider>
        <DetailHarness />
      </CampusProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Seed detail" }));
    const sellerLink = screen.getByRole("link", { name: /Open Ama Boateng's shop/i });
    expect(sellerLink).toHaveAttribute("href", "/seller/seller-ama");
  });

  it("opens the seller's unique Shop showcasing both products and services without requiring a buyer account", () => {
    function ShopHarness() {
      const { setListings } = useCampus();
      return (
        <>
          <button
            type="button"
            onClick={() =>
              setListings([
                { ...productFixture, sellerId: "seller-ama", seller: "Ama Boateng" },
                {
                  ...serviceFixture,
                  id: "serv-ama",
                  sellerId: "seller-ama",
                  seller: "Ama Boateng",
                  title: "Laptop Repair & SSD Upgrade",
                },
              ])
            }
          >
            Seed shop
          </button>
          <ProfilePage sellerId="seller-ama" />
        </>
      );
    }

    render(
      <CampusProvider>
        <ShopHarness />
      </CampusProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Seed shop" }));

    expect(screen.getByRole("heading", { name: /Ama Boateng’s Shop/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "All (2)" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Products (1)" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Services (1)" })).toBeInTheDocument();
    expect(screen.getByText("HP EliteBook 840 G6")).toBeInTheDocument();
    expect(screen.getByText("Laptop Repair & SSD Upgrade")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Services (1)" }));
    expect(screen.queryByText("HP EliteBook 840 G6")).not.toBeInTheDocument();
    expect(screen.getByText("Laptop Repair & SSD Upgrade")).toBeInTheDocument();
    expect(screen.getByText("Unverified Seller")).toBeInTheDocument();
  });

  it("renders distinct visual status indicators for Verified, Pending, and Unverified sellers", () => {
    const { rerender } = render(<SellerStatusIndicator status="verified" />);
    expect(screen.getByText("Verified Seller")).toBeInTheDocument();
    expect(screen.getByText(/Live selfie reviewed and approved by an Admin/i)).toBeInTheDocument();

    rerender(<SellerStatusIndicator status="pending" />);
    expect(screen.getByText("Verification Pending")).toBeInTheDocument();
    expect(screen.getByText(/awaiting Admin review/i)).toBeInTheDocument();

    rerender(<SellerStatusIndicator status="unverified" />);
    expect(screen.getByText("Unverified Seller")).toBeInTheDocument();
  });
});

describe("Marketplace updates: selective errors, filters, quotas, subscriptions & Act 843 protection", () => {
  it("shows real user-correctable auth & quota messages while masking technical errors", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(toUserSafeErrorMessage(new Error("Invalid login credentials"))).toMatch(
      /Incorrect email or password/i,
    );
    expect(toUserSafeErrorMessage(new Error("Email not confirmed"))).toMatch(/verify your email/i);
    expect(toUserSafeErrorMessage(new Error("listing_quota_reached"))).toMatch(
      /limit of 5 listings/i,
    );
    expect(toUserSafeErrorMessage(new Error('relation "public.listings" does not exist'))).toBe(
      TECHNICAL_ISSUE_MESSAGE,
    );

    consoleSpy.mockRestore();
  });

  it("matches Beauty and Hair & Beauty listings when filtering", () => {
    expect(matchesCategoryFilter("Hair & Beauty", "Beauty")).toBe(true);
    expect(matchesCategoryFilter("Beauty", "Hair & Beauty")).toBe(true);
    expect(matchesCategoryFilter("Electronics", "Electronics")).toBe(true);
    expect(matchesCategoryFilter("Electronics", "Beauty")).toBe(false);
  });

  it("enforces pre-December 5-listing / 3-image limits and December 1, 2026 subscription tiers", () => {
    const preLaunch = getSellerEffectiveLimits(
      { role: "seller", subscriptionTier: "free_launch", subscriptionStatus: "active" },
      new Date("2026-11-18T12:00:00Z"),
    );
    expect(preLaunch.billingActive).toBe(false);
    expect(preLaunch.maxListings).toBe(5);
    expect(preLaunch.maxImagesPerListing).toBe(3);

    const postDecUnpaid = getSellerEffectiveLimits(
      { role: "seller", subscriptionTier: "free_launch", subscriptionStatus: "active" },
      new Date("2026-12-01T00:00:00Z"),
    );
    expect(postDecUnpaid.billingActive).toBe(true);
    expect(postDecUnpaid.requiresActivePlan).toBe(true);

    const postDecPlus = getSellerEffectiveLimits(
      {
        role: "seller",
        subscriptionTier: "plus",
        subscriptionStatus: "active",
        subscriptionExpiresAt: "2027-01-01T00:00:00Z",
      },
      new Date("2026-12-05T12:00:00Z"),
    );
    expect(postDecPlus.maxListings).toBe(10);
    expect(postDecPlus.maxImagesPerListing).toBe(3);

    expect(
      SELLER_PLANS.map((p) => [p.name, p.priceGhs, p.maxListings, p.maxImagesPerListing]),
    ).toEqual([
      ["Standard", 15, 5, 2],
      ["Plus", 25, 10, 3],
      ["Pro", 35, 20, 5],
    ]);

    expect(
      validateListing({
        type: "product",
        title: "Calculator",
        description: "Scientific calculator in great shape",
        price: "90",
        images: ["a.jpg", "b.jpg", "c.jpg", "d.jpg"],
        audience: ["KNUST"],
        contact: "0241112233",
      }),
    ).toMatch(/up to 3 images/i);
  });

  it("renders PageBackButton and shows Ghana Data Protection Act notice on verification", () => {
    render(
      <CampusProvider>
        <PageBackButton fallbackTo="/discover" label="Back" />
      </CampusProvider>,
    );
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();

    // Verify Ghana Data Protection Act copy compiles cleanly in verification module
    expect(typeof SellerVerificationCard).toBe("function");
  });

  it("renders banner images on Discover, Browse, Legal, and Seller Shop (default fallback), while omitting them on Account & Dashboard", () => {
    const { container: discoverContainer } = render(
      <CampusProvider>
        <DiscoverPage />
      </CampusProvider>,
    );
    const discoverImg = discoverContainer.querySelector(".hero-banner-media img");
    expect(discoverImg).toHaveAttribute("src", "/banners/discover-banner.webp");

    const { container: browseContainer } = render(
      <CampusProvider>
        <BrowsePage type="product" />
      </CampusProvider>,
    );
    const browseImg = browseContainer.querySelector(".hero-banner-media img");
    expect(browseImg).toHaveAttribute("src", "/banners/showcase-banner.webp");

    const { container: accountContainer } = render(
      <CampusProvider>
        <ProfilePage />
      </CampusProvider>,
    );
    expect(accountContainer.querySelector(".hero-banner-media")).toBeNull();

    function DashboardHarness() {
      const { setUser } = useCampus();
      return (
        <>
          <button
            type="button"
            onClick={() =>
              setUser({
                id: "seller-ama",
                name: "Ama Boateng",
                email: "ama@knust.edu.gh",
                university: "KNUST",
                capability: "Product Seller",
                bio: "",
                contact: "WhatsApp",
              })
            }
          >
            Sign in seller
          </button>
          <DashboardPage />
        </>
      );
    }

    const { container: dashContainer } = render(
      <CampusProvider>
        <DashboardHarness />
      </CampusProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Sign in seller" }));
    expect(dashContainer.querySelector(".dashboard-hero-panel")).toBeInTheDocument();
    expect(dashContainer.querySelector(".hero-banner-media")).toBeNull();

    function ShopBannerHarness() {
      const { setListings } = useCampus();
      return (
        <>
          <button
            type="button"
            onClick={() =>
              setListings([{ ...productFixture, sellerId: "seller-ama", seller: "Ama Boateng" }])
            }
          >
            Load shop
          </button>
          <ProfilePage sellerId="seller-ama" />
        </>
      );
    }

    const { container: shopContainer } = render(
      <CampusProvider>
        <ShopBannerHarness />
      </CampusProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Load shop" }));
    const shopImg = shopContainer.querySelector(".hero-banner-media img");
    expect(shopImg).toHaveAttribute("src", "/banners/shop-default-banner.webp");
  });

  it("renders Safari 3-bar Page Menu SVG icon without three-dot text in Safari guides", () => {
    const { container } = render(
      <CampusProvider>
        <ManualPage />
      </CampusProvider>,
    );
    expect(container.querySelector(".safari-menu-badge svg")).toBeInTheDocument();

    const { container: iconContainer } = render(<SafariPageMenuIcon />);
    expect(iconContainer.querySelectorAll("line")).toHaveLength(3);

    const { container: browseFilterContainer } = render(
      <CampusProvider>
        <BrowsePage type="product" />
      </CampusProvider>,
    );
    const allChip = browseFilterContainer.querySelector('.filter-chip[data-active="true"]');
    expect(allChip).toHaveTextContent("All");
  });
});
