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

interface AdminPanelProps {
  close: () => void;
}

const AdminPanel = ({ close }: AdminPanelProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("1");

  const token = localStorage.getItem("token");

  const loadProducts = async () => {
    const response = await fetch("/api/admin/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      alert("Не вдалося завантажити товари");
      return;
    }

    const data = await response.json();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const clearForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setStock("1");
    setImageUrl("");
    setCategoryId("1");
  };

  const saveProduct = async () => {
    const body = {
      name: name,
      description: description,
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
        Authorization: `Bearer ${token}`,
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

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleProduct = async (product: Product) => {
    const url = product.is_available
      ? `/api/admin/products/${product.id}/deactivate`
      : `/api/admin/products/${product.id}/activate`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  return (
    <div className="admin-panel">
      <h1>Адмін-панель</h1>
      <button
  className="admin-close-btn"
  onClick={close}
>
  ✕
</button>

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

        <input
          placeholder="ID категорії"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        />

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
        <h2>Товари</h2>

        <div className="admin-products">
          {products.map((product) => (
            <div className="admin-product" key={product.id}>
              <img src={product.image_url || ""} alt={product.name} />

              <div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <b>{product.price} ₴</b>
                <p>Склад: {product.stock}</p>

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
    </div>
  );
};

export default AdminPanel;