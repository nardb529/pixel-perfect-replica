import { createFileRoute } from '@tanstack/react-router';
import { PostPage } from '@/components/campus/management';
import { pageHead } from '@/lib/campus/meta';
export const Route = createFileRoute('/post')({ head: () => pageHead('Share a product or service', 'Create and preview a campus product or service listing.'), component: PostPage });
