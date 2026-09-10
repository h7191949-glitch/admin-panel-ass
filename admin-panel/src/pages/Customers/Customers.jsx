import React, { useMemo, useState } from "react";
import "./Customers.css";

import CustomerStats from "../../components/CustomerStats/CustomerStats";
import CustomerFilters from "../../components/CustomerFilters/CustomerFilters";
import CustomerTable from "../../components/CustomerTable/CustomerTable";
import RecentCustomers from "../../components/RecentCustomers/RecentCustomers";
import CustomerInsights from "../../components/CustomerInsights/CustomerInsights";
import AddCustomerModal from "../../components/AddCustomerModal/AddCustomerModal";

function Customers() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");

  const [showAddCustomer, setShowAddCustomer] = useState(false);

  // EDIT CUSTOMER
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [customers, setCustomers] = useState([
    {
      id: 1,
      customerId: "CUST001",
      name: "Sarah Khan",
      email: "sarah.khan@example.com",
      phone: "+92 300 1234567",
      orders: 12,
      totalSpent: 1240,
      status: "Active",
      joined: "Jan 15, 2025",
    },
    {
      id: 2,
      customerId: "CUST002",
      name: "Ali Raza",
      email: "ali.raza@example.com",
      phone: "+92 321 9876543",
      orders: 8,
      totalSpent: 890,
      status: "Active",
      joined: "Feb 3, 2025",
    },
    {
      id: 3,
      customerId: "CUST003",
      name: "Ayesha Malik",
      email: "ayesha.malik@example.com",
      phone: "+92 333 4567890",
      orders: 5,
      totalSpent: 520,
      status: "Active",
      joined: "Feb 12, 2025",
    },
    {
      id: 4,
      customerId: "CUST004",
      name: "Usman Tariq",
      email: "usman.tariq@example.com",
      phone: "+92 322 1112233",
      orders: 3,
      totalSpent: 310,
      status: "Inactive",
      joined: "Feb 20, 2025",
    },
    {
      id: 5,
      customerId: "CUST005",
      name: "Nadia Zafar",
      email: "nadia.zafar@example.com",
      phone: "+92 310 9876543",
      orders: 9,
      totalSpent: 760,
      status: "Active",
      joined: "Mar 1, 2025",
    },
    {
      id: 6,
      customerId: "CUST006",
      name: "Hamza Mirza",
      email: "hamza.mirza@example.com",
      phone: "+92 334 1237890",
      orders: 4,
      totalSpent: 420,
      status: "Inactive",
      joined: "Mar 5, 2025",
    },
    {
      id: 7,
      customerId: "CUST007",
      name: "Fatima Shah",
      email: "fatima.shah@example.com",
      phone: "+92 345 6543210",
      orders: 7,
      totalSpent: 680,
      status: "Active",
      joined: "Mar 10, 2025",
    },
    {
      id: 8,
      customerId: "CUST008",
      name: "Ahmed Ali",
      email: "ahmed.ali@example.com",
      phone: "+92 333 9876541",
      orders: 6,
      totalSpent: 540,
      status: "Active",
      joined: "Mar 14, 2025",
    },
  ]);

  // SEARCH + STATUS FILTER
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        customer.name.toLowerCase().includes(searchText) ||
        customer.email.toLowerCase().includes(searchText) ||
        customer.phone.toLowerCase().includes(searchText);

      const matchesStatus =
        status === "All Statuses" ||
        customer.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, status]);

  // ADD CUSTOMER
  const handleAddCustomer = (newCustomer) => {
    const customer = {
      id: Date.now(),
      customerId: `CUST${String(customers.length + 1).padStart(3, "0")}`,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      orders: 0,
      totalSpent: 0,
      status: newCustomer.status,
      joined: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    setCustomers((prevCustomers) => [
      ...prevCustomers,
      customer,
    ]);

    setShowAddCustomer(false);
  };

  // EDIT CUSTOMER
  const handleEditCustomer = (updatedCustomer) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === updatedCustomer.id
          ? updatedCustomer
          : customer
      )
    );

    setEditingCustomer(null);
  };

  // DELETE CUSTOMER
  const handleDeleteCustomer = (customerId) => {
    setCustomers((prevCustomers) =>
      prevCustomers.filter(
        (customer) => customer.id !== customerId
      )
    );
  };

  return (
    <div className="customers-page">

      {/* PAGE HEADER */}

      <div className="customers-heading">

        <div>
          <span className="customers-label">
            CUSTOMERS
          </span>

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

            <CustomerTable
              customers={filteredCustomers}
              onEdit={setEditingCustomer}
              onDelete={handleDeleteCustomer}
            />

            <div className="customers-footer">

              <span>
                Showing {filteredCustomers.length} of{" "}
                {customers.length} customers
              </span>

              <div className="customers-pagination">

                <button>←</button>

                <button className="active-page">
                  1
                </button>

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

            <RecentCustomers
              customers={customers}
            />

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

function EditCustomerModal({
  customer,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    status: customer.status,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
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
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
    });
  };

  return (
    <div
      className="edit-customer-overlay"
      onClick={onClose}
    >

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