-- CampusLoop Seed Data: Ghanaian Universities, Categories & Initial Promotion Configs
-- Migration: 202611160003_seed_universities_categories.sql

insert into public.universities (university_name, short_name, slug, location, region, description, display_order, is_active)
values
  ('Kwame Nkrumah University of Science and Technology', 'KNUST', 'knust', 'Kumasi', 'Ashanti', 'Premier science and technology university community in Kumasi.', 1, true),
  ('University of Ghana', 'University of Ghana', 'ug-legon', 'Legon, Accra', 'Greater Accra', 'Ghana’s oldest public university campus at Legon and Korle-Bu.', 2, true),
  ('University of Cape Coast', 'University of Cape Coast', 'ucc', 'Cape Coast', 'Central', 'Coastal university hub serving student communities in Cape Coast.', 3, true),
  ('University of Professional Studies, Accra', 'UPSA', 'upsa', 'Madina, Accra', 'Greater Accra', 'Business and professional studies campus in Madina, Accra.', 4, true),
  ('University of Education, Winneba', 'UEW', 'uew', 'Winneba', 'Central', 'Teacher education and multi-campus community in Winneba.', 5, true),
  ('University for Development Studies', 'UDS', 'uds', 'Tamale / Nyankpala', 'Northern', 'Development-oriented multi-campus network across Northern Ghana.', 6, true),
  ('University of Mines and Technology', 'UMaT', 'umat', 'Tarkwa', 'Western', 'Engineering and mining campus community in Tarkwa.', 7, true),
  ('University of Energy and Natural Resources', 'UENR', 'uenr', 'Sunyani', 'Bono', 'Energy, science and natural resources university in Sunyani.', 8, true),
  ('Ghana Communication Technology University', 'GCTU', 'gctu', 'Tesano, Accra', 'Greater Accra', 'ICT and telecommunications campus in Tesano, Accra.', 9, true),
  ('University of Health and Allied Sciences', 'UHAS', 'uhas', 'Ho', 'Volta', 'Health sciences university community in Ho and Hohoe.', 10, true),
  ('University of Environment and Sustainable Development', 'UESD', 'uesd', 'Somanya', 'Eastern', 'Sustainability and environmental studies campus in Somanya.', 11, true),
  ('Ghana Institute of Management and Public Administration', 'GIMPA', 'gimpa', 'Greenhill, Accra', 'Greater Accra', 'Management, governance and law university at Greenhill.', 12, true),
  ('Accra Technical University', 'ATU', 'atu', 'Tudu, Accra', 'Greater Accra', 'Applied science, engineering and business campus in central Accra.', 13, true),
  ('Kumasi Technical University', 'KsTU', 'kstu', 'Kumasi', 'Ashanti', 'Technical and vocational innovation hub in Kumasi.', 14, true),
  ('Takoradi Technical University', 'TTU', 'ttu', 'Takoradi', 'Western', 'Applied engineering, art and design university in Sekondi-Takoradi.', 15, true),
  ('Other Accredited Institutions', 'Other institutions', 'other-institutions', 'Nationwide', 'Ghana', 'Accredited colleges, polytechnics and private university campuses across Ghana.', 99, true)
on conflict (slug) do update set
  university_name = excluded.university_name,
  short_name = excluded.short_name,
  location = excluded.location,
  region = excluded.region,
  display_order = excluded.display_order;

-- Product Categories
insert into public.categories (name, slug, category_type, icon, description, display_order, is_active)
values
  ('Electronics', 'electronics', 'product', 'smartphone', 'Laptops, phones, headphones, chargers and campus tech.', 1, true),
  ('Fashion', 'fashion', 'product', 'shopping-bag', 'Sneakers, apparel, campus merch and footwear.', 2, true),
  ('Books & Academics', 'books-and-academics', 'product', 'graduation-cap', 'Textbooks, lab manuals, past questions and calculators.', 3, true),
  ('Food & Groceries', 'food-and-groceries', 'product', 'coffee', 'Prepared meals, snacks, provisions and hostel groceries.', 4, true),
  ('Beauty', 'beauty', 'product', 'sparkles', 'Skincare, hair products, fragrances and personal care.', 5, true),
  ('Hostel Essentials', 'hostel-essentials', 'product', 'sofa', 'Kettles, lamps, fans, bedding and room organizers.', 6, true),
  ('Sports', 'sports', 'product', 'dumbbell', 'Jerseys, boots, fitness accessories and campus sports gear.', 7, true),
  ('Accessories', 'accessories', 'product', 'watch', 'Bags, watches, laptop sleeves, glasses and everyday carry.', 8, true),
  ('Home and Living', 'home-and-living', 'product', 'home', 'Decor, cookware, storage boxes and apartment essentials.', 9, true),
  ('Others', 'product-others', 'product', 'layout-grid', 'Additional campus products and student finds.', 99, true)
on conflict (slug) do update set
  name = excluded.name,
  display_order = excluded.display_order;

-- Service Categories
insert into public.categories (name, slug, category_type, icon, description, display_order, is_active)
values
  ('Graphic Design', 'graphic-design', 'service', 'palette', 'Flyers, branding, slide decks and social media creatives.', 1, true),
  ('Photography', 'photography', 'service', 'camera', 'Portraits, graduation shoots, events and media coverage.', 2, true),
  ('Hair & Beauty', 'hair-and-beauty', 'service', 'scissors', 'Braiding, barbering, makeup and nail care around hostels.', 3, true),
  ('Technology & Repairs', 'technology-and-repairs', 'service', 'cpu', 'Laptop diagnostics, phone screen repairs and OS setup.', 4, true),
  ('Tutoring', 'tutoring', 'service', 'book-open', 'One-on-one coaching, course revision and coding help.', 5, true),
  ('Laundry', 'laundry', 'service', 'shirt', 'Hostel pickup, wash, press and folded laundry service.', 6, true),
  ('Printing', 'printing', 'service', 'printer', 'Assignment printing, binding and project hardcover binding.', 7, true),
  ('Food Services', 'food-services', 'service', 'utensils', 'Catering, meal prep and event refreshment boxes.', 8, true),
  ('Transport', 'transport', 'service', 'car', 'Campus errands, luggage moving and shuttle rides.', 9, true),
  ('Cleaning', 'cleaning', 'service', 'spray-can', 'Hostel room deep cleaning and move-in prep.', 10, true),
  ('Events', 'events', 'service', 'calendar', 'MCing, DJing, decor setup and hall week planning.', 11, true),
  ('Others', 'service-others', 'service', 'briefcase', 'Other student-led and campus community services.', 99, true)
on conflict (slug) do update set
  name = excluded.name,
  display_order = excluded.display_order;

-- Future Monetization Slots Prep (Disabled by default, zero payment gateways)
insert into public.promotion_configs (plan_key, name, description, target_scope, duration_days, suggested_fee_ghs, is_active)
values
  ('featured-listing-7d', 'Featured Campus Listing (7 days)', 'Highlight an approved product or service at the top of campus feeds.', 'listing', 7, 25.00, false),
  ('promoted-service-14d', 'Promoted Campus Service (14 days)', 'Boost visibility for student service providers across targeted universities.', 'service', 14, 40.00, false),
  ('campus-spotlight-30d', 'University Spotlight Slot (30 days)', 'Future sponsored campus announcement slot managed by administrators.', 'banner', 30, 150.00, false)
on conflict (plan_key) do nothing;

notify pgrst, 'reload schema';
