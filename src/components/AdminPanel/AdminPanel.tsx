import { useEffect, useState } from "react";
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

interface Order {
  id: number;
  status: string;
  total_price?: number;
  user_id?: number;
  created_at?: string;
}

interface Review {
  id: number;
  product_id?: number;
  user_id?: number;
  rating?: number;
  text?: string;
  comment?: string;
  created_at?: string;
}

interface AdminPanelProps {
  close: () => void;
}

type AdminTab = "products" | "categories" | "users" | "orders" | "reviews";

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

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [newCategoryName, setNewCategoryName] = useState("");

  const [productSearch, setProductSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const getCategoryName = (id: number) => {
    const category = categories.find((item) => item.id === id);
    if (!category) return `ID ${id}`;

    return categoryUaNames[category.name] || category.name;
  };

  const loadProducts = async () => {
    const response = await fetch("/api/admin/products", {
      headers: authHeaders,
    });

    if (!response.ok) {
      alert("Не вдалося завантажити товари");
      return;
    }

    const data = await response.json();
    setProducts(data);
  };

  const loadCategories = async () => {
    const response = await fetch("/api/admin/categories", {
      headers: authHeaders,
    });

    if (!response.ok) {
      alert("Не вдалося завантажити категорії");
      return;
    }

    const data = await response.json();
    setCategories(data);

    if (data.length > 0 && !categoryId) {
      setCategoryId(String(data[0].id));
    }
  };

  const loadUsers = async () => {
    const response = await fetch("/api/admin/users", {
      headers: authHeaders,
    });

    if (!response.ok) {
      alert("Не вдалося завантажити користувачів");
      return;
    }

    const data = await response.json();
    setUsers(data);
  };

  const loadOrders = async () => {
    const response = await fetch("/api/admin/orders", {
      headers: authHeaders,
    });

    if (!response.ok) {
      alert("Не вдалося завантажити замовлення");
      return;
    }

    const data = await response.json();
    setOrders(data);
  };

  const loadReviews = async () => {
    const response = await fetch("/api/admin/reviews", {
      headers: authHeaders,
    });

    if (!response.ok) {
      alert("Не вдалося завантажити відгуки");
      return;
    }

    const data = await response.json();
    setReviews(data);
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadUsers();
    loadOrders();
    loadReviews();
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

  const saveProduct = async () => {
    if (!name.trim()) {
      alert("Введіть назву товару");
      return;
    }

    if (!price) {
      alert("Введіть ціну");
      return;
    }

    if (!categoryId) {
      alert("Оберіть категорію");
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
      ? `/api/admin/products/${editingId}`
      : "/api/admin/products";

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
      alert(data?.detail || "Помилка збереження товару");
      return;
    }

    alert(editingId ? "Товар оновлено" : "Товар додано");
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
      ? `/api/admin/products/${product.id}/deactivate`
      : `/api/admin/products/${product.id}/activate`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: authHeaders,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.log("TOGGLE ERROR:", data);
      alert(data?.detail || "Не вдалося змінити статус товару");
      return;
    }

    alert(product.is_available ? "Товар деактивовано" : "Товар активовано");
    loadProducts();
  };

  const createCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Введіть назву категорії");
      return;
    }

    const response = await fetch("/api/admin/categories", {
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
      alert(data?.detail || "Не вдалося створити категорію");
      return;
    }

    alert("Категорію додано");
    setNewCategoryName("");
    loadCategories();
  };

  const changeOrderStatus = async (orderId: number, status: string) => {
    const response = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({
        status,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.log("ORDER STATUS ERROR:", data);
      alert(data?.detail || "Не вдалося змінити статус замовлення");
      return;
    }

    alert("Статус замовлення змінено");
    loadOrders();
  };

  const deleteReview = async (reviewId: number) => {
    const confirmDelete = confirm("Видалити цей відгук?");
    if (!confirmDelete) return;

    const response = await fetch(`/api/admin/reviews/${reviewId}`, {
      method: "DELETE",
      headers: authHeaders,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.log("DELETE REVIEW ERROR:", data);
      alert(data?.detail || "Не вдалося видалити відгук");
      return;
    }

    alert("Відгук видалено");
    loadReviews();
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((order) =>
    String(order.id).includes(orderSearch)
  );

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
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Користувачі
        </button>

        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Замовлення
        </button>

        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Відгуки
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

      {activeTab === "users" && (
        <div className="admin-card">
          <div className="admin-card-top">
            <h2>Користувачі</h2>

            <input
              className="admin-search"
              placeholder="Пошук по email"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>

          <div className="users-grid">
            {filteredUsers.map((user) => (
              <div className="user-card" key={user.id}>
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
                  <p>
                    Роль: <b>{user.role}</b>
                  </p>
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

            <input
              className="admin-search"
              placeholder="Пошук по ID"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
            />
          </div>

          <div className="admin-table">
            {filteredOrders.map((order) => (
              <div className="admin-table-row order-row" key={order.id}>
                <span>#{order.id}</span>
                <span>Користувач: {order.user_id ?? "-"}</span>
                <span>Сума: {order.total_price ?? 0} ₴</span>

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
            ))}
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="admin-card">
          <h2>Відгуки</h2>

          <div className="reviews-list">
            {reviews.map((review) => (
              <div className="review-card" key={review.id}>
                <div>
                  <b>Відгук #{review.id}</b>
                  <p>Товар ID: {review.product_id ?? "-"}</p>
                  <p>Користувач ID: {review.user_id ?? "-"}</p>
                  <p>Оцінка: {review.rating ?? "-"}</p>
                  <p>{review.text || review.comment || "Без тексту"}</p>
                </div>

                <button onClick={() => deleteReview(review.id)}>
                  Видалити
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;