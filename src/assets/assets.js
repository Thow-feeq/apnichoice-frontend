import logo from "./bright-vision.png";
import search_icon from "./search_icon.svg";
import remove_icon from "./remove_icon.svg";
import arrow_right_icon_colored from "./arrow_right_icon_colored.svg";
import star_icon from "./star_icon.svg";
import star_dull_icon from "./star_dull_icon.svg";
import cart_icon from "./cart_icon.svg";
import nav_cart_icon from "./nav_cart_icon.svg";
import add_icon from "./add_icon.svg";
import refresh_icon from "./refresh_icon.svg";
import product_list_icon from "./product_list_icon.svg";
import order_icon from "./order_icon.svg";
import upload_area from "./upload_area.png";
import profile_icon from "./profile_icon.png";
import menu_icon from "./menu_icon.svg";
import delivery_truck_icon from "./delivery_truck_icon.svg";
import leaf_icon from "./leaf_icon.svg";
import coin_icon from "./coin_icon.svg";
import trust_icon from "./trust_icon.svg";
import black_arrow_icon from "./black_arrow_icon.svg";
import white_arrow_icon from "./white_arrow_icon.svg";

import glass_banner_1 from "./glass_banner_1.jpg";
import glass_banner_2 from "./glass_banner_2.jpg";
import glass_banner_3 from "./glass_banner_3.jpg";

import eye_glasses from "./eye-glasses.jpg";
import main_banner_bg_sm from "./main_banner_bg_sm.png";

import textile_one from "./textile_one.jpg";
import textile_two from "./textile_two.jpg";
import textile_three from "./textile_two.jpg";   // ✅ exists

// ✅ FIX: Removed textile_one_sm (it does NOT exist)

// More category images
import specks_icon_cat from "./specks_icon_cat.jpg";
import coolers_glass from "./coolers_glass.png";
import fio_icon from "./fio_icon.jpg";
import hoio_icon from "./hoio_icon.jpg";
import polarises_icon from "./polarises_icon.jpg";
import noi_icon from "./noi_icon.jpg";
import sungl_icons from "./sungl_icons.jpg";

import dashboard_icon from "./dashboard-svgrepo-com.svg";
import create_coupon from "./coupon-svgrepo-com.svg";
import coupon_list from "./coupon-2-svgrepo-com.svg";
import user_list from "./user-svgrepo-com.svg";
import subscriber_list from "./user-svgrepo-com.svg";
import user_icon from "./user-icon.png";
import whatsapp_icon from "./whatsapp-icon.png";

import menswear_one from "./menswear_one.jpg";
import womenswear_one from "./womenswear_one.jpg";
import kidswear_one from "./kidswear_one.jpg";
import Flip_case_cat_1 from "./Flip-case-cat-1.jpg";
import blu_neck_cat_1 from "./blu-neck-cat-1.jpg";
import cc_board_cat_1 from "./cc-board-cat-1.jpg";
import ear_bud_cat_1 from "./ear-bud-cat-1.jpg";
import car_mob_cat_1 from "./car-mob-cat-1.jpg";

export const assets = {
  logo,
  search_icon,
  remove_icon,
  arrow_right_icon_colored,
  star_icon,
  star_dull_icon,
  cart_icon,
  nav_cart_icon,
  add_icon,
  refresh_icon,
  product_list_icon,
  order_icon,
  upload_area,
  profile_icon,
  menu_icon,
  delivery_truck_icon,
  leaf_icon,
  coin_icon,
  trust_icon,
  black_arrow_icon,
  white_arrow_icon,
  glass_banner_1,
  glass_banner_2,
  glass_banner_3,
  eye_glasses,
  main_banner_bg_sm,
  textile_one,
  textile_two,
  textile_three,
  dashboard_icon,
  create_coupon,
  subscriber_list,
  coupon_list,
  user_list,
  user_icon,
  whatsapp_icon,
  menswear_one,
  womenswear_one,
  kidswear_one,
  Flip_case_cat_1,
  blu_neck_cat_1,
  cc_board_cat_1,
  ear_bud_cat_1,
  car_mob_cat_1,
};

export const categories = [
  {
    text: "Cut specks",
    path: "Cutspecks",
    image: specks_icon_cat,
    bgColor: "#FEF6DA",
  },
  {
    text: "Spectacles",
    path: "Spectacles",
    image: coolers_glass,
    bgColor: "#FEE0E0",
  },
  {
    text: "Bifocals",
    path: "Bifocals",
    image: fio_icon,
    bgColor: "#F0F5DE",
  },
  {
    text: "Trifocals",
    path: "Trifocals",
    image: hoio_icon,
    bgColor: "#E1F5EC",
  },
  {
    text: "Progressive lenses",
    path: "Progressivelenses",
    image: polarises_icon,
    bgColor: "#FEE6CD",
  },
  {
    text: "Polarized",
    path: "Polarized",
    image: noi_icon,
    bgColor: "#E0F6FE",
  },
  {
    text: "Sports goggles",
    path: "Sports goggles",
    image: sungl_icons,
    bgColor: "#F1E3F9",
  },
];

export const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { text: "Home", url: "#" },
      { text: "About Us", url: "/about" },
      { text: "Products", url: "/products" },
      { text: "Contact", url: "/contact" },
      { text: "FAQs", url: "#" },
    ],
  },
  {
    title: "Need help?",
    links: [
      { text: "Delivery Information", url: "#" },
      { text: "Return & Refund Policy", url: "#" },
      { text: "Payment Methods", url: "#" },
      { text: "Track your Order", url: "#" },
      { text: "Contact Us", url: "#" },
    ],
  },
  {
    title: "Follow Us",
    links: [
      { text: "Instagram", url: "#" },
      { text: "Twitter", url: "#" },
      { text: "Facebook", url: "#" },
      { text: "YouTube", url: "#" },
    ],
  },
];

export const features = [
  {
    icon: delivery_truck_icon,
    title: "Delivery On Time",
    description: "4 hours Delivery in any part of chennai.",
  },
  {
    icon: leaf_icon,
    title: "Lens Guaranteed",
    description: "Lens specks bluekart straight from the source.",
  },
  {
    icon: coin_icon,
    title: "Affordable Prices",
    description: "Quality Lens at unbeatable prices.",
  },
  {
    icon: trust_icon,
    title: "Trusted by Thousands",
    description: "Loved by 10,000+ happy customers.",
  },
];
