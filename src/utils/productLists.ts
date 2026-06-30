import { authUrl, catalogUrl } from "../config";
import { showNotification } from "./notifications";

export const FAVORITES_STORAGE_KEY = "favorite_products";
export const COMPARE_STORAGE_KEY = "compare_products";
export const PRODUCTS_LIST_CHANGED_EVENT = "product-lists-changed";

export interface StoredProduct {
  id: number;
  name?: string;
  title?: string;
  image_url?: string | null;
  image?: string | null;
  imageUrl?: string | null;
  price: number;
  oldPrice?: number | null;
  rating?: number;
  reviewsCount?: number;
  bonuses?: number;
  description?: string | null;
  stock?: number;
  is_available?: boolean;
  isAvailable?: boolean;
  category_id?: number;
  categoryId?: number;
}

interface CartItem {
  id: number;
  product_id?: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const readList = (storageKey: string): StoredProduct[] => {
  try {
    const saved = localStorage.getItem(storageKey);
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("PRODUCT LIST READ ERROR:", error);
    return [];
  }
};

const saveList = (storageKey: string, products: StoredProduct[]) => {
  localStorage.setItem(storageKey, JSON.stringify(products));
  window.dispatchEvent(new Event(PRODUCTS_LIST_CHANGED_EVENT));
};

const getToken = () => {
  return localStorage.getItem("access_token") || localStorage.getItem("token");
};

const authHeaders = (): Record<string, string> => {
  const token = getToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const getErrorMessage = (data: any, fallback: string) => {
  if (typeof data?.detail === "string") return data.detail;

  if (Array.isArray(data?.detail)) {
    return data.detail.map((item: any) => item?.msg || "Помилка").join(". ");
  }

  return fallback;
};

export const getStoredProducts = (storageKey: string) => {
  return readList(storageKey);
};

export const normalizeProduct = (product: StoredProduct): StoredProduct => {
  const productTitle = product.name || product.title || "Без назви";
  const productImage = product.image_url || product.image || product.imageUrl || "";

  return {
    ...product,
    id: Number(product.id),
    name: productTitle,
    title: productTitle,
    image_url: productImage,
    image: productImage,
    imageUrl: productImage,
    price: Number(product.price || 0),
    rating: Number(product.rating || 0),
    reviewsCount: Number(product.reviewsCount || 0),
    bonuses: Number(product.bonuses || 0),
  };
};

export const isProductInList = (storageKey: string, productId: number) => {
  return readList(storageKey).some(
    (item) => Number(item.id) === Number(productId)
  );
};

export const addProductToList = (
  storageKey: string,
  product: StoredProduct
) => {
  const list = readList(storageKey);
  const normalizedProduct = normalizeProduct(product);

  if (list.some((item) => Number(item.id) === Number(normalizedProduct.id))) {
    return false;
  }

  saveList(storageKey, [normalizedProduct, ...list]);
  return true;
};

export const removeProductFromList = (
  storageKey: string,
  productId: number
) => {
  const list = readList(storageKey);
  const nextList = list.filter(
    (item) => Number(item.id) !== Number(productId)
  );

  saveList(storageKey, nextList);
};

export const toggleProductInList = (
  storageKey: string,
  product: StoredProduct
) => {
  if (isProductInList(storageKey, product.id)) {
    removeProductFromList(storageKey, product.id);
    return false;
  }

  addProductToList(storageKey, product);
  return true;
};

export const getProductTitle = (product: StoredProduct) => {
  return product.name || product.title || "Без назви";
};

export const getProductImage = (product: StoredProduct) => {
  return product.image_url || product.image || product.imageUrl || "";
};

export const formatProductPrice = (price: number) => {
  return Number(price || 0).toLocaleString("uk-UA");
};

export const loadFavoriteProducts = async () => {
  const token = getToken();

  if (!token) {
    saveList(FAVORITES_STORAGE_KEY, []);
    return [];
  }

  try {
    const response = await fetch(catalogUrl("/client/favorites"), {
      headers: authHeaders(),
    });

    if (!response.ok) {
      if (response.status === 403) {
        saveList(FAVORITES_STORAGE_KEY, []);
        return [];
      }

      const data = await response.json().catch(() => null);
      console.warn("LOAD FAVORITES ERROR:", data);
      return readList(FAVORITES_STORAGE_KEY);
    }

    const data = await response.json();
    const products = Array.isArray(data)
      ? data.map((product) => normalizeProduct(product))
      : [];

    saveList(FAVORITES_STORAGE_KEY, products);
    return products;
  } catch (error) {
    console.error("LOAD FAVORITES ERROR:", error);
    return readList(FAVORITES_STORAGE_KEY);
  }
};

export const toggleFavoriteProduct = async (product: StoredProduct) => {
  const token = getToken();

  if (!token) {
    showNotification("Спочатку увійдіть в акаунт", "warning");
    return isProductInList(FAVORITES_STORAGE_KEY, product.id);
  }

  const isAlreadyFavorite = isProductInList(FAVORITES_STORAGE_KEY, product.id);
  const url = catalogUrl(`/client/favorites/${product.id}`);

  try {
    const response = await fetch(url, {
      method: isAlreadyFavorite ? "DELETE" : "POST",
      headers: authHeaders(),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      showNotification(
        getErrorMessage(data, "Не вдалося змінити обране"),
        "error"
      );
      return isAlreadyFavorite;
    }

    if (isAlreadyFavorite) {
      removeProductFromList(FAVORITES_STORAGE_KEY, product.id);
      showNotification("Товар прибрано з обраного", "info");
      return false;
    }

    addProductToList(FAVORITES_STORAGE_KEY, data || product);
    showNotification("Товар додано в обране", "success");
    return true;
  } catch (error) {
    console.error("TOGGLE FAVORITE ERROR:", error);
    showNotification("Не вдалося зʼєднатися з бекендом", "error");
    return isAlreadyFavorite;
  }
};

export const removeFavoriteProduct = async (productId: number) => {
  const token = getToken();

  if (!token) {
    removeProductFromList(FAVORITES_STORAGE_KEY, productId);
    return;
  }

  try {
    const response = await fetch(catalogUrl(`/client/favorites/${productId}`), {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (!response.ok && response.status !== 404) {
      const data = await response.json().catch(() => null);
      showNotification(
        getErrorMessage(data, "Не вдалося видалити з обраного"),
        "error"
      );
      return;
    }

    removeProductFromList(FAVORITES_STORAGE_KEY, productId);
    showNotification("Товар прибрано з обраного", "info");
  } catch (error) {
    console.error("REMOVE FAVORITE ERROR:", error);
    showNotification("Не вдалося зʼєднатися з бекендом", "error");
  }
};

const checkCanAddToCart = async (product: StoredProduct) => {
  const token = getToken();

  if (!token) {
    showNotification("Спочатку увійдіть в акаунт", "warning");
    return false;
  }

  try {
    const response = await fetch(authUrl("/auth/me"), {
      headers: authHeaders(),
    });

    if (!response.ok) {
      showNotification(
        "Сесія закінчилась. Вийдіть і зайдіть заново.",
        "error"
      );
      return false;
    }

    const user = await response.json();
    const role = String(user.role || "").toLowerCase();

    if (role === "admin" || role === "userrole.admin") {
      showNotification("Адмін не може додавати товари в кошик", "warning");
      return false;
    }
  } catch (error) {
    console.error("CHECK USER ERROR:", error);
    showNotification("Не вдалося перевірити користувача", "error");
    return false;
  }

  if (product.is_available === false || product.isAvailable === false) {
    showNotification("Цього товару немає в наявності", "warning");
    return false;
  }

  return true;
};

export const addProductToCart = async (product: StoredProduct) => {
  const normalizedProduct = normalizeProduct(product);
  const canAdd = await checkCanAddToCart(normalizedProduct);

  if (!canAdd) return false;

  const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
  const productTitle = getProductTitle(normalizedProduct);
  const productImage = getProductImage(normalizedProduct);
  const existingProduct = cart.find(
    (item) => Number(item.id) === Number(normalizedProduct.id)
  );

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: normalizedProduct.id,
      product_id: normalizedProduct.id,
      title: productTitle,
      price: normalizedProduct.price,
      image: productImage,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showNotification("Товар додано в кошик", "success");
  return true;
};