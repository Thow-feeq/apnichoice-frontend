import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useAppContext } from './context/AppContext';
import { Toaster } from "react-hot-toast"


import Home from './pages/Home'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrders from './pages/MyOrders'
import Contact from './pages/Contact'
import About from './pages/About'
import Loading from './components/Loading'
import Login from './components/Login'

// Seller
import SellerLogin from './components/seller/SellerLogin'
import SellerLayout from './pages/seller/SellerLayout'
import AddProduct from './pages/seller/AddProduct'
import ProductList from './pages/seller/ProductList'
import Orders from './pages/seller/Orders'
import SellerCreateCoupon from './pages/seller/SellerCreateCoupon'
import EditProduct from './pages/seller/EditProduct'
import UserList from './pages/seller/UserList'
import AdminDashboard from './pages/seller/AdminDashboard'
import CouponList from './pages/seller/CouponList'
import AddCategory from './pages/seller/AddCategory'
import CategoryList from './pages/seller/CategoryList'
import SubscriberList from './pages/seller/SubscriberList';


const App = () => {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext();

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {!isSellerPath && <Navbar />}
      {showUserLogin && <Login />} {/* Modal Login */}
      <Toaster />

      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category' element={<ProductCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddress />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/loader' element={<Loading />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/about' element={<About />} />
          <Route path='/login' element={<Login />} /> {/* ✅ Route-based Login */}

          {/* Seller Routes */}
          <Route path='/seller' element={isSeller ? <SellerLayout /> : <SellerLogin />}>
            <Route index element={<AddProduct />} />
            <Route path='product-list' element={<ProductList />} />
            <Route path='category-list' element={<CategoryList />} />
            <Route path='add-category' element={<AddCategory />} />
            <Route path='orders' element={<Orders />} />
            <Route path='create-coupon' element={<SellerCreateCoupon />} />
            <Route path='edit-product/:id' element={<EditProduct />} />
            <Route path='userList' element={<UserList />} />
            <Route path='subscriberList' element={<SubscriberList />} />
            <Route path='coupons' element={<CouponList />} />
            <Route path='login' element={<SellerLogin />} />
            <Route path='dashboard' element={<AdminDashboard />} />
          </Route>
        </Routes>
      </div>

      {!isSellerPath && <Footer />}
    </div>
  )
}

export default App
