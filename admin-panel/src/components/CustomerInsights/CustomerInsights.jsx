import "./CustomerInsights.css";

function CustomerInsights() {
  return (
    <div className="customer-insights-card">

      <div className="customer-insights-header">
        <h3>Customer Insights</h3>

        <select>
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Year</option>
        </select>
      </div>


      <div className="insight-item">
        <div className="insight-icon blue-icon">
          $
        </div>

        <div className="insight-info">
          <span>Avg. Order Value</span>
          <strong>$687.50</strong>
        </div>

        <b className="insight-positive">
          +8%
        </b>
      </div>


      <div className="insight-item">
        <div className="insight-icon green-icon">
          ↗
        </div>

        <div className="insight-info">
          <span>Total Revenue</span>
          <strong>$170,240.00</strong>
        </div>

        <b className="insight-positive">
          +12%
        </b>
      </div>


      <div className="insight-item">
        <div className="insight-icon orange-icon">
          ★
        </div>

        <div className="insight-info">
          <span>Most Active Customer</span>
          <strong>Sarah Khan</strong>
        </div>

        <b className="insight-value">
          12 orders
        </b>
      </div>


      <div className="insight-item last-insight">
        <div className="insight-icon purple-icon">
          📍
        </div>

        <div className="insight-info">
          <span>Top Location</span>
          <strong>Lahore, Pakistan</strong>
        </div>
      </div>

    </div>
  );
}

export default CustomerInsights;