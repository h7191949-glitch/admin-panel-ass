import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import { API_BASE_URL } from "../../config/api";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
});

const DATE_FORMATTER = new Intl.DateTimeFormat("en-PK", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

async function fetchCollection(resource, signal) {
  const response = await fetch(`${API_BASE_URL}/api/${resource}`, {
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not load ${resource} (${response.status})`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error(`Unexpected ${resource} response`);
  }

  return data;
}

function getDayStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDayKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatOrderStatus(status) {
  return String(status || "Unknown");
}

function Dashboard({ onNavigate }) {
  const [period, setPeriod] = useState("Last 7 days");
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    products: [],
    customers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let requestInProgress = false;
    let refreshTimer;
    let controller;

    const refreshDashboard = async () => {
      if (!active || requestInProgress || document.hidden) return;

      requestInProgress = true;
      controller = new AbortController();

      try {
        const [orders, products, customers] = await Promise.all([
          fetchCollection("orders", controller.signal),
          fetchCollection("products", controller.signal),
          fetchCollection("customers", controller.signal),
        ]);
        if (active) {
          setDashboardData({ orders, products, customers });
          setError("");
        }
      } catch (loadError) {
        if (active && loadError.name !== "AbortError") {
          console.error("Dashboard data error:", loadError);
          setError("Dashboard data could not be refreshed. Please try again.");
        }
      } finally {
        requestInProgress = false;
        if (active) {
          setLoading(false);
          refreshTimer = window.setTimeout(refreshDashboard, 30_000);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        window.clearTimeout(refreshTimer);
        refreshDashboard();
      }
    };

    refreshDashboard();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      window.clearTimeout(refreshTimer);
      controller?.abort();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const { orders, products, customers } = dashboardData;
  const validOrders = useMemo(
    () => orders.filter((order) => {
      const status = String(order.status || "").toLowerCase();
      return status !== "cancelled" && status !== "canceled";
    }),
    [orders]
  );
  const totalSales = validOrders.reduce(
    (total, order) => total + (Number(order.totalAmount) || 0),
    0
  );

  const currentData = useMemo(() => {
    const today = getDayStart(new Date());
    let buckets;
    let startDate;

    if (period === "Last 7 days") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);
      buckets = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);
        return {
          key: getDayKey(date),
          label: new Intl.DateTimeFormat("en", {
            month: "short",
            day: "numeric",
          }).format(date),
        };
      });
    } else if (period === "Last 30 days") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 29);
      buckets = Array.from({ length: 5 }, (_, index) => {
        const bucketStart = new Date(startDate);
        bucketStart.setDate(startDate.getDate() + index * 6);
        const bucketEnd = new Date(bucketStart);
        bucketEnd.setDate(bucketStart.getDate() + 5);
        if (bucketEnd > today) bucketEnd.setTime(today.getTime());
        return {
          key: index,
          start: bucketStart,
          end: bucketEnd,
          label: `${bucketStart.getDate()}–${bucketEnd.getDate()}`,
        };
      });
    } else {
      startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
      buckets = Array.from({ length: 3 }, (_, index) => {
        const date = new Date(today.getFullYear(), today.getMonth() - 2 + index, 1);
        return {
          key: `${date.getFullYear()}-${date.getMonth()}`,
          label: new Intl.DateTimeFormat("en", { month: "short" }).format(date),
        };
      });
    }

    const totals = new Array(buckets.length).fill(0);
    validOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      if (Number.isNaN(orderDate.getTime()) || orderDate < startDate) return;

      let bucketIndex;
      if (period === "Last 7 days") {
        bucketIndex = buckets.findIndex((bucket) => bucket.key === getDayKey(orderDate));
      } else if (period === "Last 30 days") {
        const daysSinceStart = Math.floor(
          (getDayStart(orderDate) - startDate) / (24 * 60 * 60 * 1000)
        );
        bucketIndex = Math.min(Math.floor(daysSinceStart / 6), buckets.length - 1);
      } else {
        bucketIndex = buckets.findIndex(
          (bucket) => bucket.key === `${orderDate.getFullYear()}-${orderDate.getMonth()}`
        );
      }

      if (bucketIndex >= 0) {
        totals[bucketIndex] += Number(order.totalAmount) || 0;
      }
    });

    const maxTotal = Math.max(...totals, 0);
    const scaleMax = maxTotal || 1;
    const coordinates = totals.map((amount, index) => ({
      x: buckets.length === 1 ? 350 : index * (700 / (buckets.length - 1)),
      y: 175 - (amount / scaleMax) * 155,
    }));

    return {
      labels: buckets.map((bucket) => bucket.label),
      totals,
      points: coordinates.map(({ x, y }) => `${x},${y}`).join(" "),
      circles: coordinates,
      axis: [1, 0.75, 0.5, 0.25, 0].map((fraction) =>
        formatCompactNumber(scaleMax * fraction)
      ),
    };
  }, [period, validOrders]);

  const categorySales = useMemo(() => {
    const productCategories = new Map(
      products.map((product) => [
        String(product.name || "").trim().toLowerCase(),
        product.category || "Other",
      ])
    );
    const totals = new Map();

    validOrders.forEach((order) => {
      (Array.isArray(order.products) ? order.products : []).forEach((item) => {
        const category =
          productCategories.get(String(item.name || "").trim().toLowerCase()) ||
          "Other";
        totals.set(
          category,
          (totals.get(category) || 0) + (Number(item.quantity) || 1)
        );
      });
    });

    return [...totals.entries()]
      .map(([category, quantity]) => ({ category, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 4);
  }, [products, validOrders]);

  const topProducts = useMemo(() => {
    const sold = new Map();
    validOrders.forEach((order) => {
      (Array.isArray(order.products) ? order.products : []).forEach((item) => {
        const name = String(item.name || "Unknown product");
        const current = sold.get(name) || { name, quantity: 0 };
        current.quantity += Number(item.quantity) || 1;
        sold.set(name, current);
      });
    });

    return [...sold.values()]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 4);
  }, [validOrders]);
  const categoryMax = Math.max(...categorySales.map(({ quantity }) => quantity), 0);

  const recentOrders = useMemo(
    () => [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5),
    [orders]
  );

  return (
    <div className="dashboard-page">

      {/* Heading */}
      <div className="dashboard-heading">
        <h2>Dashboard</h2>
        <p>
          Welcome back, Admin! Here's what's happening with your store today.
        </p>
      </div>

      {error && <p className="dashboard-data-error" role="alert">{error}</p>}

      {/* ================= STATS ================= */}

      <div className="stats-grid">

        <div className="stat-card sales-card">
          <div className="stat-top">
            <div className="stat-icon">💲</div>
            <div className="mini-line">〰</div>
          </div>

          <p>Total Sales</p>
          <h3>
            {loading ? "Loading..." : error ? "—" : CURRENCY_FORMATTER.format(totalSales)}
          </h3>
          <span>Excludes cancelled orders</span>
        </div>

        <div className="stat-card orders-card">
          <div className="stat-top">
            <div className="stat-icon">🛒</div>
            <div className="mini-line">〰</div>
          </div>

          <p>Total Orders</p>
          <h3>{loading ? "Loading..." : error ? "—" : orders.length.toLocaleString()}</h3>
          <span>Orders in store</span>
        </div>

        <div className="stat-card customers-card">
          <div className="stat-top">
            <div className="stat-icon">👥</div>
            <div className="mini-line">〰</div>
          </div>

          <p>Customers</p>
          <h3>{loading ? "Loading..." : error ? "—" : customers.length.toLocaleString()}</h3>
          <span>Registered customers</span>
        </div>

        <div className="stat-card products-card">
          <div className="stat-top">
            <div className="stat-icon">📦</div>
            <div className="mini-line">〰</div>
          </div>

          <p>Products</p>
          <h3>{loading ? "Loading..." : error ? "—" : products.length.toLocaleString()}</h3>
          <span>Products in catalog</span>
        </div>

      </div>

      {/* ================= MIDDLE ROW ================= */}

      <div className="dashboard-middle">

        {/* Sales Overview */}

        <div className="dashboard-section sales-overview">

          <div className="section-header">
            <div>
              <h3>Sales Overview</h3>
              <p>Recorded revenue for {period.toLowerCase()}</p>
            </div>

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>

          <div className="sales-chart">

            <div className="chart-values">
              {currentData.axis.map((value, index) => (
                <span key={index}>{value}</span>
              ))}
            </div>

            <div className="chart-area">

              <div className="chart-grid"></div>

              <svg
                className="sales-svg"
                viewBox="0 0 700 200"
                preserveAspectRatio="none"
              >
                <polyline
                  points={currentData.points}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="4"
                />

                {currentData.circles.map(({ x, y }, index) => (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="5"
                    fill="#6366f1"
                  />
                ))}
              </svg>

              <div className="chart-labels">
                {currentData.labels.map((label, index) => (
                  <span key={index}>{label}</span>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* Orders By Category */}

        <div className="dashboard-section category-section">

          <div className="section-header">
            <div>
              <h3>Orders by Category</h3>
              <p>Orders distribution</p>
            </div>
          </div>

          <div className="category-chart">

            {categorySales.length ? (
              <>
                <div className="category-y">
                  {[1, 0.75, 0.5, 0.25, 0].map((fraction, index) => (
                    <span key={index}>
                      {formatCompactNumber(categoryMax * fraction)}
                    </span>
                  ))}
                </div>

                <div className="bars-area">
                  {categorySales.map(({ category, quantity }, index) => (
                    <div className="bar-wrapper" key={category}>
                      <div className="bar-value">{quantity}</div>
                      <div
                        className="bar"
                        style={{
                          height: `${Math.max((quantity / categoryMax) * 125, 20)}px`,
                          background: ["#4d7ff0", "#45b88d", "#f3aa3c", "#7950d9"][index],
                        }}
                      />
                      <span title={category}>{category}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="dashboard-empty-chart">
                {loading
                  ? "Loading category data..."
                  : error
                    ? "Category data unavailable."
                    : "No ordered products yet."}
              </p>
            )}

          </div>

        </div>

        {/* Quick Actions */}

        <div className="dashboard-section quick-section">

          <div className="section-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Manage your store</p>
            </div>
          </div>

          <div className="quick-actions">

            <button type="button" onClick={() => onNavigate("/products?action=add")}>
              <div className="quick-icon purple">＋</div>
              <span>Add Product</span>
              <b>›</b>
            </button>

            <button type="button" onClick={() => onNavigate("/orders")}>
              <div className="quick-icon green">🛒</div>
              <span>View Orders</span>
              <b>›</b>
            </button>

            <button type="button" onClick={() => onNavigate("/customers")}>
              <div className="quick-icon blue">👥</div>
              <span>Manage Customers</span>
              <b>›</b>
            </button>

            <button type="button" onClick={() => onNavigate("/settings")}>
              <div className="quick-icon gray">⚙</div>
              <span>Settings</span>
              <b>›</b>
            </button>

          </div>

        </div>

      </div>

      {/* ================= BOTTOM ROW ================= */}

      <div className="dashboard-bottom">

        {/* Recent Orders */}

        <div className="dashboard-section recent-orders">

          <div className="section-header">
            <div>
              <h3>Recent Orders</h3>
              <p>Latest orders from your store</p>
            </div>

            <button
              className="view-all-btn"
              type="button"
              onClick={() => onNavigate("/orders")}
            >
              View all →
            </button>
          </div>

          <div className="orders-table">

            <div className="order-row order-header">
              <span>Order ID</span>
              <span>Customer</span>
              <span>Product</span>
              <span>Status</span>
              <span>Date</span>
              <span>Total</span>
            </div>

            {recentOrders.map((order) => {
              const id = String(order._id || order.id || "");
              const status = formatOrderStatus(order.status);
              const statusClass = status.toLowerCase().replaceAll(" ", "-");
              const items = Array.isArray(order.products) ? order.products : [];
              const productNames = items
                .map((item) => item.name)
                .filter(Boolean)
                .join(", ") || "—";
              const createdAt = new Date(order.createdAt);

              return (
                <div className="order-row" key={id}>
                  <span>#{id.slice(-6).toUpperCase() || "—"}</span>
                  <span>{order.customerName || "—"}</span>
                  <span title={productNames}>{productNames}</span>
                  <span className={`status ${statusClass}`}>{status}</span>
                  <span>
                    {Number.isNaN(createdAt.getTime())
                      ? "—"
                      : DATE_FORMATTER.format(createdAt)}
                  </span>
                  <span>{CURRENCY_FORMATTER.format(Number(order.totalAmount) || 0)}</span>
                </div>
              );
            })}
            {!loading && !error && recentOrders.length === 0 && (
              <p className="dashboard-empty-table">No orders found.</p>
            )}
            {loading && <p className="dashboard-empty-table">Loading orders...</p>}

          </div>

        </div>

        {/* Top Products */}

        <div className="dashboard-section top-products">

          <div className="section-header">
            <div>
              <h3>Top Products</h3>
              <p>Best selling products</p>
            </div>

            <button
              className="view-all-btn"
              type="button"
              onClick={() => onNavigate("/products")}
            >
              View all →
            </button>
          </div>

          <div className="product-list">

            {topProducts.map((item, index) => {
              const product = products.find(
                (entry) =>
                  String(entry.name || "").trim().toLowerCase() ===
                  item.name.trim().toLowerCase()
              );

              return (
                <div className="product-item" key={item.name}>
                  <div className="product-image">
                    {product?.image?.startsWith("http") ? (
                      <img src={product.image} alt="" />
                    ) : (
                      "📦"
                    )}
                  </div>
                  <div className="product-info">
                    <strong>{item.name}</strong>
                    <span>{item.quantity} sold</span>
                  </div>
                  <div className="product-rank">{index + 1}</div>
                </div>
              );
            })}
            {!loading && !error && topProducts.length === 0 && (
              <p className="dashboard-empty-table">No sales recorded yet.</p>
            )}
            {loading && <p className="dashboard-empty-table">Loading products...</p>}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;