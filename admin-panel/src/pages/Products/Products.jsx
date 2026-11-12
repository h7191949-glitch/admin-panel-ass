
import { useEffect, useState } from "react";
import "./Products.css";
import { API_BASE_URL } from "../../config/api";

const API_URL = `${API_BASE_URL}/api/products`;

async function loadProducts() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Products fetch failed");

  const data = await response.json();
  return data.map((product) => ({
    ...product,
    id: product._id,
  }));
}

function Products({ openAddOnMount = false }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [products, setProducts] = useState([]);

  const [showModal, setShowModal] = useState(openAddOnMount);
  const [editingProduct, setEditingProduct] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Electronics",
    price: "",
    stock: "",
  });

  useEffect(() => {
    let cancelled = false;

    loadProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        if (!cancelled) alert("Products load nahi ho sake. Backend check karo.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setProducts(await loadProducts());
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Products load nahi ho sake. Backend check karo.");
    }
  };

  // FORM INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // IMAGE SELECT
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size 5MB se kam honi chahiye.");
      e.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // RESET IMAGE PREVIEW
  const resetImage = () => {
    setSelectedImage(null);
    setImagePreview("");
  };

  // OPEN ADD MODAL
  const openAddModal = () => {
    setEditingProduct(null);

    setFormData({
      name: "",
      description: "",
      category: "Electronics",
      price: "",
      stock: "",
    });

    resetImage();
    setShowModal(true);
  };

  useEffect(() => {
    if (openAddOnMount) {
      window.history.replaceState(null, "", "/products");
    }
  }, [openAddOnMount]);

  // OPEN EDIT MODAL
  const openEditModal = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "Electronics",
      price: product.price ?? "",
      stock: product.stock ?? "",
    });

    setSelectedImage(null);
    setImagePreview(product.image || "");
    setShowModal(true);
  };

  // CLOSE MODAL
  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    resetImage();
  };

  // ADD / UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      formData.price === "" ||
      formData.stock === ""
    ) {
      alert("Please fill in product name, price and stock.");
      return;
    }

    const productData = new FormData();

    productData.append("name", formData.name);
    productData.append(
      "description",
      formData.description || "New product"
    );
    productData.append("category", formData.category);
    productData.append("price", Number(formData.price));
    productData.append("stock", Number(formData.stock));

    if (selectedImage) {
      productData.append("image", selectedImage);
    }

    try {
      const response = await fetch(
        editingProduct
          ? `${API_URL}/${editingProduct.id}`
          : API_URL,
        {
          method: editingProduct ? "PUT" : "POST",
          body: productData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Product save failed");
      }

      await fetchProducts();
      closeModal();

      alert(
        editingProduct
          ? "Product updated successfully!"
          : "Product added successfully!"
      );
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.message || "Product save nahi hua. Backend check karo.");
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Product delete failed");
      }

      await fetchProducts();
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error.message || "Product delete nahi hua. Backend check karo.");
    }
  };

  // PRODUCT STATUS
  const getStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 80) return "Low Stock";
    return "In Stock";
  };

  // FILTER PRODUCTS
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      (product.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (product.description || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All Categories" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  // STATS
  const totalProducts = products.length;

  const inStock = products.filter(
    (product) => product.stock > 80
  ).length;

  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= 80
  ).length;

  const outOfStock = products.filter(
    (product) => product.stock === 0
  ).length;

  // IMAGE DISPLAY
  const isImageUrl = (image) =>
    typeof image === "string" &&
    (image.startsWith("http://") || image.startsWith("https://"));

  return (
    <div className="products-page">

      <div className="products-heading">
        <div>
          <h2>Products</h2>
          <p>
            Manage your store products, add new items and track inventory.
          </p>
        </div>

        <button className="add-product-btn" onClick={openAddModal}>
          <span>＋</span>
          Add Product
        </button>
      </div>

      {/* STATS */}
      <div className="product-stats">

        <div className="product-stat-card blue-card">
          <div className="product-stat-icon">📦</div>
          <div>
            <p>Total Products</p>
            <h3>{totalProducts}</h3>
            <span>Current products</span>
          </div>
        </div>

        <div className="product-stat-card green-card">
          <div className="product-stat-icon">✓</div>
          <div>
            <p>In Stock</p>
            <h3>{inStock}</h3>
            <span>Available products</span>
          </div>
        </div>

        <div className="product-stat-card orange-card">
          <div className="product-stat-icon">!</div>
          <div>
            <p>Low Stock</p>
            <h3>{lowStock}</h3>
            <span>Need attention</span>
          </div>
        </div>

        <div className="product-stat-card red-card">
          <div className="product-stat-icon">×</div>
          <div>
            <p>Out of Stock</p>
            <h3>{outOfStock}</h3>
            <span>Currently unavailable</span>
          </div>
        </div>

      </div>

      {/* PRODUCTS CONTAINER */}
      <div className="products-container">

        <div className="products-top">
          <div>
            <h3>All Products</h3>
            <p>Browse and manage all your products.</p>
          </div>

          <div className="product-filters">
            <div className="product-search">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Bags</option>
              <option>Furniture</option>
              <option>Accessories</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="products-table-wrapper">
          <div className="products-table">

            <div className="product-row product-table-header">
              <span>□</span>
              <span>Image</span>
              <span>Product Name</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const status = getStatus(product.stock);

                return (
                  <div className="product-row" key={product.id}>

                    <span className="checkbox">□</span>

                    <div className="product-thumb">
                      {isImageUrl(product.image) ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        product.image || "📦"
                      )}
                    </div>

                    <div className="product-name">
                      <strong>{product.name}</strong>
                      <span>{product.description}</span>
                    </div>

                    <span>
                      <span
                        className={`category-tag ${(product.category || "")
                          .toLowerCase()}`}
                      >
                        {product.category}
                      </span>
                    </span>

                    <strong className="product-price">
                      ${Number(product.price || 0).toFixed(2)}
                    </strong>

                    <span className="product-stock">
                      {product.stock}
                    </span>

                    <span>
                      <span
                        className={`stock-status ${status
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {status}
                      </span>
                    </span>

                    <div className="product-actions">
                      <button
                        className="edit-btn"
                        onClick={() => openEditModal(product)}
                        title="Edit Product"
                      >
                        ✎
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteProduct(product.id)}
                        title="Delete Product"
                      >
                        🗑
                      </button>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="no-products">
                No products found.
              </div>
            )}

          </div>
        </div>

        {/* FOOTER */}
        <div className="products-footer">
          <span>
            Showing {filteredProducts.length} of {products.length} products
          </span>

          <div className="pagination">
            <button>←</button>
            <button className="active-page">1</button>
            <button>2</button>
            <button>3</button>
            <button>→</button>
          </div>
        </div>

      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>

          <div
            className="product-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">
              <div>
                <h3>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>

                <p>
                  {editingProduct
                    ? "Update product information."
                    : "Enter information for your new product."}
                </p>
              </div>

              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option>Electronics</option>
                    <option>Fashion</option>
                    <option>Bags</option>
                    <option>Furniture</option>
                    <option>Accessories</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="0"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="0"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

              </div>

              {imagePreview && (
                <div
                  className="form-group"
                  style={{ marginTop: "12px" }}
                >
                  <label>Image Preview</label>

                  {isImageUrl(imagePreview) || imagePreview.startsWith("blob:") ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      style={{
                        width: "110px",
                        height: "110px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "35px" }}>
                      {imagePreview}
                    </span>
                  )}
                </div>
              )}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="save-product-btn">
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Products;