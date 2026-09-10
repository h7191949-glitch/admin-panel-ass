import React, { useState } from "react";
import "./CustomerTable.css";

function CustomerTable({ customers, onEdit, onDelete }) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const handleDelete = (customer) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${customer.name}?`
    );

    if (confirmDelete) {
      onDelete(customer.id);
    }

    setOpenMenu(null);
  };

  return (
    <>
      <div className="customer-table-wrapper">

        <div className="customer-table">

          <div className="customer-row customer-table-header">
            <span>□</span>
            <span>Customer</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Orders</span>
            <span>Total Spent</span>
            <span>Status</span>
            <span>Joined</span>
            <span>Actions</span>
          </div>

          {customers.length > 0 ? (
            customers.map((customer) => (
              <div
                className="customer-row"
                key={customer.id}
              >
                <span className="customer-checkbox">□</span>

                <div className="customer-profile">
                  <div className="customer-avatar">
                    {customer.name.charAt(0)}
                  </div>

                  <div className="customer-name">
                    <strong>{customer.name}</strong>
                    <span>ID: {customer.customerId}</span>
                  </div>
                </div>

                <span className="customer-email">
                  {customer.email}
                </span>

                <span className="customer-phone">
                  {customer.phone}
                </span>

                <strong className="customer-orders">
                  {customer.orders}
                </strong>

                <strong className="customer-spent">
                  ${customer.totalSpent.toFixed(2)}
                </strong>

                <span>
                  <span
                    className={`customer-status ${customer.status.toLowerCase()}`}
                  >
                    <i></i>
                    {customer.status}
                  </span>
                </span>

                <span className="customer-joined">
                  {customer.joined}
                </span>

                <div className="customer-actions">

                  {/* VIEW */}
                  <button
                    className="customer-view-btn"
                    title="View Customer"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    👁
                  </button>

                  {/* EDIT */}
                  <button
                    className="customer-edit-btn"
                    title="Edit Customer"
                    onClick={() => onEdit(customer)}
                  >
                    ✎
                  </button>

                  {/* MORE */}
                  <div className="customer-more-wrapper">

                    <button
                      className="customer-more-btn"
                      title="More Actions"
                      onClick={() =>
                        setOpenMenu(
                          openMenu === customer.id
                            ? null
                            : customer.id
                        )
                      }
                    >
                      ⋮
                    </button>

                    {openMenu === customer.id && (
                      <div className="customer-action-menu">

                        <button
                          onClick={() => onEdit(customer)}
                        >
                          ✎ Edit Customer
                        </button>

                        <button
                          className="delete-customer-action"
                          onClick={() => handleDelete(customer)}
                        >
                          🗑 Delete Customer
                        </button>

                      </div>
                    )}

                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="no-customers">
              No customers found.
            </div>
          )}

        </div>

      </div>


      {/* VIEW CUSTOMER MODAL */}

      {selectedCustomer && (
        <div
          className="customer-modal-overlay"
          onClick={() => setSelectedCustomer(null)}
        >

          <div
            className="customer-view-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="customer-modal-header">

              <div>
                <h3>Customer Details</h3>
                <p>{selectedCustomer.customerId}</p>
              </div>

              <button
                className="customer-modal-close"
                onClick={() => setSelectedCustomer(null)}
              >
                ×
              </button>

            </div>


            <div className="customer-modal-profile">

              <div className="customer-modal-avatar">
                {selectedCustomer.name.charAt(0)}
              </div>

              <div>
                <h4>{selectedCustomer.name}</h4>

                <span
                  className={`customer-status ${selectedCustomer.status.toLowerCase()}`}
                >
                  <i></i>
                  {selectedCustomer.status}
                </span>
              </div>

            </div>


            <div className="customer-detail-content">

              <div className="customer-detail-row">
                <span>Email</span>
                <strong>{selectedCustomer.email}</strong>
              </div>

              <div className="customer-detail-row">
                <span>Phone</span>
                <strong>{selectedCustomer.phone}</strong>
              </div>

              <div className="customer-detail-row">
                <span>Total Orders</span>
                <strong>{selectedCustomer.orders}</strong>
              </div>

              <div className="customer-detail-row">
                <span>Total Spent</span>
                <strong>
                  ${selectedCustomer.totalSpent.toFixed(2)}
                </strong>
              </div>

              <div className="customer-detail-row">
                <span>Joined</span>
                <strong>{selectedCustomer.joined}</strong>
              </div>

            </div>


            <div className="customer-modal-footer">

              <button
                onClick={() => setSelectedCustomer(null)}
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default CustomerTable;