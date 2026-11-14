import { createFileRoute } from '@tanstack/react-router';
import { DetailPage } from '@/components/campus/details';
import { pageHead } from '@/lib/campus/meta';
import { initialListings } from '@/lib/campus/data';
export const Route = createFileRoute('/listing/$id')({ head: ({ params }) => pageHead(initialListings.find(l => l.id === params.id)?.title || 'Campus listing', 'Explore listing details and connect directly with a seller or service provider in your campus community.'), component: ListingDetail });
function ListingDetail() { const { id } = Route.useParams(); return <DetailPage id={id}/>; }
