import React, { useState } from "react";
import "./Products.css";

function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      description: "Premium sound quality",
      category: "Electronics",
      price: 199,
      stock: 245,
      image: "🎧",
    },
    {
      id: 2,
      name: "Smart Watch",
      description: "Fitness & health tracking",
      category: "Electronics",
      price: 249,
      stock: 198,
      image: "⌚",
    },
    {
      id: 3,
      name: "Running Shoes",
      description: "Comfort & performance",
      category: "Fashion",
      price: 129,
      stock: 176,
      image: "👟",
    },
    {
      id: 4,
      name: "Backpack",
      description: "Durable & stylish",
      category: "Bags",
      price: 89,
      stock: 142,
      image: "🎒",
    },
    {
      id: 5,
      name: "Laptop",
      description: "High performance laptop",
      category: "Electronics",
      price: 899,
      stock: 76,
      image: "💻",
    },
    {
      id: 6,
      name: "Office Chair",
      description: "Ergonomic design",
      category: "Furniture",
      price: 149,
      stock: 0,
      image: "🪑",
    },
    {
      id: 7,
      name: "Classic Watch",
      description: "Elegant & timeless",
      category: "Accessories",
      price: 79,
      stock: 320,
      image: "⌚",
    },
    {
      id: 8,
      name: "T-Shirt",
      description: "Premium cotton",
      category: "Fashion",
      price: 29,
      stock: 189,
      image: "👕",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Electronics",
    price: "",
    stock: "",
    image: "📦",
  });

  /* =====================================
     FORM INPUT
  ===================================== */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =====================================
     OPEN ADD MODAL
  ===================================== */

  const openAddModal = () => {
    setEditingProduct(null);

    setFormData({
      name: "",
      description: "",
      category: "Electronics",
      price: "",
      stock: "",
      image: "📦",
    });

    setShowModal(true);
  };

  /* =====================================
     OPEN EDIT MODAL
  ===================================== */

  const openEditModal = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
    });

    setShowModal(true);
  };

  /* =====================================
     CLOSE MODAL
  ===================================== */

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  /* =====================================
     ADD / UPDATE PRODUCT
  ===================================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || formData.stock === "") {
      alert("Please fill in product name, price and stock.");
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description || "New product",
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      image: formData.image || "📦",
    };

    if (editingProduct) {
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                ...productData,
              }
            : product
        )
      );
    } else {
      const newProduct = {
        id: Date.now(),
        ...productData,
      };

      setProducts([newProduct, ...products]);
    }

    closeModal();
  };

  /* =====================================
     DELETE PRODUCT
  ===================================== */

  const deleteProduct = (id) => {
    const product = products.find((item) => item.id === id);

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (confirmDelete) {
      setProducts(products.filter((item) => item.id !== id));
    }
  };

  /* =====================================
     PRODUCT STATUS
  ===================================== */

  const getStatus = (stock) => {
    if (stock === 0) {
      return "Out of Stock";
    }

    if (stock <= 80) {
      return "Low Stock";
    }

    return "In Stock";
  };

  /* =====================================
     FILTER PRODUCTS
  ===================================== */

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All Categories" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  /* =====================================
     STATS
  ===================================== */

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

  return (
    <div className="products-page">

      {/* =================================
          HEADER
      ================================= */}

      <div className="products-heading">

        <div>
          <h2>Products</h2>

          <p>
            Manage your store products, add new items and track inventory.
          </p>
        </div>

        <button
          className="add-product-btn"
          onClick={openAddModal}
        >
          <span>＋</span>
          Add Product
        </button>

      </div>

      {/* =================================
          STATS
      ================================= */}

      <div className="product-stats">

        <div className="product-stat-card blue-card">

          <div className="product-stat-icon">
            📦
          </div>

          <div>
            <p>Total Products</p>
            <h3>{totalProducts}</h3>
            <span>Current products</span>
          </div>

        </div>

        <div className="product-stat-card green-card">

          <div className="product-stat-icon">
            ✓
          </div>

          <div>
            <p>In Stock</p>
            <h3>{inStock}</h3>
            <span>Available products</span>
          </div>

        </div>

        <div className="product-stat-card orange-card">

          <div className="product-stat-icon">
            !
          </div>

          <div>
            <p>Low Stock</p>
            <h3>{lowStock}</h3>
            <span>Need attention</span>
          </div>

        </div>

        <div className="product-stat-card red-card">

          <div className="product-stat-icon">
            ×
          </div>

          <div>
            <p>Out of Stock</p>
            <h3>{outOfStock}</h3>
            <span>Currently unavailable</span>
          </div>

        </div>

      </div>

      {/* =================================
          PRODUCTS CONTAINER
      ================================= */}

      <div className="products-container">

        <div className="products-top">

          <div>
            <h3>All Products</h3>

            <p>
              Browse and manage all your products.
            </p>
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

        {/* =================================
            TABLE
        ================================= */}

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
                  <div
                    className="product-row"
                    key={product.id}
                  >

                    <span className="checkbox">
                      □
                    </span>

                    <div className="product-thumb">
                      {product.image}
                    </div>

                    <div className="product-name">

                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        {product.description}
                      </span>

                    </div>

                    <span>
                      <span
                        className={`category-tag ${product.category.toLowerCase()}`}
                      >
                        {product.category}
                      </span>
                    </span>

                    <strong className="product-price">
                      ${product.price.toFixed(2)}
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
                        onClick={() =>
                          openEditModal(product)
                        }
                        title="Edit Product"
                      >
                        ✎
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteProduct(product.id)
                        }
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

        {/* =================================
            FOOTER
        ================================= */}

        <div className="products-footer">

          <span>
            Showing {filteredProducts.length} of {products.length} products
          </span>

          <div className="pagination">

            <button>←</button>

            <button className="active-page">
              1
            </button>

            <button>2</button>

            <button>3</button>

            <button>→</button>

          </div>

        </div>

      </div>

      {/* =================================
          ADD / EDIT MODAL
      ================================= */}

      {showModal && (

        <div
          className="modal-overlay"
          onClick={closeModal}
        >

          <div
            className="product-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>
                <h3>
                  {editingProduct
                    ? "Edit Product"
                    : "Add New Product"}
                </h3>

                <p>
                  {editingProduct
                    ? "Update product information."
                    : "Enter information for your new product."}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-group">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                />

              </div>

              <div className="form-group">

                <label>
                  Description
                </label>

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

                  <label>
                    Category
                  </label>

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

                  <label>
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    placeholder="0"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    placeholder="0"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>
                    Icon
                  </label>

                  <select
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                  >
                    <option>📦</option>
                    <option>🎧</option>
                    <option>⌚</option>
                    <option>👟</option>
                    <option>🎒</option>
                    <option>💻</option>
                    <option>🪑</option>
                    <option>👕</option>
                  </select>

                </div>

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-product-btn"
                >
                  {editingProduct
                    ? "Update Product"
                    : "Add Product"}
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