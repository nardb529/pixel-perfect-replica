import { createFileRoute } from '@tanstack/react-router';
import { DiscoverPage } from '@/components/campus/discovery';
import { pageHead } from '@/lib/campus/meta';
export const Route = createFileRoute('/discover')({ head: () => pageHead('Discover your campus', 'Explore fresh products, talented service providers and affordable finds across Ghanaian campuses.'), component: DiscoverPage });
