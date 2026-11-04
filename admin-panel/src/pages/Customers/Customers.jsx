
import React, { useEffect, useMemo, useState } from "react";
import "./Customers.css";

import CustomerStats from "../../components/CustomerStats/CustomerStats";
import CustomerFilters from "../../components/CustomerFilters/CustomerFilters";
import CustomerTable from "../../components/CustomerTable/CustomerTable";
import RecentCustomers from "../../components/RecentCustomers/RecentCustomers";
import CustomerInsights from "../../components/CustomerInsights/CustomerInsights";
import AddCustomerModal from "../../components/AddCustomerModal/AddCustomerModal";

const API_URL = "http://localhost:5000/api/customers";

const formatCustomer = (customer) => ({
  id: customer._id,
  customerId: `CUST${customer._id.slice(-6).toUpperCase()}`,
  name: customer.name || "",
  email: customer.email || "",
  phone: customer.phone || "",
  address: customer.address || "",
  orders: 0,
  totalSpent: 0,
  status: customer.status || "Active",
  joined: new Date(customer.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
});

function Customers() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // GET CUSTOMERS
  const fetchCustomers = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      setCustomers(data.map(formatCustomer));
    } catch (error) {
      console.error("Customers Error:", error);
      alert("Customers load nahi ho sake. Backend check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // SEARCH + STATUS FILTER
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        customer.name.toLowerCase().includes(searchText) ||
        customer.email.toLowerCase().includes(searchText) ||
        customer.phone.toLowerCase().includes(searchText);

      const matchesStatus =
        status === "All Statuses" || customer.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, status]);

  // ADD CUSTOMER
  const handleAddCustomer = async (newCustomer) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          status: newCustomer.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Customer could not be added");
      }

      await fetchCustomers();
      setShowAddCustomer(false);
      alert("Customer added successfully!");
    } catch (error) {
      console.error("Add Customer Error:", error);
      alert(error.message || "Customer add nahi hua.");
    }
  };

  // EDIT CUSTOMER
  const handleEditCustomer = async (updatedCustomer) => {
    try {
      const response = await fetch(
        `${API_URL}/${updatedCustomer.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updatedCustomer.name,
            email: updatedCustomer.email,
            phone: updatedCustomer.phone,
            status: updatedCustomer.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Customer update failed");
      }

      await fetchCustomers();
      setEditingCustomer(null);
      alert("Customer updated successfully!");
    } catch (error) {
      console.error("Edit Customer Error:", error);
      alert(error.message || "Customer update nahi hua.");
    }
  };

  // DELETE CUSTOMER
  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await fetch(`${API_URL}/${customerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Customer delete failed");
      }

      setCustomers((previousCustomers) =>
        previousCustomers.filter(
          (customer) => customer.id !== customerId
        )
      );

      alert("Customer deleted successfully!");
    } catch (error) {
      console.error("Delete Customer Error:", error);
      alert("Customer delete nahi hua.");
    }
  };

  return (
    <div className="customers-page">
      {/* PAGE HEADER */}
      <div className="customers-heading">
        <div>
          <span className="customers-label">CUSTOMERS</span>

          <h2>Manage Your Customers</h2>

          <p>
            View, search and manage all your customers in one place.
          </p>
        </div>

        <button
          className="add-customer-btn"
          onClick={() => setShowAddCustomer(true)}
        >
          <span>＋</span>
          Add Customer
        </button>
      </div>

      {/* CUSTOMER STATS */}
      <CustomerStats customers={customers} />

      {/* CUSTOMERS SECTION */}
      <div className="customers-section">
        <div className="customers-section-header">
          <div>
            <h3>All Customers</h3>
            <p>
              View, search and manage all customer accounts.
            </p>
          </div>

          <CustomerFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
          />
        </div>

        {/* MAIN TWO COLUMN LAYOUT */}
        <div className="customers-main-layout">
          {/* LEFT SIDE */}
          <div className="customers-left">
            {loading ? (
              <p>Loading customers...</p>
            ) : (
              <CustomerTable
                customers={filteredCustomers}
                onEdit={setEditingCustomer}
                onDelete={handleDeleteCustomer}
              />
            )}

            <div className="customers-footer">
              <span>
                Showing {filteredCustomers.length} of{" "}
                {customers.length} customers
              </span>

              <div className="customers-pagination">
                <button>←</button>
                <button className="active-page">1</button>
                <button>2</button>
                <button>3</button>
                <button>4</button>
                <button>5</button>
                <button>→</button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="customers-right">
            <RecentCustomers customers={customers} />
            <CustomerInsights />
          </div>
        </div>
      </div>

      {/* ADD CUSTOMER MODAL */}
      {showAddCustomer && (
        <AddCustomerModal
          onClose={() => setShowAddCustomer(false)}
          onAdd={handleAddCustomer}
        />
      )}

      {/* EDIT CUSTOMER MODAL */}
      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onSave={handleEditCustomer}
        />
      )}
    </div>
  );
}

/* EDIT CUSTOMER MODAL */

function EditCustomerModal({ customer, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    status: customer.status,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    onSave({
      ...customer,
      ...formData,
    });
  };

  return (
    <div className="edit-customer-overlay" onClick={onClose}>
      <div
        className="edit-customer-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="edit-customer-modal-header">
          <div>
            <h3>Edit Customer</h3>
            <p>{customer.customerId}</p>
          </div>

          <button
            className="edit-customer-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="edit-customer-form">
            <div className="edit-form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="edit-form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="edit-form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="edit-form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div className="edit-customer-modal-footer">
            <button
              type="button"
              className="edit-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-save-btn"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Customers;
