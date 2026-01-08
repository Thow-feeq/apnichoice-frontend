import React, { useState } from "react";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");

  const handleTrack = () => {
    if (!orderId.trim()) {
      alert("Please enter your Order ID");
      return;
    }
    // Integrate your tracking API logic here
    alert(`Tracking details for Order ID: ${orderId}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-24">
      <h1 className="text-2xl font-semibold mb-4">Track Your Order</h1>
      <p className="mb-4">
        Enter your Order ID below to check the live status of your shipment. You can find your Order ID in the confirmation email or SMS.
      </p>

      <input
        type="text"
        className="border p-2 rounded w-full mb-3"
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />

      <button
        onClick={handleTrack}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Track Now
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-medium mb-2">Tracking Updates Include:</h2>
        <ul className="list-disc ml-6">
          <li>Order Confirmed</li>
          <li>Fabric Quality Check</li>
          <li>Packed & Handed to Courier</li>
          <li>In Transit</li>
          <li>Out for Delivery</li>
          <li>Delivered</li>
        </ul>
      </div>
    </div>
  );
};

export default TrackOrder;
