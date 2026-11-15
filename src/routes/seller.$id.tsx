import { createFileRoute } from '@tanstack/react-router';
import { ProfilePage } from '@/components/campus/profiles';
import { pageHead } from '@/lib/campus/meta';
export const Route = createFileRoute('/seller/$id')({ head: () => pageHead('Campus seller profile', 'Meet a campus seller or service provider and explore their public listings.'), component: Seller });
function Seller() { const { id } = Route.useParams(); return <ProfilePage sellerId={id}/>; }
