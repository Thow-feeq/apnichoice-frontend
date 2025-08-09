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
            <footer className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-[#30383f] text-gray-300">
                {/* Top Section */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30">
                    {/* Logo and About */}
                    <div>
                        <img className="w-34 md:w-32" src={assets.logo} alt="logo" />
                        <p className="max-w-[410px] mt-6">
                            We deliver fresh groceries and snacks straight to your door. Trusted by thousands, we aim to make your shopping experience simple and affordable.
                        </p>
                    </div>

                    {/* Footer Links */}
                    <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                        {footerLinks.map((section, index) => (
                            <div key={index}>
                                <h3 className="font-semibold text-base text-white md:mb-5 mb-2">{section.title}</h3>
                                <ul className="text-sm space-y-1">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <a href={link.url} className="hover:underline transition">{link.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Payment & Shipping */}
                    <div className="w-full md:w-[25%]">
                        <h3 className="font-semibold text-base text-white md:mb-5 mb-2">Information</h3>
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
                <div className="py-6 flex justify-center space-x-6">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                        <i className="fab fa-facebook-f text-xl"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                        <i className="fab fa-instagram text-xl"></i>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                        <i className="fab fa-twitter text-xl"></i>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                        <i className="fab fa-linkedin-in text-xl"></i>
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                        <i className="fab fa-youtube text-xl"></i>
                    </a>
                </div>

                {/* Bottom Text */}
                {/* <p className="pb-6 text-center text-sm md:text-base text-gray-400">
                    © {new Date().getFullYear()} Webionix.in – All Rights Reserved.
                </p> */}
            </footer>

            {/* WhatsApp Button */}
            <a
                href="https://wa.me/+91 9600158380"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 left-6 z-30"
            >
                <div className="w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition duration-300 bg-white/10">
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
                    className="fixed bottom-6 right-6 z-30 bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-600 transition duration-300"
                    aria-label="Scroll to top"
                >
                    ↑
                </button>
            )}
        </>
    );
};

export default Footer;
