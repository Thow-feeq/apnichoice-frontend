import { useEffect, useState } from "react";
import { assets, footerLinks } from "../assets/assets";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <footer className="relative px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-gradient-to-t from-[#2c2f36] to-[#1b1d21] text-gray-300 overflow-hidden">
        
        {/* Textile Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/assets/textile_pattern.svg')] bg-repeat opacity-5 pointer-events-none"></div>

        {/* Top Section */}
        <div className="relative flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 z-10">
          
          {/* Logo and About */}
          <div className="max-w-sm">
            {/* <img className="w-32 md:w-36" src={assets.logo} alt="logo" /> */}
            <p className="mt-6 text-gray-200 text-sm md:text-base leading-relaxed">
              Discover premium textiles, fabrics, and fashion accessories delivered to your doorstep. Trusted by thousands of designers and hobbyists alike, we make shopping effortless and inspiring.
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-base text-white md:mb-5 mb-2 border-b border-pink-500/30 pb-1">
                  {section.title}
                </h3>
                <ul className="text-sm space-y-1">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href={link.url} className="hover:text-pink-400 transition">
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Payment & Shipping */}
          <div className="w-full md:w-[25%]">
            <h3 className="font-semibold text-base text-white md:mb-5 mb-2 border-b border-pink-500/30 pb-1">Information</h3>
            <ul className="text-sm space-y-4">
              <li>
                <p className="text-white font-medium">Payment Methods</p>
                <p className="text-gray-400">Razorpay – UPI / Credit Card / Debit Card</p>
              </li>
              <li>
                <p className="text-white font-medium">Shipping Methods</p>
                <p className="text-gray-400">Fast Local Delivery</p>
              </li>
              <li>
                <p className="text-white font-medium">Delivery Charges</p>
                <p className="text-gray-400">As applicable at checkout</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="relative z-10 py-6 flex justify-center space-x-6">
          {["facebook", "instagram", "twitter", "linkedin", "youtube"].map((platform, i) => (
            <a
              key={i}
              href={`https://${platform}.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-400 transition text-xl"
            >
              <i className={`fab fa-${platform}`}></i>
            </a>
          ))}
        </div>

        {/* Bottom Text */}
        <p className="relative z-10 text-center text-sm md:text-base text-gray-400 pb-6">
          © {new Date().getFullYear()} TextileWorld – All Rights Reserved.
        </p>
      </footer>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/+919600158380"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-30"
      >
        <div className="w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition duration-300 bg-pink-500/20 backdrop-blur-sm border border-pink-400/30">
          <img
            src={assets.whatsapp_icon}
            alt="Chat on WhatsApp"
            className="w-8 h-8"
          />
        </div>
      </a>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-30 bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-400 transition duration-300"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </>
  );
};

export default Footer;
