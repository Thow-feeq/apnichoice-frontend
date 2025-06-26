import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // Clear the error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: '',
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Here, you would send the form data to your backend or email service
      console.log('Form submitted:', formData);
      alert('Message sent successfully!');
      // Reset form
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    }
  };

  return (
    <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8 text-center">Contact Us</h1>
      <p className="text-gray-600 mb-12 text-center">
        We’d love to hear from you! Fill out the form or reach us directly.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className={`w-full px-4 py-3 border rounded-md outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary'
              }`}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className={`w-full px-4 py-3 border rounded-md outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary'
              }`}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your Phone Number"
              className={`w-full px-4 py-3 border rounded-md outline-none focus:ring-2 ${
                errors.phone ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary'
              }`}
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className={`w-full px-4 py-3 border rounded-md outline-none focus:ring-2 ${
                errors.subject ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary'
              }`}
            />
            {errors.subject && <p className="text-sm text-red-500 mt-1">{errors.subject}</p>}
          </div>

          <div>
            <textarea
              rows="5"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className={`w-full px-4 py-3 border rounded-md outline-none focus:ring-2 ${
                errors.message ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary'
              }`}
            />
            {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dull text-white px-6 py-2 rounded-full"
          >
            Send Message
          </button>
        </form>

        {/* Right: Contact Information */}
        <div className="text-gray-700 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Office Address:</h2>
            <p>Shop 22, Nandikripa Shopping Centre</p>
            <p>4 Bunglows, Ratan Nagar Lane</p>
            <p>Andheri West, Mumbai 53</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Opening Time:</h2>
            <p>10:30 AM to 9:00 PM</p>
            <p>Open all 7 days</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Stay Connected:</h2>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Embedded Google Map */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4">Find Us on Google Maps:</h2>
        <div className="w-full h-80">
          <iframe
            title="Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.367743944027!2d72.83281617515108!3d19.13442505060265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b6440cb48c4b%3A0xe640f888be3f6978!2sFour%20Bungalows%2C%20Andheri%20West%2C%20Mumbai%2C%20Maharashtra%20400053!5e0!3m2!1sen!2sin!4v1716987123456!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
