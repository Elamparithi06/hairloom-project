import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaUser } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const updateCounts = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setCartCount(cart.length);
    setWishlistCount(wishlist.length);
  };

  useEffect(() => {
    updateCounts(); // On load

    // Listen for custom events
    window.addEventListener('cartChanged', updateCounts);
    window.addEventListener('wishlistChanged', updateCounts);

    // Clean up
    return () => {
      window.removeEventListener('cartChanged', updateCounts);
      window.removeEventListener('wishlistChanged', updateCounts);
    };
  }, []);

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    setLoggedIn(!!role);
    setUserRole(role);
    updateCounts();
  }, [location]);

  useEffect(() => {
    const handleStorageChange = () => {
      const role = sessionStorage.getItem('userRole');
      setLoggedIn(!!role);
      setUserRole(role);
      updateCounts();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
    toast.info(`Language switched to ${lng.toUpperCase()}`, { position: "bottom-right" });
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setLoggedIn(false);
    setUserRole(null);
    toast.success("Logged out successfully!", { position: "bottom-right" });
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <h1>🧵 Handloom Connect</h1>

        <div className="navbar-right">

          {!loggedIn && location.pathname === '/' && (
            <select
              onChange={(e) => changeLang(e.target.value)}
              defaultValue={localStorage.getItem('lang') || 'en'}
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="hi">हिन्दी</option>
            </select>
          )}

          {loggedIn ? (
            <>
              {userRole === 'seller' && (
                <>
                  <button onClick={() => navigate('/seller/dashboard')}>Upload Product</button>
                  <button onClick={() => navigate('/seller/dashboard?tab=view')}>View Products</button>
                  <button onClick={() => navigate('/seller/dashboard?tab=chat')}>Buyer Requests</button>
                </>
              )}

              {userRole === 'buyer' && (
                <>
                  <button onClick={() => navigate('/products')}>Products</button>

                  <button onClick={() => navigate('/wishlist')}>
                    ❤️ Wishlist <span className="badge">{wishlistCount}</span>
                  </button>

                  <button onClick={() => navigate('/cart')}>
                    🛒 Cart <span className="badge">{cartCount}</span>
                  </button>

                  {/* <button onClick={() => navigate('/buyer/chat')}>
                    💬 Chat
                  </button> ✅ Chat button added here */}
                </>
              )}


              <button onClick={handleLogout}>Logout</button>

              <div className="profile-icon" title="User Profile">
                <FaUser size={20} style={{ marginLeft: '10px', cursor: 'pointer' }} />
              </div>
            </>
          ) : (
            location.pathname === '/' && (
              <button onClick={() => navigate('/login')}>Login</button>
            )
          )}
        </div>
      </nav>

      <ToastContainer />
    </>
  );
};

export default Navbar;
