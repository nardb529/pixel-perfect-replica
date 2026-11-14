import { createContext, useContext, useState, type ReactNode } from 'react';
import { initialListings, type Listing } from '@/lib/campus/data';
export type DemoUser = { name: string; email: string; university: string; capability: string; bio: string; contact: string };
type Store = { university: string; setUniversity: (v: string) => void; user: DemoUser | null; setUser: (v: DemoUser | null) => void; listings: Listing[]; setListings: React.Dispatch<React.SetStateAction<Listing[]>>; saved: string[]; toggleSave: (id: string) => void; liked: string[]; toggleLike: (id: string) => void };
const CampusContext = createContext<Store | null>(null);
export function CampusProvider({ children }: { children: ReactNode }) {
 const [university, setUniversity] = useState('KNUST');
 const [user, setUser] = useState<DemoUser | null>(null);
 const [listings, setListings] = useState(initialListings);
 const [saved, setSaved] = useState<string[]>([]);
 const [liked, setLiked] = useState<string[]>([]);
 const toggleSave = (id: string) => setSaved(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
 const toggleLike = (id: string) => setLiked(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
 return <CampusContext.Provider value={{ university, setUniversity, user, setUser, listings, setListings, saved, toggleSave, liked, toggleLike }}>{children}</CampusContext.Provider>;
}
export function useCampus() { const value = useContext(CampusContext); if (!value) throw new Error('CampusProvider is required'); return value; }
