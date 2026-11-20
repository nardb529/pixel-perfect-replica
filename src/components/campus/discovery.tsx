import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Smartphone,
  ShoppingBag,
  GraduationCap,
  Coffee,
  Scissors,
  Camera,
  Sofa,
  Cpu,
  LayoutGrid,
  ArrowRight,
  SlidersHorizontal,
  MapPin,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCampus } from "./store";
import { PageBanner } from "./banners";
import { warmImages } from "@/lib/campus/imageCache";
import {
  Shell,
  SearchBar,
  SectionTitle,
  ListingCard,
  Empty,
  BrowseLink,
  PageIntro,
  PageBackButton,
  AnimatedSelect,
} from "./shared";
import { filterListings, type Listing } from "@/lib/campus/data";
import { listingService } from "@/services";

const shortcuts = [
  { name: "Electronics", icon: Smartphone, tone: "indigo" },
  { name: "Fashion", icon: ShoppingBag, tone: "violet" },
  { name: "Books & Academics", label: "Books", icon: GraduationCap, tone: "blue" },
  { name: "Food & Groceries", label: "Food", icon: Coffee, tone: "amber" },
  { name: "Beauty", label: "Beauty", icon: Scissors, tone: "rose" },
  { name: "Photography", label: "Photos", icon: Camera, tone: "cyan" },
  { name: "Hostel Essentials", label: "Hostel", icon: Sofa, tone: "emerald" },
  { name: "Technology & Repairs", label: "Repairs", icon: Cpu, tone: "slate" },
  { name: "All", label: "All items", icon: LayoutGrid, tone: "indigo" },
];

/** Remembers the last Products / Services results so switching tabs does not reload them. */
const browseCache = new Map<string, { items: Listing[]; total: number; at: number }>();
const BROWSE_FRESH_MS = 45_000;

