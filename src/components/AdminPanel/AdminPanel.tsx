import { useEffect, useState } from "react";
import { BASE_URL } from "../../config";
import { showConfirm, showNotification } from "../../utils/notifications";
import {
  fileToDataUrl,
  getSiteBanners,
  getSitePromotions,
  saveSiteBanners,
  saveSitePromotions,
  saveCatalogBannerToBackend,
  uploadAdminImage,
  type BannerPosition,
  type SiteBanner,
  type SitePromotion,
} from "../../utils/siteContent";
import "./AdminPanel.css";

interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  image_url?: string | null;
  category_id: number;
  is_available: boolean;
}

interface Category {
  id: number;
  name: string;
}

interface User {
  id: number;
  email: string;
  role: string;
  image_url?: string | null;
}

interface OrderItem {
  id?: number;
  product_id?: number;
  product_name?: string;
  name?: string;
  title?: string;
  quantity?: number;
  price?: number;
  unit_price?: number;
  product?: {
    name?: string;
    title?: string;
    price?: number;
  };
}

interface Order {
  id: number;
  status: string;
  total_price?: number;
  total_amount?: number;
  user_id?: number;
  user_email?: string;
  email?: string;
  contact_email?: string;
  customer_email?: string;
  delivery_email?: string;
  shipping_email?: string;
  created_at?: string;
  user?: {
    id?: number;
    email?: string;
  };
  items?: OrderItem[];
  order_items?: OrderItem[];
  products?: OrderItem[];
}

interface Review {
  id: number;
  product_id?: number;
  user_id?: number;
  user_email?: string;
  rating?: number;
  text?: string;
  comment?: string;
  admin_reply?: string;
  admin_response?: string;
  admin_response_created_at?: string;
  answer?: string;
  created_at?: string;
}

interface ContactRequest {
  id: number;
  type: "call" | "mail";
  name?: string;
  email?: string;
  phone?: string;
  phone_number?: string;
  message?: string;
  created_at?: string;
  is_processed?: boolean;
  read?: boolean;
}

interface AdminPanelProps {
  close: () => void;
}

type AdminTab =
  | "products"
  | "categories"
  | "promotions"
  | "users"
  | "orders"
  | "reviews"
  | "contacts";
type ContactTab = "calls" | "mail";
type PromoManagerTab = "banners" | "promotions";

const categoryUaNames: Record<string, string> = {
  laptops: "Ноутбуки",
  tablets: "Планшети",
  motorola: "Смартфони Motorola",
  smartphones: "Смартфони",
  accessories: "Аксесуари",
  monitors: "Монітори",
  monoblocks: "Моноблоки",
  desktops: "Настільні ПК",
  consoles: "Ігрові консолі",
  servers: "Сервери",
};

