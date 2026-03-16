import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import { Toaster } from "react-hot-toast";

// Pages
import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
// import ProductCategory from './pages/ProductCategory'; // no longer needed
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import Contact from './pages/Contact';
import About from './pages/About';
import Loading from './components/Loading';
import Login from './components/Login';

// Seller
import AdminLayout from './pages/admin/AdminLayout';
import AddProduct from './pages/admin/AddProduct';
import ProductList from './pages/admin/ProductList';
import Orders from './pages/admin/Orders';
import SellerCreateCoupon from './pages/admin/SellerCreateCoupon';
import EditProduct from './pages/admin/EditProduct';
import UserList from './pages/admin/UserList';
import AdminDashboard from './pages/admin/AdminDashboard';
import CouponList from './pages/admin/CouponList';
import AddCategory from './pages/admin/AddCategory';
import CategoryList from './pages/admin/CategoryList';
import SubscriberList from './pages/admin/SubscriberList';
import AdminLogin from './components/admin/adminLogin';
import EditCategory from './pages/admin/EditCategory';
import SalesReport from './pages/admin/SalesReport';
import CMSDashboard from './pages/admin/CMSDashboard';
import ProductListCMS from './pages/admin/ProductListCMS';
import CategoryListCMS from './pages/admin/CategoryListCMS';
import DeliveryInfo from './pages/DeliveryInfo';
import PaymentMethods from './pages/PaymentMethods';
import ReturnRefundPolicy from './pages/ReturnRefundPolicy';
import TrackOrder from './pages/TrackyourOrder';
import Invoice from './pages/Invoice';
import Banners from './pages/admin/Banners';
import Reviews from './pages/admin/Reviews';
import StockReport from './pages/admin/StockReport';

const App = () => {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("admin");
  const { showUserLogin, isSeller } = useAppContext();

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {!isSellerPath && <Navbar />}
      {showUserLogin && <Login />}
      <Toaster />

      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          {/* consolidated product listing; :category is optional */}
          <Route path='/products/:category?' element={<AllProducts />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddress />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path="/invoice/:id" element={<Invoice />} />
          <Route path='/loader' element={<Loading />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/about' element={<About />} />
          <Route path='/login' element={<Login />} />


          {/* New Pages */}
          <Route path='/delivery-info' element={<DeliveryInfo />} />
          <Route path='/return-refund-policy' element={<ReturnRefundPolicy />} />
          <Route path='/payment-methods' element={<PaymentMethods />} />
          <Route path='/track-order' element={<TrackOrder />} />

          {/* Seller Routes */}
          {/* Seller Routes */}
          <Route path='/admin' element={isSeller ? <AdminLayout /> : <AdminLogin />}>
            <Route path='cms-dashboard' element={<CMSDashboard />} />
            <Route path='add-product' index element={<AddProduct />} />
            <Route path='product-list' element={<ProductListCMS />} />
            <Route path='category-list' element={<CategoryListCMS />} />
            <Route path='add-category' element={<AddCategory />} />

            {/* ✅ THIS IS THE MISSING ROUTE */}
            <Route path='edit-category/:id' element={<EditCategory />} />

            <Route path='orders' element={<Orders />} />
            <Route path='create-coupon' element={<SellerCreateCoupon />} />
            <Route path='edit-product/:id' element={<EditProduct />} />
            <Route path='userList' element={<UserList />} />
            <Route path='subscriberList' element={<SubscriberList />} />
            <Route path='coupons' element={<CouponList />} />
            <Route path='login' element={<AdminLogin />} />
            <Route path='dashboard' element={<AdminDashboard />} />
            <Route path='sales-report' element={<SalesReport />} />
            <Route path='stock-report' element={<StockReport />} /> 
            <Route path="/admin/banners" element={<Banners />} />
            <Route path="reviews" element={<Reviews />} />

          </Route>
        </Routes>
      </div>

      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
