import { createFileRoute } from '@tanstack/react-router';
import { BrowsePage } from '@/components/campus/discovery';
import { pageHead } from '@/lib/campus/meta';
export const Route = createFileRoute('/services')({ head: () => pageHead('Campus services', 'Discover photographers, designers, tutors and service providers serving university communities in Ghana.'), component: Services });
function Services() { return <BrowsePage type="service"/>; }
