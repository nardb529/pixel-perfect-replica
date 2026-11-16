import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  MapPin,
  Share2,
  Flag,
  MessageCircle,
  Phone,
  Check,
  Copy,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCampus } from "./store";
import {
  Shell,
  SectionTitle,
  ListingCard,
  Empty,
  Likes,
  SaveButton,
  AnimatedSelect,
  PagePendingFallback,
} from "./shared";
import {
  buildPhoneHref,
  buildWhatsAppUrl,
  formatListingPrice,
  type Listing,
} from "@/lib/campus/data";
import { listingService } from "@/services";
import type { ReportReason } from "@/lib/supabase/database.types";

const REPORT_REASONS: ReportReason[] = [
  "Scam or suspicious activity",
  "Misleading listing",
  "Inappropriate content",
  "Duplicate listing",
  "Prohibited product or service",
  "Other",
];

export function DetailPage({ id }: { id: string }) {
  const { listings, backendConfigured, recordView, recordContact, reportListing } = useCampus();
  const cachedListing = listings.find((l) => l.id === id) || null;
  const [fetchedListing, setFetchedListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState<boolean>(backendConfigured && !cachedListing);
  const [contact, setContact] = useState(false);
  const [report, setReport] = useState(false);
  const [reason, setReason] = useState<string>(REPORT_REASONS[1] ?? "Misleading listing");
  const [reportDescription, setReportDescription] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const viewedId = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    setImageIndex(0);
    setFetchedListing(null);

    if (backendConfigured) {
      if (!cachedListing) setLoading(true);
      void listingService
        .getListingById(id)
        .then((res) => {
          if (active && res) setFetchedListing(res);
        })
        .catch(() => undefined)
        .finally(() => {
          if (active) setLoading(false);
        });
    } else {
      setLoading(false);
    }

    if (viewedId.current !== id) {
      viewedId.current = id;
      recordView(id, "detail_page");
    }

    return () => {
      active = false;
    };
  }, [id, backendConfigured, cachedListing, recordView]);

  const listing = fetchedListing || cachedListing;

  if (loading && !listing) {
    return (
      <Shell>
        <PagePendingFallback />
      </Shell>
    );
  }

  if (!listing) {
    return (
      <Shell>
        <Empty
          title="Listing unavailable"
          text="This item may have been removed or paused. Explore other listings nearby."
        >
          <Button asChild>
            <Link to="/discover">Back to Discover</Link>
          </Button>
        </Empty>
      </Shell>
    );
  }

  const images = listing.images?.length ? listing.images : listing.image ? [listing.image] : [];
  const others = listings.filter(
    (l) =>
      l.id !== id &&
      l.status === "Active" &&
      ((listing.sellerId && l.sellerId === listing.sellerId) || l.seller === listing.seller),
  );
  const hasPrice = listing.price > 0;
  const enquiryText = `Hi ${listing.seller}, I saw “${listing.title}” on CampusLoop. Is it still available?`;
  const whatsappUrl = buildWhatsAppUrl(listing.contact, enquiryText);
  const phoneHref = buildPhoneHref(listing.contact);
  const sellerProfileParam = listing.sellerId || listing.id;

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing?.title || "CampusLoop",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied");
      }
    } catch {
      toast.info("Sharing cancelled");
    }
  }

  return (
    <Shell>
      <Link to="/discover" className="back-link">
        <ArrowLeft size={15} />
        Back
      </Link>

      <div className="detail-grid">
        <div className="surface-panel detail-media-panel">
          {images[imageIndex] ? (
            <img
              className="detail-image"
              src={images[imageIndex]}
              alt={listing.title}
              referrerPolicy="no-referrer"
              decoding="async"
              width={1024}
              height={1024}
            />
          ) : (
            <div className="detail-image listing-image-fallback">No photo provided</div>
          )}
          {images.length > 1 && (
            <div className="detail-thumbs">
              {images.map((im, i) => (
                <Button
                  key={i}
                  variant={imageIndex === i ? "default" : "outline"}
                  aria-label={`View image ${i + 1}`}
                  onClick={() => setImageIndex(i)}
                >
                  <img src={im} alt={`${listing.title} view ${i + 1}`} decoding="async" />
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="surface-panel detail-content curve-accent">
          <div className="detail-kicker">
            <span>{listing.category}</span>
            <span>·</span>
            <span>{listing.type === "service" ? "Service" : "Product"}</span>
            {listing.priceType && (
              <>
                <span>·</span>
                <span>{listing.priceType}</span>
              </>
            )}
          </div>
          <h1>{listing.title}</h1>
          <p className="detail-price">
            {listing.type === "service" && hasPrice && listing.priceType !== "Free" && (
              <small>From </small>
            )}
            {formatListingPrice(listing)}
          </p>

          <div className="detail-meta-line">
            {listing.condition && <span>{listing.condition}</span>}
            {listing.condition && <span aria-hidden="true">·</span>}
            {listing.brand && (
              <>
                <span>{listing.brand}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>
              <MapPin size={13} />
              {listing.location
                ? `${listing.location} (${listing.audience.join(", ")})`
                : listing.audience.join(", ")}
            </span>
            <span aria-hidden="true">·</span>
            <span>{listing.time}</span>
          </div>

          <div className="detail-description">
            <h3>Details</h3>
            <p>{listing.description}</p>
            {(listing.stockStatus ||
              listing.duration ||
              listing.serviceArea ||
              listing.deliveryMethod) && (
              <div className="detail-extra-specs">
                {listing.stockStatus && (
                  <span>
                    <strong>Availability:</strong> {listing.stockStatus}
                  </span>
                )}
                {listing.duration && (
                  <span>
                    <strong>Typical duration:</strong> {listing.duration}
                  </span>
                )}
                {listing.serviceArea && (
                  <span>
                    <strong>Service area:</strong> {listing.serviceArea}
                  </span>
                )}
                {listing.deliveryMethod && (
                  <span>
                    <strong>Delivery:</strong> {listing.deliveryMethod}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="seller-strip">
            <span className="avatar">
              {listing.seller
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div>
              <strong className="seller-name-inline">
                {listing.seller}
                {listing.verificationStatus === "verified" && (
                  <BadgeCheck
                    size={14}
                    className="verified-inline-icon"
                    aria-label="Verified seller"
                  />
                )}
              </strong>
              <small>{listing.university}</small>
            </div>
            <Link to="/seller/$id" params={{ id: sellerProfileParam }} className="text-link">
              View profile
            </Link>
          </div>

          <div className="detail-actions">
            <Button
              className="contact-button"
              onClick={() => {
                recordContact(id, listing.contactMethod || "WhatsApp");
                setContact(true);
              }}
            >
              {listing.type === "service" ? (
                <>
                  <MessageCircle size={18} />
                  Contact Provider
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  Get now
                </>
              )}
            </Button>
            <SaveButton id={id} />
            <Likes id={id} />
            <Button variant="outline" onClick={share}>
              <Share2 size={16} />
              Share
            </Button>
          </div>

          <Button variant="ghost" className="detail-report" onClick={() => setReport(true)}>
            <Flag size={13} />
            Report listing
          </Button>
        </div>
      </div>

      {others.length > 0 && (
        <section className="surface-panel section-panel">
          <SectionTitle title={`More from ${listing.seller}`} />
          <div className="listing-carousel">
            {others.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      <Dialog open={contact} onOpenChange={setContact}>
        <DialogContent className="mobile-dialog onboarding-dialog">
          <DialogTitle>Connect with {listing.seller}</DialogTitle>
          <DialogDescription>Choose a contact option to reach out on campus.</DialogDescription>
          <div className="modal-body">
            <div className="contact-method">
              <MessageCircle size={20} />
              <div>
                <strong>{listing.contactMethod || "WhatsApp"}</strong>
                <small>{listing.contact || "+233 XX XXX XXXX"}</small>
              </div>
              <Check className="ml-auto" size={16} />
            </div>
            {phoneHref && (
              <a
                href={phoneHref}
                onClick={() => recordContact(id, "Phone call")}
                className="contact-method contact-method-link"
              >
                <Phone size={20} />
                <div>
                  <strong>Call directly</strong>
                  <small>{listing.contact}</small>
                </div>
                <ExternalLink className="ml-auto" size={15} />
              </a>
            )}
            <p>Meet in an open campus space and inspect items before making any payment.</p>
            <div className="modal-actions">
              {whatsappUrl ? (
                <Button asChild>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      recordContact(id, "WhatsApp");
                      toast.success(`Opening WhatsApp chat for ${listing.seller}`);
                      setContact(false);
                    }}
                  >
                    <ExternalLink size={16} />
                    Message on WhatsApp
                  </a>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    toast.success(
                      `Contact ${listing.seller} via ${listing.contactMethod || "their listed handle"}`,
                    );
                    setContact(false);
                  }}
                >
                  <ExternalLink size={16} />
                  Reach out via {listing.contactMethod || "Seller contact"}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={async () => {
                  await navigator.clipboard.writeText(enquiryText);
                  toast.success("Message copied");
                }}
              >
                <Copy size={16} />
                Copy enquiry message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={report} onOpenChange={setReport}>
        <DialogContent className="mobile-dialog onboarding-dialog">
          <DialogTitle>Report listing</DialogTitle>
          <DialogDescription>
            Tell us what looks wrong so our moderation team can review this listing.
          </DialogDescription>
          <div className="modal-body">
            <div className="form-field">
              <span>Reason</span>
              <AnimatedSelect
                ariaLabel="Report reason"
                kicker="Select a reason"
                value={reason}
                onValueChange={setReason}
                options={REPORT_REASONS}
              />
            </div>
            <label className="form-field">
              <span>Additional details (optional)</span>
              <textarea
                placeholder="Describe what happened or what seems suspicious..."
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
              />
            </label>
            <Button
              onClick={() => {
                reportListing(id, reason, reportDescription);
                toast.success("Report submitted");
                setReportDescription("");
                setReport(false);
              }}
            >
              Submit report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
