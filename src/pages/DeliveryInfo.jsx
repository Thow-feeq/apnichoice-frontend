import React from "react";

const DeliveryInfo = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto mt-24">
      <h1 className="text-2xl font-semibold mb-4">Delivery Information</h1>
      <p className="mb-4">
        We deliver high-quality textile products including sarees, dress materials, kurtis, shirts, and home furnishings across India.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-2">Delivery Time</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Metro Cities: 3 - 5 working days</li>
        <li>Other Cities: 5 - 7 working days</li>
        <li>Remote Areas: 7 - 10 working days</li>
      </ul>

      <h2 className="text-xl font-medium mt-6 mb-2">Order Processing</h2>
      <p className="mb-4">
        Orders placed before 3 PM are processed on the same day. Orders placed after 3 PM will be processed next day. Orders are shipped via trusted courier partners to ensure safe delivery.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-2">Shipping Charges</h2>
      <p className="mb-4">We offer free shipping for orders above ₹999. For orders below ₹999, a flat delivery fee of ₹79 is charged.</p>

      <h2 className="text-xl font-medium mt-6 mb-2">Packaging</h2>
      <p>
        All textile items are securely packed to avoid damage, moisture, and color transfer during transit. Sarees and fabrics are delivered with protective covers.
      </p>
    </div>
  );
};

export default DeliveryInfo;
