import React, { useState } from 'react';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const officialEmail = "JDPrimehub@Jaydhee.com";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
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
      console.log('Form submitted:', formData);
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-6">Contact Us</h1>
      <p className="text-center text-gray-600 mb-12">
        At JD PrimeHub, we’d love to hear from you! Whether you’re looking for the perfect fabric, 
        have questions about our collections, or simply want to know more – our team is here to help.
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Form Card */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-primary">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className={`w-full px-4 py-3 border rounded-md outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary'}`}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className={`w-full px-4 py-3 border rounded-md outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary'}`}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your Phone Number"
              className={`w-full px-4 py-3 border rounded-md outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary'}`}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className={`w-full px-4 py-3 border rounded-md outline-none focus:ring-2 ${errors.subject ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary'}`}
            />
            {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}

            <textarea
              rows="5"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className={`w-full px-4 py-3 border rounded-md outline-none focus:ring-2 ${errors.message ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary'}`}
            />
            {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dull text-white font-semibold py-3 rounded-full transition-all duration-200"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 space-y-8">
          <h2 className="text-2xl font-semibold text-primary">Get in Touch</h2>

          <div className="flex items-start gap-4">
            <FiMapPin className="text-primary text-2xl mt-1" />
            <div>
              <h3 className="font-semibold">Showroom</h3>
              <p>Vastraa Dhee Fashions</p>
              <p>No#72, Sangeetha Nagar, Thirukazhukundram Road, Pooncheri Koot road, Mamallapuram</p>
              <p>📍 Easily accessible in the heart of [City/Area]</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FiPhone className="text-primary text-2xl mt-1" />
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p>+91 877-8943194</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FiMail className="text-primary text-2xl mt-1" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>{officialEmail}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-all duration-200">
                <FaFacebookF />
              </a>
              <a href="#" className="text-white bg-pink-500 p-2 rounded-full hover:bg-pink-600 transition-all duration-200">
                <FaInstagram />
              </a>
              <a href="#" className="text-white bg-green-500 p-2 rounded-full hover:bg-green-600 transition-all duration-200">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Store Hours</h3>
            <p>10:30 AM – 9:00 PM, Open all 7 days</p>
          </div>
        </div>
      </div>

      {/* Google Map */}
      <div className="mt-12 rounded-lg overflow-hidden shadow-lg">
        <iframe
          title="JD PrimeHub Showroom"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.367743944027!2d72.83281617515108!3d19.13442505060265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b6440cb48c4b%3A0xe640f888be3f6978!2sFour%20Bungalows%2C%20Andheri%20West%2C%20Mumbai%2C%20Maharashtra%20400053!5e0!3m2!1sen!2sin!4v1716987123456!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};

export default Contact;
