import React, { useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [period, setPeriod] = useState("Last 7 days");

  const chartData = {
    "Last 7 days": {
      labels: ["Apr 25", "Apr 26", "Apr 27", "Apr 28", "Apr 29", "Apr 30", "May 1"],
      points: "0,150 115,120 230,90 345,105 460,65 575,80 700,25",
      circles: [
        [0, 150],
        [115, 120],
        [230, 90],
        [345, 105],
        [460, 65],
        [575, 80],
        [700, 25],
      ],
    },

    "Last 30 days": {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      points: "0,145 230,70 460,120 700,35",
      circles: [
        [0, 145],
        [230, 70],
        [460, 120],
        [700, 35],
      ],
    },

    "Last 3 months": {
      labels: ["March", "April", "May"],
      points: "0,140 350,65 700,20",
      circles: [
        [0, 140],
        [350, 65],
        [700, 20],
      ],
    },
  };

  const currentData = chartData[period];

  return (
    <div className="dashboard-page">

      {/* Heading */}
      <div className="dashboard-heading">
        <h2>Dashboard</h2>
        <p>
          Welcome back, Admin! Here's what's happening with your store today.
        </p>
      </div>

      {/* ================= STATS ================= */}

      <div className="stats-grid">

        <div className="stat-card sales-card">
          <div className="stat-top">
            <div className="stat-icon">💲</div>
            <div className="mini-line">〰</div>
          </div>

          <p>Total Sales</p>
          <h3>$24,580</h3>
          <span>↑ 12% from last month</span>
        </div>

        <div className="stat-card orders-card">
          <div className="stat-top">
            <div className="stat-icon">🛒</div>
            <div className="mini-line">〰</div>
          </div>

          <p>Total Orders</p>
          <h3>1,248</h3>
          <span>↑ 8% from last month</span>
        </div>

        <div className="stat-card customers-card">
          <div className="stat-top">
            <div className="stat-icon">👥</div>
            <div className="mini-line">〰</div>
          </div>

          <p>Customers</p>
          <h3>3,642</h3>
          <span>↑ 15% from last month</span>
        </div>

        <div className="stat-card products-card">
          <div className="stat-top">
            <div className="stat-icon">📦</div>
            <div className="mini-line">〰</div>
          </div>

          <p>Products</p>
          <h3>856</h3>
          <span>↑ 6% from last month</span>
        </div>

      </div>

      {/* ================= MIDDLE ROW ================= */}

      <div className="dashboard-middle">

        {/* Sales Overview */}

        <div className="dashboard-section sales-overview">

          <div className="section-header">
            <div>
              <h3>Sales Overview</h3>
              <p>Total sales for {period.toLowerCase()}</p>
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
              <span>20K</span>
              <span>15K</span>
              <span>10K</span>
              <span>5K</span>
              <span>0</span>
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

                {currentData.circles.map(([cx, cy], index) => (
                  <circle
                    key={index}
                    cx={cx}
                    cy={cy}
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

            <div className="category-y">
              <span>400</span>
              <span>300</span>
              <span>200</span>
              <span>100</span>
              <span>0</span>
            </div>

            <div className="bars-area">

              <div className="bar-wrapper">
                <div className="bar-value">320</div>
                <div className="bar electronics"></div>
                <span>Electronics</span>
              </div>

              <div className="bar-wrapper">
                <div className="bar-value">245</div>
                <div className="bar fashion"></div>
                <span>Fashion</span>
              </div>

              <div className="bar-wrapper">
                <div className="bar home"></div>
                <span className="bar-value">180</span>
                <span>Home & Living</span>
              </div>

              <div className="bar-wrapper">
                <div className="bar sports"></div>
                <span className="bar-value">120</span>
                <span>Sports</span>
              </div>

            </div>

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

            <button>
              <div className="quick-icon purple">＋</div>
              <span>Add Product</span>
              <b>›</b>
            </button>

            <button>
              <div className="quick-icon green">🛒</div>
              <span>View Orders</span>
              <b>›</b>
            </button>

            <button>
              <div className="quick-icon blue">👥</div>
              <span>Manage Customers</span>
              <b>›</b>
            </button>

            <button>
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

            <button className="view-all-btn">
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

            <div className="order-row">
              <span>#1001</span>
              <span>Sarah Khan</span>
              <span>Wireless Headphones</span>
              <span className="status delivered">Delivered</span>
              <span>May 1, 2025</span>
              <span>$199.00</span>
            </div>

            <div className="order-row">
              <span>#1002</span>
              <span>Ali Raza</span>
              <span>Smart Watch</span>
              <span className="status processing">Processing</span>
              <span>Apr 30, 2025</span>
              <span>$249.00</span>
            </div>

            <div className="order-row">
              <span>#1003</span>
              <span>Ayesha Malik</span>
              <span>Running Shoes</span>
              <span className="status shipped">Shipped</span>
              <span>Apr 29, 2025</span>
              <span>$129.00</span>
            </div>

            <div className="order-row">
              <span>#1004</span>
              <span>Usman Tariq</span>
              <span>Backpack</span>
              <span className="status delivered">Delivered</span>
              <span>Apr 28, 2025</span>
              <span>$89.00</span>
            </div>

            <div className="order-row">
              <span>#1005</span>
              <span>Fatima Noor</span>
              <span>Laptop Bag</span>
              <span className="status pending">Pending</span>
              <span>Apr 27, 2025</span>
              <span>$59.00</span>
            </div>

          </div>

        </div>

        {/* Top Products */}

        <div className="dashboard-section top-products">

          <div className="section-header">
            <div>
              <h3>Top Products</h3>
              <p>Best selling products</p>
            </div>

            <button className="view-all-btn">
              View all →
            </button>
          </div>

          <div className="product-list">

            <div className="product-item">
              <div className="product-image">🎧</div>

              <div className="product-info">
                <strong>Wireless Headphones</strong>
                <span>$199.00 · 245 sold</span>
              </div>

              <div className="product-rank">1</div>
            </div>

            <div className="product-item">
              <div className="product-image">⌚</div>

              <div className="product-info">
                <strong>Smart Watch</strong>
                <span>$249.00 · 198 sold</span>
              </div>

              <div className="product-rank">2</div>
            </div>

            <div className="product-item">
              <div className="product-image">👟</div>

              <div className="product-info">
                <strong>Running Shoes</strong>
                <span>$129.00 · 176 sold</span>
              </div>

              <div className="product-rank">3</div>
            </div>

            <div className="product-item">
              <div className="product-image">🎒</div>

              <div className="product-info">
                <strong>Backpack</strong>
                <span>$89.00 · 142 sold</span>
              </div>

              <div className="product-rank">4</div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;