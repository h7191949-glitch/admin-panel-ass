import React from "react";
import "./RecentCustomers.css";

function RecentCustomers({ customers }) {
  const recentCustomers = customers.slice(0, 4);

  return (
    <div className="recent-customers-card">

      <div className="recent-customers-header">
        <h3>Recent Customers</h3>
        <button>View All →</button>
      </div>

      <div className="recent-customers-list">
        {recentCustomers.map((customer) => (
          <div
            className="recent-customer-item"
            key={customer.id}
          >
            <div className="recent-customer-avatar">
              {customer.name.charAt(0)}
            </div>

            <div className="recent-customer-info">
              <strong>{customer.name}</strong>
              <span>{customer.email}</span>
              <small>{customer.joined}</small>
            </div>

            <span
              className={`recent-customer-status ${
                customer.status.toLowerCase()
              }`}
            >
              <i></i>
              {customer.status}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default RecentCustomers;