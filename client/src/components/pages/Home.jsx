import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import '../../assets/styles/Home.css';
import Navbar from '../common/Navbar';

const Home = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero">
        <h2 className="hero-heading">
          <Trans i18nKey="heroTitle">
            Empowering Handloom Sellers with <span>Digital Simplicity</span>
          </Trans>
        </h2>

        <p>{t('heroDescription')}</p>

        <div className="hero-buttons">
          <button className="seller" onClick={() => navigate('/login')}>
            {t('seller')}
          </button>
          <button className="buyer" onClick={() => navigate('/login')}>
            {t('buyer')}
          </button>
        </div>
      </div>

      <footer className="footer">
        © 2025 Handloom Connect. {t('footerTagline')}
      </footer>

    </div>
  );
};

export default Home;
