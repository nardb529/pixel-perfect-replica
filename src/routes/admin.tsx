import { createFileRoute } from '@tanstack/react-router';
import { AdminPage } from '@/components/campus/admin';
import { pageHead } from '@/lib/campus/meta';
export const Route = createFileRoute('/admin')({ head: () => pageHead('Community admin preview', 'Explore the separate frontend moderation and campus management preview.'), component: AdminPage });
