import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AnimatedSelect, ListingCard } from "@/components/campus/shared";
import { CampusProvider, useCampus } from "@/components/campus/store";
import {
  TECHNICAL_ISSUE_MESSAGE,
  UserInputError,
  toUserSafeErrorMessage,
  type Listing,
} from "@/lib/campus/data";

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
    useNavigate: () => vi.fn(),
    useRouter: () => ({ invalidate: vi.fn(), preloadRoute: vi.fn() }),
    useRouterState: () => "/discover",
  };
});

import { AdminPage } from "@/components/campus/admin";
import { AuthPage } from "@/components/campus/auth";
import { DiscoverPage } from "@/components/campus/discovery";
import { ProfilePage } from "@/components/campus/profiles";
import {
  SellerStatusIndicator,
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

  it("shows actionable auth & user errors cleanly while masking internal DB/network errors", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    // User-actionable authentication & account errors MUST be shown clearly
    expect(toUserSafeErrorMessage(new Error("Invalid login credentials"))).toBe(
      "Incorrect email or password. Please check your details and try again.",
    );
    expect(toUserSafeErrorMessage({ message: "Email not confirmed" })).toBe(
      "Please verify your email address from the confirmation link in your inbox before signing in.",
    );
    expect(toUserSafeErrorMessage({ message: "User already registered" })).toBe(
      "An account with this email already exists. Switch to Log In instead.",
    );
    expect(
      toUserSafeErrorMessage({
        message: "New password should be different from the old password.",
      }),
    ).toBe("Choose a new password that is different from your current password.");
    expect(
      toUserSafeErrorMessage({
        message: "For security purposes, you can only request this after 42 seconds.",
      }),
    ).toBe("Too many attempts. Please wait 42 seconds before trying again.");
    expect(
      toUserSafeErrorMessage({
        code: "23505",
        message: 'duplicate key value violates unique constraint "profiles_username_key"',
      }),
    ).toBe("That username is already taken. Try choosing a different username.");
    expect(
      toUserSafeErrorMessage(new UserInputError("Upload a clear photo of your Student ID.")),
    ).toBe("Upload a clear photo of your Student ID.");

    // Internal database, network, schema, JWT, and unknown failures MUST stay masked
    expect(
      toUserSafeErrorMessage(new Error('relation "public.profiles" does not exist (PGRST205)')),
    ).toBe(TECHNICAL_ISSUE_MESSAGE);
    expect(toUserSafeErrorMessage(new TypeError("Failed to fetch"))).toBe(TECHNICAL_ISSUE_MESSAGE);
    expect(toUserSafeErrorMessage({ message: "JWT expired", code: "PGRST301" })).toBe(
      TECHNICAL_ISSUE_MESSAGE,
    );

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

  it("links listing seller names directly to the seller's shop page", () => {
    render(
      <CampusProvider>
        <ListingCard listing={{ ...productFixture, sellerId: "seller-ama" }} />
      </CampusProvider>,
    );

    const sellerLink = screen.getByRole("link", { name: /Visit Ama Boateng's shop/i });
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
    expect(
      screen.getByText(/Identity & ID background check approved by Admin/i),
    ).toBeInTheDocument();

    rerender(<SellerStatusIndicator status="pending" />);
    expect(screen.getByText("Verification Pending")).toBeInTheDocument();
    expect(screen.getByText(/awaiting Admin review/i)).toBeInTheDocument();

    rerender(<SellerStatusIndicator status="unverified" />);
    expect(screen.getByText("Unverified Seller")).toBeInTheDocument();
  });
});