export function DiscoverPage() {
  const {
    listings,
    listingsLoading,
    listingsError,
    refreshListings,
    university,
    setUniversity,
    universityNames,
    dbUniversities,
    backendConfigured,
    schemaReady,
  } = useCampus();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [remoteSuggestions, setRemoteSuggestions] = useState<
    Array<{ id: string; title: string; type: "product" | "service" }>
  >([]);
  const [remoteSearchResults, setRemoteSearchResults] = useState<Listing[] | null>(null);
  const [remoteSearchLoading, setRemoteSearchLoading] = useState(false);
  const navigate = useNavigate();

  const searching = Boolean(query.trim()) || category !== "All";

  useEffect(() => {
    function handleDiscoverRefresh() {
      setQuery("");
      setCategory("All");
    }
    window.addEventListener("campusloop:discover-refresh", handleDiscoverRefresh);
    return () => window.removeEventListener("campusloop:discover-refresh", handleDiscoverRefresh);
  }, []);

  useEffect(() => {
    if (!backendConfigured || !schemaReady || query.trim().length < 2) {
      setRemoteSuggestions([]);
      return;
    }
    let active = true;
    const timer = window.setTimeout(() => {
      void listingService
        .getSearchSuggestions(query, 6)
        .then((items) => {
          if (active) setRemoteSuggestions(items);
        })
        .catch(() => undefined);
    }, 300);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [backendConfigured, schemaReady, query]);

  useEffect(() => {
    if (!backendConfigured || !schemaReady || !searching) {
      setRemoteSearchResults(null);
      setRemoteSearchLoading(false);
      return;
    }
    let active = true;
    setRemoteSearchLoading(true);
    const timer = window.setTimeout(() => {
      void listingService
        .searchListings({
          universityFilter: university === "All Universities" ? null : university,
          categoryFilter: category === "All" ? null : category,
          searchQuery: query.trim() || null,
          sort: query.trim() ? "relevant" : "recent",
          limit: 48,
          offset: 0,
        })
        .then(({ items }) => {
          if (!active) return;
          setRemoteSearchResults(items);
          setRemoteSearchLoading(false);
        })
        .catch(() => {
          if (!active) return;
          setRemoteSearchResults(null);
          setRemoteSearchLoading(false);
        });
    }, 220);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [backendConfigured, schemaReady, searching, university, category, query]);

  const suggestions = useMemo(() => {
    if (backendConfigured && schemaReady && remoteSuggestions.length > 0) return remoteSuggestions;
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return listings
      .filter((l) => l.status === "Active" && `${l.title} ${l.category}`.toLowerCase().includes(q))
      .slice(0, 5)
      .map((l) => ({ id: l.id, title: l.title, type: l.type }));
  }, [backendConfigured, schemaReady, remoteSuggestions, query, listings]);

  const localResults = useMemo(
    () => filterListings(listings, university, query, undefined, category),
    [listings, university, query, category],
  );
  const results = searching && remoteSearchResults !== null ? remoteSearchResults : localResults;
  const services = useMemo(
    () => filterListings(listings, university, "", "service").slice(0, 4),
    [listings, university],
  );
  const affordable = useMemo(
    () => filterListings(listings, university, "", undefined, "All", 100).slice(0, 4),
    [listings, university],
  );

  const featuredCampuses = useMemo(() => {
    if (dbUniversities.length > 0) {
      return dbUniversities
        .filter((u) => u.is_active)
        .slice(0, 4)
        .map((u) => ({ name: u.short_name || u.university_name, location: u.location || "Ghana" }));
    }
    return universityNames.slice(0, 4).map((name, i) => ({
      name,
      location: ["Kumasi", "Legon, Accra", "Cape Coast", "Madina, Accra"][i] || "Ghana",
    }));
  }, [dbUniversities, universityNames]);

  return (
    <Shell>
      <PageBanner banner="discover">
        <div className="discover-heading">
          <div>
            <p className="greeting">Campus marketplace</p>
            <h1>What are you looking for today?</h1>
          </div>
          <span className="campus-scope-label">{university}</span>
        </div>

        <SearchBar
          value={query}
          onChange={setQuery}
          suggestions={suggestions}
          onSelectSuggestion={(s) => navigate({ to: "/listing/$id", params: { id: s.id } })}
        />
      </PageBanner>

      <div className="category-row" aria-label="Category shortcuts">
        {shortcuts.map((s) => (
          <button
            type="button"
            key={s.name}
            className={`category-shortcut tone-${s.tone} ${category === s.name && s.name !== "All" ? "selected" : ""}`}
            onClick={() => {
              if (s.name === "All") {
                if (searching) {
                  setQuery("");
                  setCategory("All");
                } else {
                  navigate({ to: "/products" });
                }
                return;
              }
              setCategory(s.name === category ? "All" : s.name);
            }}
          >
            <span className="category-icon-orb">
              <s.icon size={19} strokeWidth={2} />
            </span>
            <small>{s.label || s.name}</small>
          </button>
        ))}
      </div>

      <section className="surface-panel section-panel">
        <SectionTitle
          title={
            searching
              ? `${results.length} ${results.length === 1 ? "result" : "results"}`
              : "Just dropped"
          }
        >
          {searching ? (
            <Button
              variant="link"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Clear filters
            </Button>
          ) : (
            <BrowseLink />
          )}
        </SectionTitle>

        {(listingsLoading || remoteSearchLoading) && results.length === 0 ? (
          <div className="listing-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="route-skeleton-card" />
            ))}
          </div>
        ) : listingsError && results.length === 0 ? (
          <Empty title="Listings temporarily unavailable" text={listingsError}>
            <Button variant="outline" onClick={() => void refreshListings()}>
              Retry
            </Button>
          </Empty>
        ) : results.length ? (
          <div className={searching ? "listing-grid" : "listing-carousel"}>
            {(searching ? results : results.slice(0, 4)).map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <Empty
            title={searching ? "No matching listings" : `No listings in ${university} yet`}
            text={
              searching
                ? "Try clearing your search or switching to All Universities."
                : "Be the first student or seller to post in this campus community."
            }
          >
            {searching ? (
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
              >
                Show all in {university}
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setUniversity("All Universities")}>
                Browse All Universities
              </Button>
            )}
          </Empty>
        )}
      </section>

      {!searching && (
        <>
          <section className="surface-panel section-panel">
            <SectionTitle title="Services on campus">
              <BrowseLink service />
            </SectionTitle>
            {listingsLoading && services.length === 0 ? (
              <div className="listing-grid">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="route-skeleton-card" />
                ))}
              </div>
            ) : services.length ? (
              <div className="listing-carousel">
                {services.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            ) : (
              <Empty title="No services listed yet" text={`Check back soon in ${university}.`} />
            )}
          </section>

          <section className="surface-panel section-panel">
            <SectionTitle title="Under GH₵ 100">
              <Link to="/products" search={{ maxPrice: "100" }} className="text-link">
                See all <ArrowRight size={14} />
              </Link>
            </SectionTitle>
            {listingsLoading && affordable.length === 0 ? (
              <div className="listing-grid">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="route-skeleton-card" />
                ))}
              </div>
            ) : affordable.length ? (
              <div className="listing-carousel">
                {affordable.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            ) : (
              <Empty title="No items under GH₵ 100" text="Try switching to All Universities." />
            )}
          </section>

          <section className="surface-panel section-panel">
            <SectionTitle title="Explore campuses" />
            <div className="campus-grid">
              {featuredCampuses.map((u) => (
                <button
                  type="button"
                  key={u.name}
                  className="campus-card"
                  onClick={() => {
                    setUniversity(u.name);
                    navigate({ to: "/products" });
                  }}
                >
                  <span>
                    <GraduationCap size={19} />
                  </span>
                  <div>
                    <strong>{u.name}</strong>
                    <small>{u.location}</small>
                  </div>
                  <ArrowRight size={15} />
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </Shell>
  );
}

const PAGE_SIZE = 12;

export function BrowsePage({
  type,
  initialCategory,
  initialMaxPrice,
  initialQuery,
}: {
  type: "product" | "service";
  initialCategory?: string | undefined;
  initialMaxPrice?: string | undefined;
  initialQuery?: string | undefined;
}) {
  const {
    listings,
    university,
    setUniversity,
    universityNames,
    productCategoryNames,
    serviceCategoryNames,
    backendConfigured,
    schemaReady,
  } = useCampus();
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery || "");
  const [category, setCategory] = useState(initialCategory || "All");
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice || "any");
  const [sort, setSort] = useState("recent");

  const initialSig = `${university}|${initialQuery || ""}|${type}|${initialCategory || "All"}|${initialMaxPrice || "any"}|recent`;
  const initialCached = browseCache.get(initialSig);
  const [dbResults, setDbResults] = useState<Listing[]>(initialCached?.items ?? []);
  const [dbTotal, setDbTotal] = useState(initialCached?.total ?? 0);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbSearchFailed, setDbSearchFailed] = useState(false);
  const [offset, setOffset] = useState(0);
  const [localVisibleCount, setLocalVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    if (initialCategory !== undefined) setCategory(initialCategory || "All");
  }, [initialCategory]);

  useEffect(() => {
    if (initialMaxPrice !== undefined) setMaxPrice(initialMaxPrice || "any");
  }, [initialMaxPrice]);

  useEffect(() => {
    if (initialQuery !== undefined) setQuery(initialQuery || "");
  }, [initialQuery]);

  const filterSignature = `${university}|${query}|${type}|${category}|${maxPrice}|${sort}`;
  const prevFilterSigRef = useRef<string>(filterSignature);

  useEffect(() => {
    const filterChanged = prevFilterSigRef.current !== filterSignature;
    if (filterChanged) {
      prevFilterSigRef.current = filterSignature;
      setLocalVisibleCount(PAGE_SIZE);
      if (offset !== 0) {
        setOffset(0);
        return;
      }
    }

    if (!backendConfigured || !schemaReady) return;
    let active = true;
    const effectiveOffset = filterChanged ? 0 : offset;
    const cached = effectiveOffset === 0 ? browseCache.get(filterSignature) : undefined;
    if (cached) {
      setDbResults(cached.items);
      setDbTotal(cached.total);
      if (Date.now() - cached.at < BROWSE_FRESH_MS) {
        setDbLoading(false);
        setDbSearchFailed(false);
        return;
      }
    }
    setDbLoading(!cached);
    setDbSearchFailed(false);
    const sortParam =
      sort === "low"
        ? "price_asc"
        : sort === "high"
          ? "price_desc"
          : sort === "popular"
            ? "popular"
            : query.trim()
              ? "relevant"
              : "recent";

    const timer = window.setTimeout(() => {
      void listingService
        .searchListings({
          universityFilter: university === "All Universities" ? null : university,
          listingType: type,
          categoryFilter: category === "All" ? null : category,
          searchQuery: query.trim() || null,
          maxPrice: maxPrice === "any" ? null : Number(maxPrice),
          sort: sortParam,
          limit: PAGE_SIZE,
          offset: effectiveOffset,
        })
        .then(({ items, totalCount }) => {
          if (!active) return;
          setDbResults((prev) => (effectiveOffset === 0 ? items : [...prev, ...items]));
          setDbTotal(totalCount);
          if (effectiveOffset === 0) {
            browseCache.set(filterSignature, { items, total: totalCount, at: Date.now() });
            warmImages(items.map((l) => l.image));
          }
          setDbLoading(false);
        })
        .catch(() => {
          if (!active) return;
          setDbSearchFailed(true);
          setDbLoading(false);
        });
    }, 260);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [
    backendConfigured,
    schemaReady,
    university,
    query,
    type,
    category,
    maxPrice,
    sort,
    offset,
    filterSignature,
  ]);

  const localResults = useMemo(
    () =>
      filterListings(
        listings,
        university,
        query,
        type,
        category,
        maxPrice === "any" ? Infinity : Number(maxPrice),
      )
        .slice()
        .sort((a, b) =>
          sort === "low"
            ? a.price - b.price
            : sort === "high"
              ? b.price - a.price
              : sort === "popular"
                ? b.views - a.views
                : (b.postedAt || 0) - (a.postedAt || 0),
        ),
    [listings, university, query, type, category, maxPrice, sort],
  );

  const usingRemote = backendConfigured && schemaReady && !dbSearchFailed;
  const visibleResults = usingRemote ? dbResults : localResults.slice(0, localVisibleCount);
  const totalCount = usingRemote ? dbTotal : localResults.length;
  const hasMore = usingRemote
    ? dbResults.length < dbTotal
    : localVisibleCount < localResults.length;

  const service = type === "service";
  const categoryList = service ? serviceCategoryNames : productCategoryNames;

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const pool = usingRemote ? dbResults : localResults;
    return pool.slice(0, 5).map((l) => ({ id: l.id, title: l.title, type: l.type }));
  }, [usingRemote, dbResults, localResults, query]);

  return (
    <Shell>
      <PageBackButton fallbackTo="/discover" label="Back" />
      <PageBanner banner={service ? "services" : "products"}>
        <PageIntro
          eyebrow={service ? "Service directory" : "Marketplace catalog"}
          title={service ? "Campus services" : "Campus products"}
          text={
            service
              ? "Photographers, designers, braiders, tutors and technicians around campus."
              : "Laptops, books, hostel essentials, food and everyday student finds."
          }
        />

        <SearchBar
          value={query}
          onChange={setQuery}
          suggestions={suggestions}
          onSelectSuggestion={(s) => navigate({ to: "/listing/$id", params: { id: s.id } })}
          placeholder={
            service ? "Search services or providers..." : "Search products or sellers..."
          }
        />
      </PageBanner>

      <div className="browse-controls">
        <div className="filter-row" role="tablist" aria-label="Categories">
          {["All", ...categoryList].map((c) => (
            <Button
              key={c}
              className="filter-chip"
              aria-pressed={c === category}
              variant={c === category ? "default" : "outline"}
              onClick={() => setCategory(c)}
            >
              {c === "All" ? "All" : c}
            </Button>
          ))}
        </div>

        <div className="filter-toolbar">
          <span className="filter-count">
            {totalCount} {service ? "services" : "products"}
          </span>
          <div className="filter-controls">
            <AnimatedSelect
              variant="filter"
              ariaLabel="Filter by university"
              kicker="Campus filter"
              icon={<MapPin size={13} />}
              value={university}
              onValueChange={setUniversity}
              options={[
                {
                  value: "All Universities",
                  label: "All Universities",
                  description: "Every campus",
                },
                ...universityNames.map((u) => ({ value: u, label: u })),
              ]}
            />
            <AnimatedSelect
              variant="filter"
              ariaLabel="Price range"
              kicker="Budget limit"
              icon={<SlidersHorizontal size={13} />}
              value={maxPrice}
              onValueChange={setMaxPrice}
              options={[
                { value: "any", label: "Any price" },
                { value: "50", label: "Under GH₵50" },
                { value: "100", label: "Under GH₵100" },
                { value: "500", label: "Under GH₵500" },
                { value: "3000", label: "Under GH₵3,000" },
              ]}
            />
            <AnimatedSelect
              variant="filter"
              align="end"
              ariaLabel="Sort listings"
              kicker="Sort order"
              icon={<ArrowUpDown size={13} />}
              value={sort}
              onValueChange={setSort}
              options={[
                { value: "recent", label: "Newest" },
                { value: "low", label: "Price: low to high" },
                { value: "high", label: "Price: high to low" },
                { value: "popular", label: "Most viewed" },
              ]}
            />
          </div>
        </div>
      </div>

      <section className="surface-panel section-panel">
        {visibleResults.length ? (
          <>
            <div className="listing-grid">
              {visibleResults.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  disabled={dbLoading}
                  onClick={() => {
                    if (backendConfigured) {
                      setOffset((prev) => prev + PAGE_SIZE);
                    } else {
                      setLocalVisibleCount((prev) => prev + PAGE_SIZE);
                    }
                  }}
                >
                  {dbLoading ? "Loading more..." : "Load more listings"}
                </Button>
              </div>
            )}
          </>
        ) : dbLoading ? (
          <div className="listing-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="route-skeleton-card" />
            ))}
          </div>
        ) : (
          <Empty>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setCategory("All");
                setMaxPrice("any");
              }}
            >
              Reset filters
            </Button>
          </Empty>
        )}
      </section>
    </Shell>
  );
}
