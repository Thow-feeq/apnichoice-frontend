import React from "react";

const ReturnRefundPolicy = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto mt-24">
      <h1 className="text-2xl font-semibold mb-4">Return & Refund Policy</h1>
      <p className="mb-4">
        We want you to be fully satisfied with your purchase. If there are any issues with size, material, shade variation, or damage, you may request a return or exchange as per our policy.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-2">Eligible Returns</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Damaged or defective products</li>
        <li>Incorrect items delivered</li>
        <li>Size or pattern mismatch (apparels)</li>
      </ul>

      <h2 className="text-xl font-medium mt-6 mb-2">Non-Returnable Items</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Cut fabrics / custom-length materials</li>
        <li>Blouse stitching or alteration services</li>
        <li>Clearance / discounted items</li>
      </ul>

      <h2 className="text-xl font-medium mt-6 mb-2">Return Window</h2>
      <p className="mb-4">
        Customers can raise a return request within <strong>5 days</strong> of delivery. Items should be unused, unwashed, and with all original tags.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-2">Refunds</h2>
      <p className="mb-4">
        Refunds are processed within 5 - 7 working days after quality inspection. Refunds will be issued to the original payment method or wallet credit as applicable.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-2">Exchange</h2>
      <p>
        If you wish to exchange the item for a different color, size, or product, we will arrange the exchange after receiving the returned item.
      </p>
    </div>
  );
};

export default ReturnRefundPolicy;
