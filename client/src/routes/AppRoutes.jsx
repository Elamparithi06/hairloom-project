import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";

import Home from "@/components/pages/Home";
import Onboarding from "@/components/pages/seller/Onboarding";
import SellerDashboard from "@/components/pages/seller/SellerDasboard";
import ProductList from "@/components/pages/buyer/ProductList";
import ProductDetails from "@/components/pages/buyer/ProductDetails";
import BuyerChat from "@/components/pages/buyer/BuyerChat";
import ShippingForm from "@/components/pages/buyer/ShippingForm";
import AdminDashboard from "@/components/pages/admin/AdminDashboard";
import Reports from "@/components/pages/admin/Reports";
import CreateAccount from '@/components/pages/auth/CreateAccount';
import Login from '@/components/pages/auth/Login';
import OtpVerify from '@/components/pages/auth/OtpVerify';
import Cart from "@/components/ui/cart";
import Wishlist from "@/components/ui/Wishlist";
import CheckoutPage from "@/components/ui/CheckoutPage";





const AppRoutes = () => (
    <Router>
        <Routes>
            <Route
                path="/"
                element={
                    <MainLayout>
                        <Home />
                    </MainLayout>
                }
            />
            <Route
                path="/seller/onboarding"
                element={
                    <MainLayout>
                        <Onboarding />
                    </MainLayout>
                }
            />
            <Route
                path="/seller/dashboard"
                element={
                    <MainLayout>
                        <SellerDashboard />
                    </MainLayout>
                }
            />
            <Route
                path="/products"
                element={
                    <MainLayout>
                        <ProductList />
                    </MainLayout>
                }
            />
            <Route
                path="/product/:id"
                element={
                    <MainLayout>
                        <ProductDetails />
                    </MainLayout>
                }
            />
            <Route
                path="/chat"
                element={
                    <MainLayout>
                        <BuyerChat />
                    </MainLayout>
                }
            />
            <Route
                path="/admin"
                element={
                    <MainLayout>
                        <AdminDashboard />
                    </MainLayout>
                }
            />
            <Route
                path="/admin/reports"
                element={
                    <MainLayout>
                        <Reports />
                    </MainLayout>
                }
            />
            <Route
                path="/checkout"
                element={
                    <MainLayout>
                        <ShippingForm />
                    </MainLayout>
                }
            />

            <Route
                path="/cart"
                element={
                    <MainLayout>
                        <Cart />
                    </MainLayout>
                }
            />
            <Route
                path="/wishlist"
                element={
                    <MainLayout>
                        <Wishlist />
                    </MainLayout>
                }
            />
            <Route
                path="/checkout"
                element={
                    <MainLayout>
                        <CheckoutPage />
                    </MainLayout>
                }
            />

            <Route
                path="/chat/:sellerId"
                element={
                    <MainLayout>
                        <BuyerChat />
                    </MainLayout>
                }
            />

            <Route
                path="/buyer/chat"
                element={
                    <MainLayout>
                        <BuyerChat />
                    </MainLayout>
                }
            />
            
            {/* Auth pages without Navbar */}
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<OtpVerify />} />
        </Routes>
    </Router>
);

export default AppRoutes;
