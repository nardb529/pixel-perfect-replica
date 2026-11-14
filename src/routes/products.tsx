import { createFileRoute } from '@tanstack/react-router';
import { BrowsePage } from '@/components/campus/discovery';
import { pageHead } from '@/lib/campus/meta';
export const Route = createFileRoute('/products')({ head: () => pageHead('Campus products', 'Find electronics, fashion, books and hostel essentials from your Ghanaian university community.'), component: Products });
function Products() { return <BrowsePage type="product"/>; }
