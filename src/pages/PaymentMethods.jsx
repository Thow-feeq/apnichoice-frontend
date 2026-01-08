import React from "react";

const PaymentMethods = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto mt-24">
      <h1 className="text-2xl font-semibold mb-4">Payment Methods</h1>
      <p className="mb-4">
        We offer secure payment options for a smooth shopping experience. All transactions are encrypted and processed through trusted gateways.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-2">Available Payment Options</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>UPI (GPay, PhonePe, Paytm, BHIM)</li>
        <li>Debit & Credit Cards (Visa, MasterCard, RuPay)</li>
        <li>Net Banking (All major banks)</li>
        <li>Wallets (Paytm Wallet, PhonePe Wallet, etc.)</li>
        <li>Cash on Delivery (COD) for select pin codes</li>
      </ul>

      <h2 className="text-xl font-medium mt-6 mb-2">International Payments</h2>
      <p className="mb-4">
        International customers can use credit/debit cards to place orders. International shipping charges will apply based on weight and country.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-2">Invoice</h2>
      <p>
        Every order includes GST invoice for textile products such as sarees, suits, kurta sets, and home furnishing items.
      </p>
    </div>
  );
};

export default PaymentMethods;
