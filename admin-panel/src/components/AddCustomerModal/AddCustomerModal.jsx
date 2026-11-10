import { useState } from "react";
import "./AddCustomerModal.css";

function AddCustomerModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
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

    onAdd(formData);
  };

  return (
    <div
      className="add-customer-overlay"
      onClick={onClose}
    >
      <div
        className="add-customer-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="add-customer-modal-header">
          <div>
            <h3>Add New Customer</h3>
            <p>Create a new customer account.</p>
          </div>

          <button
            className="add-customer-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>


        <form onSubmit={handleSubmit}>

          <div className="add-customer-form">

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter customer name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>


            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>


            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>


            <div className="form-group">
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


          <div className="add-customer-modal-footer">

            <button
              type="button"
              className="cancel-customer-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-customer-btn"
            >
              Add Customer
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default AddCustomerModal;