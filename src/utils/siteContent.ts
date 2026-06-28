export const SITE_CONTENT_CHANGED_EVENT = "site-content-changed";
export const SITE_BANNERS_STORAGE_KEY = "admin_site_banners";
export const SITE_PROMOTIONS_STORAGE_KEY = "admin_site_promotions";

export type BannerPosition = "top" | "bottom";

export interface SiteBanner {
  id: number;
  title: string;
  image: string;
  position: BannerPosition;
  is_active: boolean;
  link?: string;
}

export interface SitePromotion {
  id: number;
  title: string;
  image: string;
  category: string;
  type: string;
  is_active: boolean;
  is_archive: boolean;
}

export const defaultSiteBanners: SiteBanner[] = [
  {
    id: 1,
    title: "Купуй ноутбуки за спеціальними цінами",
    image: "/images/1.1.png",
    position: "top",
    is_active: true,
  },
  {
    id: 2,
    title: "Купуй планшет Yoga Tab",
    image: "/images/1.2.png",
    position: "top",
    is_active: true,
  },
  {
    id: 3,
    title: "Motorola на shop.lenovo.ua",
    image: "/images/2.1.png",
    position: "bottom",
    is_active: true,
  },
  {
    id: 4,
    title: "Lenovo Legion",
    image: "/images/2.2.png",
    position: "bottom",
    is_active: true,
  },
  {
    id: 5,
    title: "Lenovo ThinkPad",
    image: "/images/2.3.png",
    position: "bottom",
    is_active: true,
  },
  {
    id: 6,
    title: "Trade-in Lenovo",
    image: "/images/2.4.png",
    position: "bottom",
    is_active: true,
  },
];

export const defaultSitePromotions: SitePromotion[] = [
  {
    id: 1,
    image: "/promotions/promo-tablet.jpg",
    title: "Купуй планшет за спеціальною пропозицією!",
    category: "Планшети",
    type: "Знижка",
    is_active: true,
    is_archive: false,
  },
  {
    id: 2,
    image: "/promotions/promo-keyboard.jpg",
    title: "Купуй Аксесуари за спеціальною пропозицією!",
    category: "Клавіатури",
    type: "Подарунок",
    is_active: true,
    is_archive: false,
  },
];

const readStorageList = <T>(key: string, fallback: T[]): T[] => {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) return fallback;

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.error("SITE CONTENT READ ERROR:", error);
    return fallback;
  }
};

const dispatchContentChanged = () => {
  window.dispatchEvent(new Event(SITE_CONTENT_CHANGED_EVENT));
};

export const getSiteBanners = () => {
  return readStorageList<SiteBanner>(
    SITE_BANNERS_STORAGE_KEY,
    defaultSiteBanners
  );
};

export const saveSiteBanners = (banners: SiteBanner[]) => {
  localStorage.setItem(SITE_BANNERS_STORAGE_KEY, JSON.stringify(banners));
  dispatchContentChanged();
};

export const getActiveSiteBanners = (position: BannerPosition) => {
  const banners = getSiteBanners().filter(
    (banner) => banner.position === position && banner.is_active && banner.image
  );

  const fallback = defaultSiteBanners.filter(
    (banner) => banner.position === position && banner.is_active
  );

  return banners.length > 0 ? banners : fallback;
};

export const getSitePromotions = () => {
  return readStorageList<SitePromotion>(
    SITE_PROMOTIONS_STORAGE_KEY,
    defaultSitePromotions
  );
};

export const saveSitePromotions = (promotions: SitePromotion[]) => {
  localStorage.setItem(
    SITE_PROMOTIONS_STORAGE_KEY,
    JSON.stringify(promotions)
  );
  dispatchContentChanged();
};

export const getVisibleSitePromotions = () => {
  return getSitePromotions().filter((promotion) => promotion.is_active);
};

export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};
import { BASE_URL } from "../config";

const getToken = () => {
  return localStorage.getItem("access_token") || localStorage.getItem("token");
};

const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const backendCatalogBannerToSiteBanner = (banner: any): SiteBanner | null => {
  if (!banner?.image_url) return null;

  return {
    id: Number(banner.id || Date.now()),
    title: banner.title || "Банер каталогу",
    image: banner.image_url,
    position: "top",
    is_active: banner.is_active !== false,
  };
};

export const fetchBackendCatalogBanner = async () => {
  try {
    const response = await fetch(`${BASE_URL}/client/catalog-banner`);

    if (!response.ok) return null;

    const data = await response.json();
    return backendCatalogBannerToSiteBanner(data);
  } catch (error) {
    console.error("FETCH CATALOG BANNER ERROR:", error);
    return null;
  }
};

export const uploadAdminImage = async (
  file: File,
  endpoint: "/admin/uploads/products" | "/admin/uploads/banners"
) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || "Не вдалося завантажити зображення");
  }

  return String(data.image_url || "");
};

export const saveCatalogBannerToBackend = async (banner: SiteBanner) => {
  const response = await fetch(`${BASE_URL}/admin/catalog-banner`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      title: banner.title,
      image_url: banner.image,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || "Не вдалося зберегти банер");
  }

  return backendCatalogBannerToSiteBanner(data);
};
