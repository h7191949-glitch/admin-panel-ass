import React from "react";
import "./CustomerStats.css";

function CustomerStats({ customers }) {
  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) => customer.status === "Inactive"
  ).length;

  const newCustomers = 32;

  return (
    <div className="customer-stats">

      <div className="customer-stat-card total-customer">
        <div className="customer-stat-icon">
          👥
        </div>

        <div className="customer-stat-info">
          <p>Total Customers</p>
          <h3>{totalCustomers}</h3>
          <span>↗ 12% vs last month</span>
        </div>
      </div>

      <div className="customer-stat-card active-customer">
        <div className="customer-stat-icon">
          ✓
        </div>

        <div className="customer-stat-info">
          <p>Active Customers</p>
          <h3>{activeCustomers}</h3>
          <span>↗ 10% vs last month</span>
        </div>
      </div>

      <div className="customer-stat-card new-customer">
        <div className="customer-stat-icon">
          👤
        </div>

        <div className="customer-stat-info">
          <p>New Customers</p>
          <h3>{newCustomers}</h3>
          <span>↗ 28% vs last month</span>
        </div>
      </div>

      <div className="customer-stat-card inactive-customer">
        <div className="customer-stat-icon">
          ×
        </div>

        <div className="customer-stat-info">
          <p>Inactive Customers</p>
          <h3>{inactiveCustomers}</h3>
          <span>↘ 6% vs last month</span>
        </div>
      </div>

    </div>
  );
}

export default CustomerStats;