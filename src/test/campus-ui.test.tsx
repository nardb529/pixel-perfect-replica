import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AnimatedSelect } from "@/components/campus/shared";
import { CampusProvider } from "@/components/campus/store";
import { initialListings } from "@/lib/campus/data";

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

import { ListingCard } from "@/components/campus/shared";
import { AdminPage } from "@/components/campus/admin";

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
    const product = initialListings.find((l) => l.type === "product");
    expect(product).toBeDefined();
    if (!product) return;

    render(
      <CampusProvider>
        <ListingCard listing={product} />
      </CampusProvider>,
    );

    const getNowBtn = screen.getByRole("button", { name: "Get now" });
    expect(getNowBtn).toBeInTheDocument();

    fireEvent.click(getNowBtn);
    expect(screen.getByText(`Get ${product.title}`)).toBeInTheDocument();
  });

  it("renders 'Contact' on service listings and opens quick connect dialog", () => {
    const service = initialListings.find((l) => l.type === "service");
    expect(service).toBeDefined();
    if (!service) return;

    render(
      <CampusProvider>
        <ListingCard listing={service} />
      </CampusProvider>,
    );

    const contactBtn = screen.getByRole("button", { name: "Contact" });
    expect(contactBtn).toBeInTheDocument();

    fireEvent.click(contactBtn);
    expect(screen.getByText(`Contact ${service.seller}`)).toBeInTheDocument();
  });
});

describe("AdminPage Command Center", () => {
  it("renders command overview KPIs and switches across management sections", () => {
    render(
      <CampusProvider>
        <AdminPage />
      </CampusProvider>,
    );

    expect(screen.getByRole("heading", { name: "Platform Administration" })).toBeInTheDocument();
    expect(screen.getByText("Campus Distribution & Action Queue")).toBeInTheDocument();

    const listingsTab = screen.getByRole("tab", { name: /Listings/i });
    fireEvent.click(listingsTab);
    expect(screen.getByText("All Marketplace Listings")).toBeInTheDocument();

    const announcementsTab = screen.getByRole("tab", { name: /Announcements/i });
    fireEvent.click(announcementsTab);
    expect(screen.getByText("Announcements & User Notifications")).toBeInTheDocument();

    const auditTab = screen.getByRole("tab", { name: /Audit Log/i });
    fireEvent.click(auditTab);
    expect(screen.getByText("Moderation & Admin Audit Log")).toBeInTheDocument();
  });
});
