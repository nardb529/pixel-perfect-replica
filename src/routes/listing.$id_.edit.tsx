import { createFileRoute } from '@tanstack/react-router';
import { PostPage } from '@/components/campus/management';
import { pageHead } from '@/lib/campus/meta';
export const Route = createFileRoute('/listing/$id_/edit')({ head: () => pageHead('Edit your campus listing', 'Update the details of your own CampusLoop product or service.'), component: Edit });
function Edit() { const { id } = Route.useParams(); return <PostPage editId={id}/>; }
