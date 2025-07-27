'use client'

import * as React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AppInput from '../components/ui/AppInput';
import { useLanguage } from '../contexts/LanguageContext'; // Import useLanguage

const LoginPage = () => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [clientIdInput, setClientIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const navigate = useNavigate();
  const { loginCustomer, loginAdmin } = useAuth();
  const { t } = useLanguage(); // Use translation hook

  const handleMouseMove = (e: React.MouseEvent) => {
    // Calculate mouse position relative to the entire card for the blur effect
    const cardRect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - cardRect.left,
      y: e.clientY - cardRect.top
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (showAdminLogin) {
      // Admin Login Check
      if (adminUsername === 'admin' && adminPassword === 'admin') {
        loginAdmin();
        navigate('/admin');
        return;
      } else {
        setError(t('loginPage.invalidAdminCredentials'));
        return;
      }
    } else {
      // Customer Login Check
      if (clientIdInput && passwordInput) {
        const customerLoginSuccess = await loginCustomer(clientIdInput, passwordInput);
        if (customerLoginSuccess) {
          navigate('/dashboard');
          return;
        } else {
          setError(t('loginPage.invalidCredentials'));
          return;
        }
      }
    }

    setError(t('loginPage.errorMessage'));
  };

  const toggleLoginMode = () => {
    setShowAdminLogin(!showAdminLogin);
    setError('');
    setClientIdInput('');
    setPasswordInput('');
    setAdminUsername('');
    setAdminPassword('');
  };

  return (
    <div className="h-screen w-[100%] bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div
        className='card w-[80%] lg:w-[70%] md:w-[55%] flex justify-between min-h-[600px] max-h-[90vh] relative'
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Large blur effect moved here, as a direct child of the card */}
        <div
          className={`absolute pointer-events-none w-[500px] h-[500px] bg-gradient-to-r from-purple-300/30 via-blue-300/30 to-pink-300/30 rounded-full blur-3xl transition-opacity duration-200 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: `translate(${mousePosition.x - 250}px, ${mousePosition.y - 250}px)`,
            transition: 'transform 0.1s ease-out',
            zIndex: 0, // Ensure it's behind the panels
          }}
        />
        <div
          className='w-full lg:w-1/2 px-4 lg:px-16 left h-full relative z-10 flex flex-col' // Removed bg-[var(--color-surface)]
        >
          <div className="form-container sign-in-container flex-grow overflow-y-auto py-10 md:py-20">
            {/* Logo added here */}
            <img
              src="https://agency.creato.digital/wp-content/uploads/2023/05/creato-ai-wlogo.png"
              alt="Creato AI Logo"
              className="w-32 h-auto mx-auto mb-6" // Small size, auto height, centered, margin-bottom
            />
            <form className='text-center grid gap-2 h-full' onSubmit={handleSubmit}>
              {/* Title Section */}
              <div className='grid gap-4 md:gap-6 mb-2'>
                <h1 className='text-3xl md:text-4xl font-extrabold'>{t('loginPage.title')}</h1>
              </div>

              {/* Login Inputs Section */}
              <div className='grid gap-4 items-center mt-4'>
                {!showAdminLogin ? (
                  <>
                    <h2 className='text-xl font-bold mt-4'>{t('loginPage.customerLogin')}</h2>
                    <AppInput
                      id="clientId"
                      name="clientId"
                      placeholder={t('loginPage.clientId')}
                      type="text"
                      value={clientIdInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientIdInput(e.target.value)}
                    />
                    <AppInput
                      id="password"
                      name="password"
                      placeholder={t('loginPage.password')}
                      type="password"
                      value={passwordInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordInput(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <h2 className='text-xl font-bold mt-4'>{t('loginPage.adminLogin')}</h2>
                    <AppInput
                      id="adminUsername"
                      name="adminUsername"
                      placeholder={t('loginPage.adminUsername')}
                      type="text"
                      value={adminUsername}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdminUsername(e.target.value)}
                    />
                    <AppInput
                      id="adminPassword"
                      name="adminPassword"
                      placeholder={t('loginPage.adminPassword')}
                      type="password"
                      value={adminPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdminPassword(e.target.value)}
                    />
                  </>
                )}
              </div>

              {/* Error message */}
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}

              {/* Help/Forgot password link */}
              <p className='font-normal text-base text-[var(--color-text-secondary)]'>
                {t('loginPage.helpText')} <a href="mailto:merhaba@creato.digital" className="text-blue-400 hover:underline">merhaba@creato.digital</a>
              </p>

              {/* Sign In button */}
              <div className='flex gap-4 justify-center items-center'>
                 <button
                  type="submit"
                  className="group/button relative inline-flex justify-center items-center overflow-hidden rounded-md bg-[var(--color-border)] px-4 py-1.5 text-xs font-normal text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[var(--color-text-primary)] cursor-pointer"
                >
                <span className="text-sm px-2 py-1">{t('loginPage.signIn')}</span>
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/20" />
                </div>
              </button>
              </div>

              {/* Toggle Login Mode Button */}
              <button
                type="button"
                onClick={toggleLoginMode}
                className="mt-4 text-sm text-blue-400 hover:underline focus:outline-none"
              >
                {showAdminLogin ? t('loginPage.switchCustomerLogin') : t('loginPage.switchAdminLogin')}
              </button>

            </form>
          </div>
        </div>
        <div className='hidden lg:block w-1/2 right h-full overflow-hidden z-10'> {/* Removed bg-[var(--color-surface)] */}
            <img
              src='https://images.pexels.com/photos/7102037/pexels-photo-7102037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              alt="Carousel image"
              className="w-full h-full object-cover transition-transform duration-300 opacity-30"
            />
       </div>
      </div>
    </div>
  )
}

export default LoginPage;