const AdminPanel = ({ close }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [contactTab, setContactTab] = useState<ContactTab>("calls");
  const [promoManagerTab, setPromoManagerTab] =
    useState<PromoManagerTab>("banners");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);

  const [siteBanners, setSiteBanners] = useState<SiteBanner[]>(() =>
    getSiteBanners()
  );
  const [sitePromotions, setSitePromotions] = useState<SitePromotion[]>(() =>
    getSitePromotions()
  );

  const [readOrderIds, setReadOrderIds] = useState<number[]>(() => {
    const saved = localStorage.getItem("admin_read_order_ids");
    return saved ? JSON.parse(saved) : [];
  });

  const [readUserIds, setReadUserIds] = useState<number[]>(() => {
    const saved = localStorage.getItem("admin_read_user_ids");
    return saved ? JSON.parse(saved) : [];
  });

  const [readReviewIds, setReadReviewIds] = useState<number[]>(() => {
    const saved = localStorage.getItem("admin_read_review_ids");
    return saved ? JSON.parse(saved) : [];
  });

  const [reviewReplies, setReviewReplies] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem("admin_review_replies");
    return saved ? JSON.parse(saved) : {};
  });

  const [reviewReplyDrafts, setReviewReplyDrafts] = useState<
    Record<number, string>
  >(() => {
    const saved = localStorage.getItem("admin_review_replies");
    return saved ? JSON.parse(saved) : {};
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [imageUrl, setImageUrl] = useState("");
  const [isProductImageUploading, setIsProductImageUploading] = useState(false);
  const [categoryId, setCategoryId] = useState("");

  const [newCategoryName, setNewCategoryName] = useState("");

  const [productSearch, setProductSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const getCategoryName = (id: number) => {
    const category = categories.find((item) => item.id === id);
    if (!category) return `ID ${id}`;

    return categoryUaNames[category.name] || category.name;
  };

  const getSavedOrderContactEmail = (orderId: number) => {
    try {
      const saved = localStorage.getItem("order_contact_emails");
      const parsed = saved ? JSON.parse(saved) : {};

      return String(parsed[String(orderId)] || "").trim();
    } catch (error) {
      console.error("GET ORDER CONTACT EMAIL ERROR:", error);
      return "";
    }
  };

  const getOrderEmail = (order: Order) => {
    return (
      order.user_email ||
      order.email ||
      order.user?.email ||
      users.find((user) => user.id === order.user_id)?.email ||
      "-"
    );
  };

  const getOrderContactEmail = (order: Order) => {
    return (
      order.contact_email ||
      order.customer_email ||
      order.delivery_email ||
      order.shipping_email ||
      getSavedOrderContactEmail(order.id) ||
      ""
    );
  };

  const getOrderItems = (order: Order) => {
    return order.items || order.order_items || order.products || [];
  };

  const getOrderItemProductId = (item: OrderItem) => {
    return item.product_id ?? item.id;
  };

  const getOrderItemProductFromList = (item: OrderItem) => {
    const productId = getOrderItemProductId(item);

    if (!productId) return undefined;

    return products.find((product) => product.id === productId);
  };

  const getOrderItemName = (item: OrderItem) => {
    const productFromList = getOrderItemProductFromList(item);

    return (
      item.product_name ||
      item.name ||
      item.title ||
      item.product?.name ||
      item.product?.title ||
      productFromList?.name ||
      `Товар ID ${getOrderItemProductId(item) ?? "-"}`
    );
  };

  const getOrderItemPrice = (item: OrderItem) => {
    const productFromList = getOrderItemProductFromList(item);

    return item.price ?? item.unit_price ?? item.product?.price ?? productFromList?.price;
  };

  const getReviewText = (review: Review) => {
    return review.text || review.comment || "Без тексту";
  };

  const getReviewReply = (review: Review) => {
    return (
      review.admin_response ||
      reviewReplies[review.id] ||
      review.admin_reply ||
      review.answer ||
      ""
    );
  };

  const getReviewProductName = (review: Review) => {
    const product = products.find((item) => item.id === review.product_id);

    return product?.name || `Товар ${review.product_id ?? "-"}`;
  };

  const getReviewUserEmail = (review: Review) => {
    const user = users.find((item) => item.id === review.user_id);

    return review.user_email || user?.email || `Користувач ${review.user_id ?? "-"}`;
  };

  const loadProducts = async () => {
    const response = await fetch(`${BASE_URL}/admin/products`, {
      headers: authHeaders,
    });

    if (!response.ok) {
      showNotification("Не вдалося завантажити товари");
      return;
    }

    const data = await response.json();
    setProducts(data);
  };

  const loadCategories = async () => {
    const response = await fetch(`${BASE_URL}/admin/categories`, {
      headers: authHeaders,
    });

    if (!response.ok) {
      showNotification("Не вдалося завантажити категорії");
      return;
    }

    const data = await response.json();
    setCategories(data);

    if (data.length > 0 && !categoryId) {
      setCategoryId(String(data[0].id));
    }
  };

  const loadUsers = async () => {
    const response = await fetch(`${BASE_URL}/admin/users`, {
      headers: authHeaders,
    });

    if (!response.ok) {
      showNotification("Не вдалося завантажити користувачів");
      return;
    }

    const data = await response.json();
    const usersList: User[] = Array.isArray(data) ? data : [];
    setUsers(usersList);

    const savedReadUserIds = localStorage.getItem("admin_read_user_ids");

    if (savedReadUserIds === null) {
      const currentUserIds = usersList.map((user) => user.id);

      localStorage.setItem(
        "admin_read_user_ids",
        JSON.stringify(currentUserIds)
      );
      setReadUserIds(currentUserIds);
    }
  };

  const loadOrders = async () => {
    const response = await fetch(`${BASE_URL}/admin/orders`, {
      headers: authHeaders,
    });

    if (!response.ok) {
      showNotification("Не вдалося завантажити замовлення");
      return;
    }

    const data = await response.json();

    const savedStatuses = localStorage.getItem("local_order_statuses");
    const statuses = savedStatuses ? JSON.parse(savedStatuses) : {};

    const ordersWithLocalStatuses = data.map((order: Order) => ({
      ...order,
      status: statuses[order.id] || order.status,
    }));

    setOrders(ordersWithLocalStatuses);

    const savedReadOrderIds = localStorage.getItem("admin_read_order_ids");

    if (savedReadOrderIds === null) {
      const currentOrderIds = ordersWithLocalStatuses.map(
        (order: Order) => order.id
      );

      localStorage.setItem(
        "admin_read_order_ids",
        JSON.stringify(currentOrderIds)
      );
      setReadOrderIds(currentOrderIds);
    }
  };

  const loadReviews = async () => {
    const response = await fetch(`${BASE_URL}/admin/reviews`, {
      headers: authHeaders,
    });

    if (!response.ok) {
      showNotification("Не вдалося завантажити відгуки", "error");
      return;
    }

    const data = await response.json();
    const reviewsList: Review[] = Array.isArray(data) ? data : [];
    setReviews(reviewsList);

    const savedReadReviewIds = localStorage.getItem("admin_read_review_ids");

    if (savedReadReviewIds === null) {
      const currentReviewIds = reviewsList.map((review) => review.id);

      localStorage.setItem(
        "admin_read_review_ids",
        JSON.stringify(currentReviewIds)
      );
      setReadReviewIds(currentReviewIds);
    }
  };

  const getReadContactIds = (type: ContactRequest["type"]) => {
    const saved = localStorage.getItem(`admin_read_${type}_ids`);
    return saved ? JSON.parse(saved) : [];
  };

  const loadContacts = async () => {
    try {
      const [messagesResponse, phonesResponse] = await Promise.all([
        fetch(`${BASE_URL}/admin/contact-messages`, { headers: authHeaders }),
        fetch(`${BASE_URL}/admin/phone-requests`, { headers: authHeaders }),
      ]);

      const messagesData = messagesResponse.ok
        ? await messagesResponse.json()
        : [];
      const phonesData = phonesResponse.ok
        ? await phonesResponse.json()
        : [];

      const readMailIds = getReadContactIds("mail");
      const readCallIds = getReadContactIds("call");

      const mailRequests: ContactRequest[] = Array.isArray(messagesData)
        ? messagesData.map((item: any) => ({
            id: Number(item.id),
            type: "mail",
            email: item.email,
            message: item.message,
            created_at: item.created_at,
            is_processed: Boolean(item.is_processed),
            read: Boolean(item.is_processed) || readMailIds.includes(Number(item.id)),
          }))
        : [];

      const callRequests: ContactRequest[] = Array.isArray(phonesData)
        ? phonesData.map((item: any) => ({
            id: Number(item.id),
            type: "call",
            email: item.email,
            phone: item.phone_number,
            phone_number: item.phone_number,
            created_at: item.created_at,
            is_processed: Boolean(item.is_processed),
            read: Boolean(item.is_processed) || readCallIds.includes(Number(item.id)),
          }))
        : [];

      setContactRequests([...callRequests, ...mailRequests]);
    } catch (error) {
      console.error("LOAD CONTACTS ERROR:", error);
      showNotification("Не вдалося завантажити звернення", "error");
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadUsers();
    loadOrders();
    loadReviews();
    loadContacts();
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadUsers();
      loadOrders();
      loadReviews();
      loadContacts();
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, []);

  const clearForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setStock("1");
    setImageUrl("");

    if (categories.length > 0) {
      setCategoryId(String(categories[0].id));
    }
  };


  const uploadProductImage = async (file?: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification("Оберіть саме зображення", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsProductImageUploading(true);

    try {
      const response = await fetch(`${BASE_URL}/admin/uploads/products`, {
        method: "POST",
        headers: authHeaders,
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        showNotification(data?.detail || "Не вдалося завантажити фото товару", "error");
        return;
      }

      setImageUrl(data.image_url || "");
      showNotification("Фото товару завантажено", "success");
    } catch (error) {
      console.error("UPLOAD PRODUCT IMAGE ERROR:", error);
      showNotification("Не вдалося завантажити фото товару", "error");
    } finally {
      setIsProductImageUploading(false);
    }
  };

  const saveProduct = async () => {
    if (!name.trim()) {
      showNotification("Введіть назву товару");
      return;
    }

    if (!price) {
      showNotification("Введіть ціну");
      return;
    }

    if (!categoryId) {
      showNotification("Оберіть категорію");
      return;
    }

    const body = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      image_url: imageUrl,
      category_id: Number(categoryId),
    };

    const url = editingId
      ? `${BASE_URL}/admin/products/${editingId}`
      : `${BASE_URL}/admin/products`;

    const method = editingId ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.log("SAVE ERROR:", data);
      showNotification(data?.detail || "Помилка збереження товару");
      return;
    }

    showNotification(editingId ? "Товар оновлено" : "Товар додано");
    clearForm();
    loadProducts();
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(String(product.price));
    setStock(String(product.stock));
    setImageUrl(product.image_url || "");
    setCategoryId(String(product.category_id));

    setActiveTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleProduct = async (product: Product) => {
    const url = product.is_available
      ? `${BASE_URL}/admin/products/${product.id}/deactivate`
      : `${BASE_URL}/admin/products/${product.id}/activate`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: authHeaders,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.log("TOGGLE ERROR:", data);
      showNotification(data?.detail || "Не вдалося змінити статус товару");
      return;
    }

    showNotification(product.is_available ? "Товар деактивовано" : "Товар активовано");
    loadProducts();
  };

  const createCategory = async () => {
    if (!newCategoryName.trim()) {
      showNotification("Введіть назву категорії");
      return;
    }

    const response = await fetch(`${BASE_URL}/admin/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({
        name: newCategoryName,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.log("CATEGORY ERROR:", data);
      showNotification(data?.detail || "Не вдалося створити категорію");
      return;
    }

    showNotification("Категорію додано");
    setNewCategoryName("");
    loadCategories();
  };

  const changeOrderStatus = async (orderId: number, status: string) => {
    const savedStatuses = localStorage.getItem("local_order_statuses");
    const localStatuses = savedStatuses ? JSON.parse(savedStatuses) : {};

    const currentOrder = orders.find((order) => order.id === orderId);

    const isLocallyPaid =
      currentOrder?.status === "paid" ||
      localStatuses[orderId] === "paid";

    const sendStatus = async (newStatus: string) => {
      return await fetch(`${BASE_URL}/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
    };

    let response: Response;

    if (isLocallyPaid && status !== "paid") {
      const payResponse = await sendStatus("paid");

      if (!payResponse.ok) {
        const payData = await payResponse.json().catch(() => null);
        console.log("ORDER PAY ERROR:", payData);
        showNotification(payData?.detail || "Не вдалося спочатку поставити Оплачене");
        return;
      }

      response = await sendStatus(status);
    } else {
      response = await sendStatus(status);
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.log("ORDER STATUS ERROR:", data);
      showNotification(data?.detail || "Не вдалося змінити статус замовлення");
      return;
    }

    if (localStatuses[orderId]) {
      delete localStatuses[orderId];
      localStorage.setItem(
        "local_order_statuses",
        JSON.stringify(localStatuses)
      );
    }

    showNotification("Статус замовлення змінено");
    loadOrders();
  };

  const deleteReview = async (reviewId: number) => {
    const confirmDelete = await showConfirm(
      "Видалити цей відгук?",
      "Видалення відгуку",
      "Видалити",
      "Скасувати"
    );

    if (!confirmDelete) return;

    const response = await fetch(`${BASE_URL}/admin/reviews/${reviewId}`, {
      method: "DELETE",
      headers: authHeaders,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.log("DELETE REVIEW ERROR:", data);
      showNotification(data?.detail || "Не вдалося видалити відгук");
      return;
    }

    showNotification("Відгук видалено");
    loadReviews();
  };

  const saveReviewReply = async (reviewId: number) => {
    const replyText = (reviewReplyDrafts[reviewId] || "").trim();

    if (!replyText) {
      showNotification("Напишіть відповідь на відгук", "warning");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/admin/reviews/${reviewId}/response`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          admin_response: replyText,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        showNotification(data?.detail || "Не вдалося зберегти відповідь", "error");
        return;
      }

      const newReplies = {
        ...reviewReplies,
        [reviewId]: replyText,
      };

      setReviewReplies(newReplies);
      setReviewReplyDrafts(newReplies);
      localStorage.setItem("admin_review_replies", JSON.stringify(newReplies));
      showNotification("Відповідь адміністратора збережено", "success");
      loadReviews();
    } catch (error) {
      console.error("SAVE REVIEW RESPONSE ERROR:", error);
      showNotification("Не вдалося зберегти відповідь", "error");
    }
  };

  const markOrdersAsRead = () => {
    const orderIds = orders.map((order) => order.id);

    setReadOrderIds(orderIds);
    localStorage.setItem("admin_read_order_ids", JSON.stringify(orderIds));
    showNotification("Замовлення позначено як прочитані", "success");
  };

  const markUsersAsRead = () => {
    const userIds = users.map((user) => user.id);

    setReadUserIds(userIds);
    localStorage.setItem("admin_read_user_ids", JSON.stringify(userIds));
    showNotification("Користувачів позначено як переглянутих", "success");
  };

  const markReviewsAsRead = () => {
    const reviewIds = reviews.map((review) => review.id);

    setReadReviewIds(reviewIds);
    localStorage.setItem("admin_read_review_ids", JSON.stringify(reviewIds));
    showNotification("Відгуки позначено як прочитані", "success");
  };

  const markContactsAsRead = (type: ContactRequest["type"]) => {
    const ids = contactRequests
      .filter((request) => request.type === type)
      .map((request) => request.id);

    const updatedRequests = contactRequests.map((request) =>
      request.type === type ? { ...request, read: true, is_processed: true } : request
    );

    setContactRequests(updatedRequests);
    localStorage.setItem(`admin_read_${type}_ids`, JSON.stringify(ids));
    showNotification(
      type === "call" ? "Дзвінки позначено як прочитані" : "Повідомлення позначено як прочитані",
      "success"
    );
  };

  const persistSiteBanners = (nextBanners: SiteBanner[]) => {
    setSiteBanners(nextBanners);
    saveSiteBanners(nextBanners);
  };

  const persistSitePromotions = (nextPromotions: SitePromotion[]) => {
    setSitePromotions(nextPromotions);
    saveSitePromotions(nextPromotions);
  };

  const updateSiteBanner = <K extends keyof SiteBanner>(
    bannerId: number,
    field: K,
    value: SiteBanner[K]
  ) => {
    persistSiteBanners(
      siteBanners.map((banner) =>
        banner.id === bannerId ? { ...banner, [field]: value } : banner
      )
    );
  };

  const uploadSiteBannerImage = async (
    bannerId: number,
    file?: File | null
  ) => {
    if (!file) return;

    try {
      const image = await uploadAdminImage(file, "/admin/uploads/banners");
      updateSiteBanner(bannerId, "image", image);
      showNotification("Фото банера завантажено", "success");
    } catch (error) {
      console.error("UPLOAD BANNER IMAGE ERROR:", error);
      showNotification(error instanceof Error ? error.message : "Не вдалося завантажити банер", "error");
    }
  };

  const addSiteBanner = (position: BannerPosition) => {
    const newBanner: SiteBanner = {
      id: Date.now(),
      title: position === "top" ? "Новий верхній банер" : "Новий нижній банер",
      image: "",
      position,
      is_active: true,
    };

    persistSiteBanners([newBanner, ...siteBanners]);
    showNotification("Банер додано. Додайте картинку і назву.", "success");
  };

  const deleteSiteBanner = async (bannerId: number) => {
    const confirmDelete = await showConfirm(
      "Видалити цей банер?",
      "Видалення банера",
      "Видалити",
      "Скасувати"
    );

    if (!confirmDelete) return;

    persistSiteBanners(
      siteBanners.filter((banner) => banner.id !== bannerId)
    );
  };

  const saveCatalogBanner = async (banner: SiteBanner) => {
    if (!banner.image.trim()) {
      showNotification("Спочатку додайте картинку банера", "warning");
      return;
    }

    try {
      const savedBanner = await saveCatalogBannerToBackend(banner);

      if (savedBanner) {
        const nextBanners = siteBanners.map((item) =>
          item.id === banner.id ? { ...item, id: savedBanner.id, image: savedBanner.image, title: savedBanner.title } : item
        );
        persistSiteBanners(nextBanners);
      }

      showNotification("Банер збережено на бекенді", "success");
    } catch (error) {
      console.error("SAVE CATALOG BANNER ERROR:", error);
      showNotification(error instanceof Error ? error.message : "Не вдалося зберегти банер", "error");
    }
  };

  const updateSitePromotion = <K extends keyof SitePromotion>(
    promotionId: number,
    field: K,
    value: SitePromotion[K]
  ) => {
    persistSitePromotions(
      sitePromotions.map((promotion) =>
        promotion.id === promotionId
          ? { ...promotion, [field]: value }
          : promotion
      )
    );
  };

  const uploadSitePromotionImage = async (
    promotionId: number,
    file?: File | null
  ) => {
    if (!file) return;

    const image = await fileToDataUrl(file);
    updateSitePromotion(promotionId, "image", image);
  };

  const addSitePromotion = () => {
    const newPromotion: SitePromotion = {
      id: Date.now(),
      title: "Нова акція",
      image: "",
      category: "Ноутбуки",
      type: "Знижка",
      is_active: true,
      is_archive: false,
    };

    persistSitePromotions([newPromotion, ...sitePromotions]);
    showNotification("Акцію додано. Заповніть назву і картинку.", "success");
  };

  const deleteSitePromotion = async (promotionId: number) => {
    const confirmDelete = await showConfirm(
      "Видалити цю акцію?",
      "Видалення акції",
      "Видалити",
      "Скасувати"
    );

    if (!confirmDelete) return;

    persistSitePromotions(
      sitePromotions.filter((promotion) => promotion.id !== promotionId)
    );
  };

  const resetSiteContent = async () => {
    const confirmReset = await showConfirm(
      "Повернути стандартні банери та акції? Ваші зміни в цьому блоці буде прибрано.",
      "Скидання акцій",
      "Скинути",
      "Скасувати"
    );

    if (!confirmReset) return;

    localStorage.removeItem("admin_site_banners");
    localStorage.removeItem("admin_site_promotions");
    setSiteBanners(getSiteBanners());
    setSitePromotions(getSitePromotions());
    showNotification("Стандартні банери та акції повернено", "success");
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((order) => {
    const search = orderSearch.toLowerCase().trim();

    if (!search) return true;

    const orderItemsText = getOrderItems(order)
      .map((item) => getOrderItemName(item).toLowerCase())
      .join(" ");

    return (
      String(order.id).includes(search) ||
      getOrderEmail(order).toLowerCase().includes(search) ||
      getOrderContactEmail(order).toLowerCase().includes(search) ||
      orderItemsText.includes(search)
    );
  });

  const callRequests = contactRequests.filter(
    (request) => request.type === "call"
  );
  const mailRequests = contactRequests.filter(
    (request) => request.type === "mail"
  );

  const unreadUsersCount = users.filter(
    (user) => !readUserIds.includes(user.id)
  ).length;

  const unreadOrdersCount = orders.filter(
    (order) => !readOrderIds.includes(order.id)
  ).length;

  const unreadReviewsCount = reviews.filter(
    (review) => !readReviewIds.includes(review.id)
  ).length;

  const unreadCallsCount = callRequests.filter(
    (request) => !request.read
  ).length;
  const unreadMailCount = mailRequests.filter(
    (request) => !request.read
  ).length;
  const unreadContactsCount = unreadCallsCount + unreadMailCount;

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Адмін-панель</h1>

        <button className="admin-close-btn" onClick={close}>
          ✕
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          Товари
        </button>

        <button
          className={activeTab === "categories" ? "active" : ""}
          onClick={() => setActiveTab("categories")}
        >
          Категорії
        </button>

        <button
          className={activeTab === "promotions" ? "active" : ""}
          onClick={() => setActiveTab("promotions")}
        >
          Акції
        </button>

        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Користувачі
          {unreadUsersCount > 0 && (
            <span className="admin-tab-badge">{unreadUsersCount}</span>
          )}
        </button>

        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Замовлення
          {unreadOrdersCount > 0 && (
            <span className="admin-tab-badge">{unreadOrdersCount}</span>
          )}
        </button>

        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Відгуки
          {unreadReviewsCount > 0 && (
            <span className="admin-tab-badge">{unreadReviewsCount}</span>
          )}
        </button>

        <button
          className={activeTab === "contacts" ? "active" : ""}
          onClick={() => setActiveTab("contacts")}
        >
          Звʼязок
          {unreadContactsCount > 0 && (
            <span className="admin-tab-badge">{unreadContactsCount}</span>
          )}
        </button>
      </div>

      {activeTab === "products" && (
        <>
          <div className="admin-card">
            <h2>{editingId ? "Редагувати товар" : "Додати товар"}</h2>

            <input
              placeholder="Назва товару"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              placeholder="Опис товару"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              placeholder="Ціна"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              placeholder="Кількість на складі"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />

            <input
              placeholder="Посилання на фото"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

            <label className="file-upload-btn admin-product-upload-btn">
              {isProductImageUploading ? "Завантажуємо фото..." : "Завантажити фото товару з компʼютера"}
              <input
                type="file"
                accept="image/*"
                disabled={isProductImageUploading}
                onChange={(e) => uploadProductImage(e.target.files?.[0])}
              />
            </label>

            <select
              className="admin-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryName(category.id)}
                </option>
              ))}
            </select>

            <button onClick={saveProduct}>
              {editingId ? "Зберегти зміни" : "Додати товар"}
            </button>

            {editingId && (
              <button className="cancel-edit-btn" onClick={clearForm}>
                Скасувати
              </button>
            )}
          </div>

          <div className="admin-card">
            <div className="admin-card-top">
              <h2>Товари</h2>

              <input
                className="admin-search"
                placeholder="Пошук товару"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>

            <div className="admin-products">
              {filteredProducts.map((product) => (
                <div className="admin-product" key={product.id}>
                  <img src={product.image_url || ""} alt={product.name} />

                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <b>{product.price} ₴</b>
                    <p>Склад: {product.stock}</p>
                    <p>Категорія: {getCategoryName(product.category_id)}</p>

                    <p>
                      Статус:{" "}
                      {product.is_available ? (
                        <span className="active">Активний</span>
                      ) : (
                        <span className="inactive">Неактивний</span>
                      )}
                    </p>

                    <div className="admin-product-actions">
                      <button onClick={() => startEdit(product)}>
                        Редагувати
                      </button>

                      <button onClick={() => toggleProduct(product)}>
                        {product.is_available ? "Деактивувати" : "Активувати"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === "categories" && (
        <div className="admin-card">
          <h2>Категорії</h2>

          <div className="category-create">
            <input
              placeholder="Назва нової категорії"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />

            <button onClick={createCategory}>Додати категорію</button>
          </div>

          <div className="category-list">
            {categories.map((category) => (
              <div className="category-item" key={category.id}>
                <span>#{category.id}</span>
                <b>{getCategoryName(category.id)}</b>
                <small>{category.name}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "promotions" && (
        <div className="admin-card">
          <div className="admin-card-top">
            <div>
              <h2>Банери та акції</h2>
              <p className="admin-muted-text">
                Банери можна завантажувати на бек через Cloudinary. Акції поки
                зберігаються в браузері, доки для них не дадуть окремий endpoint.
              </p>
            </div>

            <button className="secondary-btn" onClick={resetSiteContent}>
              Скинути стандартні
            </button>
          </div>

          <div className="promo-admin-tabs">
            <button
              className={promoManagerTab === "banners" ? "active" : ""}
              onClick={() => setPromoManagerTab("banners")}
            >
              Банери
            </button>

            <button
              className={promoManagerTab === "promotions" ? "active" : ""}
              onClick={() => setPromoManagerTab("promotions")}
            >
              Акції
            </button>
          </div>

          {promoManagerTab === "banners" && (
            <>
              <div className="promo-admin-actions">
                <button onClick={() => addSiteBanner("top")}>
                  Додати верхній банер
                </button>

                <button onClick={() => addSiteBanner("bottom")}>
                  Додати нижній банер
                </button>
              </div>

              <div className="promo-admin-list">
                {siteBanners.map((banner) => (
                  <div className="promo-admin-item" key={banner.id}>
                    <div className="promo-admin-preview">
                      {banner.image ? (
                        <img src={banner.image} alt={banner.title} />
                      ) : (
                        <span>Немає картинки</span>
                      )}
                    </div>

                    <div className="promo-admin-fields">
                      <input
                        placeholder="Назва банера"
                        value={banner.title}
                        onChange={(e) =>
                          updateSiteBanner(banner.id, "title", e.target.value)
                        }
                      />

                      <textarea
                        placeholder="Посилання на картинку або base64"
                        value={banner.image}
                        onChange={(e) =>
                          updateSiteBanner(banner.id, "image", e.target.value)
                        }
                      />

                      <div className="promo-admin-row">
                        <select
                          className="admin-select"
                          value={banner.position}
                          onChange={(e) =>
                            updateSiteBanner(
                              banner.id,
                              "position",
                              e.target.value as BannerPosition
                            )
                          }
                        >
                          <option value="top">Верхній слайдер</option>
                          <option value="bottom">Нижній слайдер</option>
                        </select>

                        <label className="admin-check-label">
                          <input
                            type="checkbox"
                            checked={banner.is_active}
                            onChange={(e) =>
                              updateSiteBanner(
                                banner.id,
                                "is_active",
                                e.target.checked
                              )
                            }
                          />
                          Активний
                        </label>
                      </div>

                      <div className="promo-admin-actions small-actions">
                        <label className="file-upload-btn">
                          Завантажити з компʼютера
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              uploadSiteBannerImage(
                                banner.id,
                                e.target.files?.[0]
                              )
                            }
                          />
                        </label>

                        <button
                          className="secondary-btn"
                          onClick={() => saveCatalogBanner(banner)}
                        >
                          Зберегти на бек
                        </button>

                        <button
                          className="delete-content-btn"
                          onClick={() => deleteSiteBanner(banner.id)}
                        >
                          Видалити
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {promoManagerTab === "promotions" && (
            <>
              <div className="promo-admin-actions">
                <button onClick={addSitePromotion}>Додати акцію</button>
              </div>

              <div className="promo-admin-list">
                {sitePromotions.map((promotion) => (
                  <div className="promo-admin-item" key={promotion.id}>
                    <div className="promo-admin-preview promotion-preview">
                      {promotion.image ? (
                        <img src={promotion.image} alt={promotion.title} />
                      ) : (
                        <span>Немає картинки</span>
                      )}
                    </div>

                    <div className="promo-admin-fields">
                      <input
                        placeholder="Назва акції"
                        value={promotion.title}
                        onChange={(e) =>
                          updateSitePromotion(
                            promotion.id,
                            "title",
                            e.target.value
                          )
                        }
                      />

                      <textarea
                        placeholder="Посилання на картинку"
                        value={promotion.image}
                        onChange={(e) =>
                          updateSitePromotion(
                            promotion.id,
                            "image",
                            e.target.value
                          )
                        }
                      />

                      <div className="promo-admin-row">
                        <input
                          placeholder="Категорія"
                          value={promotion.category}
                          onChange={(e) =>
                            updateSitePromotion(
                              promotion.id,
                              "category",
                              e.target.value
                            )
                          }
                        />

                        <input
                          placeholder="Тип акції"
                          value={promotion.type}
                          onChange={(e) =>
                            updateSitePromotion(
                              promotion.id,
                              "type",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="promo-admin-row checks-row">
                        <label className="admin-check-label">
                          <input
                            type="checkbox"
                            checked={promotion.is_active}
                            onChange={(e) =>
                              updateSitePromotion(
                                promotion.id,
                                "is_active",
                                e.target.checked
                              )
                            }
                          />
                          Показувати
                        </label>

                        <label className="admin-check-label">
                          <input
                            type="checkbox"
                            checked={promotion.is_archive}
                            onChange={(e) =>
                              updateSitePromotion(
                                promotion.id,
                                "is_archive",
                                e.target.checked
                              )
                            }
                          />
                          Архівна
                        </label>
                      </div>

                      <div className="promo-admin-actions small-actions">
                        <label className="file-upload-btn">
                          Завантажити з компʼютера
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              uploadSitePromotionImage(
                                promotion.id,
                                e.target.files?.[0]
                              )
                            }
                          />
                        </label>

                        <button
                          className="delete-content-btn"
                          onClick={() => deleteSitePromotion(promotion.id)}
                        >
                          Видалити
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "users" && (
        <div className="admin-card">
          <div className="admin-card-top">
            <h2>Користувачі</h2>

            <div className="admin-card-actions">
              {unreadUsersCount > 0 && (
                <button className="read-btn" onClick={markUsersAsRead}>
                  Позначити як переглянуте
                </button>
              )}

              <input
                className="admin-search"
                placeholder="Пошук по email"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="users-grid">
            {filteredUsers.map((user) => (
              <div
                className={
                  readUserIds.includes(user.id)
                    ? "user-card"
                    : "user-card unread-row"
                }
                key={user.id}
              >
                <div className="user-avatar">
                  {user.image_url ? (
                    <img src={user.image_url} alt={user.email} />
                  ) : (
                    <span>{user.email[0]?.toUpperCase()}</span>
                  )}
                </div>

                <div>
                  <h3>{user.email}</h3>
                  <p>ID: {user.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="admin-card">
          <div className="admin-card-top">
            <h2>Замовлення</h2>

            <div className="admin-card-actions">
              {unreadOrdersCount > 0 && (
                <button className="read-btn" onClick={markOrdersAsRead}>
                  Позначити як прочитано
                </button>
              )}

              <input
                className="admin-search"
                placeholder="Пошук по ID або email"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-table">
            {filteredOrders.map((order) => {
              const orderItems = getOrderItems(order);
              const orderEmail = getOrderEmail(order);
              const contactEmail = getOrderContactEmail(order);

              return (
                <div
                  className={
                    readOrderIds.includes(order.id)
                      ? "admin-table-row order-row"
                      : "admin-table-row order-row unread-row"
                  }
                  key={order.id}
                >
                  <span>#{order.id}</span>

                  <div className="order-info">
                    <b>Email акаунта: {orderEmail}</b>
                    {contactEmail && contactEmail !== orderEmail && (
                      <span className="order-contact-email">
                        Email для уточнень: {contactEmail}
                      </span>
                    )}
                    <span>ID користувача: {order.user_id ?? order.user?.id ?? "-"}</span>
                  </div>

                  <div className="order-products">
                    <b>Замовлено:</b>

                    {orderItems.length > 0 ? (
                      <ul>
                        {orderItems.map((item, index) => {
                          const productId = getOrderItemProductId(item);
                          const itemPrice = getOrderItemPrice(item);

                          return (
                            <li key={`${order.id}-${item.id ?? productId ?? index}`}>
                              <b>{getOrderItemName(item)}</b> × {item.quantity ?? 1}
                              {itemPrice !== undefined && ` — ${itemPrice} ₴`}
                              {productId !== undefined && (
                                <small>ID товару: {productId}</small>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <span>Немає даних по товарах</span>
                    )}
                  </div>

                  <span>
                    Сума: {order.total_price ?? order.total_amount ?? 0} ₴
                  </span>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      changeOrderStatus(order.id, e.target.value)
                    }
                  >
                    <option value="created">Створене</option>
                    <option value="paid">Оплачене</option>
                    <option value="shipped">Відправлене</option>
                    <option value="completed">Завершене</option>
                    <option value="cancelled">Скасоване</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="admin-card">
          <div className="admin-card-top">
            <h2>Відгуки</h2>

            {unreadReviewsCount > 0 && (
              <button className="read-btn" onClick={markReviewsAsRead}>
                Позначити як прочитано
              </button>
            )}
          </div>

          <div className="reviews-list">
            {reviews.map((review) => (
              <div
                className={
                  readReviewIds.includes(review.id)
                    ? "review-card"
                    : "review-card unread-row"
                }
                key={review.id}
              >
                <div className="review-content">
                  <b>Відгук #{review.id}</b>
                  <p>Товар: {getReviewProductName(review)}</p>
                  <p>Користувач: {getReviewUserEmail(review)}</p>
                  <p>Оцінка: {review.rating ?? "-"}</p>
                  <p>{getReviewText(review)}</p>

                  {getReviewReply(review) && (
                    <div className="admin-review-reply">
                      <b>Відповідь адміністратора:</b>
                      <p>{getReviewReply(review)}</p>
                    </div>
                  )}

                  <textarea
                    className="review-reply-textarea"
                    placeholder="Написати відповідь користувачу"
                    value={reviewReplyDrafts[review.id] || ""}
                    onChange={(e) =>
                      setReviewReplyDrafts({
                        ...reviewReplyDrafts,
                        [review.id]: e.target.value,
                      })
                    }
                  />

                  <div className="review-actions">
                    <button onClick={() => saveReviewReply(review.id)}>
                      Відповісти
                    </button>
                  </div>
                </div>

                <button
                  className="delete-review-btn"
                  onClick={() => deleteReview(review.id)}
                >
                  Видалити
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "contacts" && (
        <div className="admin-card">
          <div className="admin-card-top">
            <h2>Звʼязок</h2>
          </div>

          <div className="contact-tabs">
            <button
              className={contactTab === "calls" ? "active" : ""}
              onClick={() => setContactTab("calls")}
            >
              Дзвінки
              {unreadCallsCount > 0 && (
                <span className="admin-tab-badge">{unreadCallsCount}</span>
              )}
            </button>

            <button
              className={contactTab === "mail" ? "active" : ""}
              onClick={() => setContactTab("mail")}
            >
              Пошта
              {unreadMailCount > 0 && (
                <span className="admin-tab-badge">{unreadMailCount}</span>
              )}
            </button>
          </div>

          {contactTab === "calls" && (
            <div className="contact-panel">
              <div className="contact-panel-header">
                <h3>Запити на дзвінок</h3>

                {unreadCallsCount > 0 && (
                  <button
                    className="read-btn"
                    onClick={() => markContactsAsRead("call")}
                  >
                    Позначити як прочитано
                  </button>
                )}
              </div>

              {callRequests.length > 0 ? (
                <div className="contact-list">
                  {callRequests.map((request) => (
                    <div
                      className={
                        request.read
                          ? "contact-request"
                          : "contact-request unread-row"
                      }
                      key={request.id}
                    >
                      <b>{request.name || "Клієнт"}</b>
                      <p>Телефон: {request.phone || request.phone_number || "-"}</p>
                      <p>Email: {request.email || "-"}</p>
                      <p>{request.message || "Без повідомлення"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-contact-text">
                  Поки немає даних по дзвінках. Коли бек віддасть запити,
                  вони будуть показуватись тут.
                </p>
              )}
            </div>
          )}

          {contactTab === "mail" && (
            <div className="contact-panel">
              <div className="contact-panel-header">
                <h3>Листи / повідомлення</h3>

                {unreadMailCount > 0 && (
                  <button
                    className="read-btn"
                    onClick={() => markContactsAsRead("mail")}
                  >
                    Позначити як прочитано
                  </button>
                )}
              </div>

              {mailRequests.length > 0 ? (
                <div className="contact-list">
                  {mailRequests.map((request) => (
                    <div
                      className={
                        request.read
                          ? "contact-request"
                          : "contact-request unread-row"
                      }
                      key={request.id}
                    >
                      <b>{request.name || request.email || "Клієнт"}</b>
                      <p>Email: {request.email || "-"}</p>
                      <p>Телефон: {request.phone || request.phone_number || "-"}</p>
                      <p>{request.message || "Без повідомлення"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-contact-text">
                  Поки немає даних по пошті. Коли бек віддасть листи,
                  вони будуть показуватись тут.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;