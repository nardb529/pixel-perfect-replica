import { createFileRoute } from '@tanstack/react-router';
import { AuthPage } from '@/components/campus/auth';
import { pageHead } from '@/lib/campus/meta';
export const Route = createFileRoute('/auth')({ head: () => pageHead('Join the seller community', 'Preview signing up or logging in to sell products and offer services on CampusLoop.'), component: AuthPage });
