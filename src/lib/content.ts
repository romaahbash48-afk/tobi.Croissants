import rawContent from "@/data/bakery-content.json";

export type ProductCategory = "sweet" | "savory" | "coffee";
export type FilterCategory = "all" | ProductCategory;
export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface SeoContent {
  title: string;
  description: string;
  keywords: string[];
}

export interface BrandContent {
  name: string;
  district: string;
  badge: string;
  title: string;
  subtitle: string;
}

export interface NavigationItem {
  id: string;
  label: string;
}

export interface CtaContent {
  menu: string;
  order: string;
  contacts: string;
}

export interface HeroImage {
  url: string;
  alt: string;
}

export interface CategoryItem {
  id: FilterCategory;
  label: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  alt: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  alt: string;
  caption: string;
  instagramUrl: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  text: string;
  source: string;
}

export interface ContactContent {
  address: string;
  phone: string;
  whatsApp: string;
  email: string;
}

export interface OpeningHoursItem {
  id: Weekday;
  label: string;
  open: string | null;
  close: string | null;
}

export interface BakeryContent {
  seo: SeoContent;
  brand: BrandContent;
  navigation: NavigationItem[];
  cta: CtaContent;
  heroImages: HeroImage[];
  categories: CategoryItem[];
  products: Product[];
  gallery: GalleryItem[];
  reviews: ReviewItem[];
  contact: ContactContent;
  openingHours: OpeningHoursItem[];
}

export const bakeryContent = rawContent as BakeryContent;
