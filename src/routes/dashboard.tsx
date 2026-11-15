import { createFileRoute } from '@tanstack/react-router';
import { DashboardPage } from '@/components/campus/management';
import { pageHead } from '@/lib/campus/meta';
export const Route = createFileRoute('/dashboard')({ head: () => pageHead('Your seller dashboard', 'Manage your campus listings and see interest in your products and services.'), component: DashboardPage });
