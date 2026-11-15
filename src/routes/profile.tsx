import { createFileRoute } from '@tanstack/react-router';
import { ProfilePage } from '@/components/campus/profiles';
import { pageHead } from '@/lib/campus/meta';
export const Route = createFileRoute('/profile')({ head: () => pageHead('Your campus profile', 'Find your saved listings and manage your CampusLoop profile.'), component: ProfilePage });
