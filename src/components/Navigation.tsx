'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import ThemeToggle from './ThemeToggle';

interface NavigationProps {
  onScrollToSection?: (sectionId: string) => void;
}

export default function Navigation({ onScrollToSection }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle section detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'productos', 'todos-productos', 'calidad', 'cotizar', 'contacto'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navigation height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigationItems = [
    { id: 'home', label: 'Inicio', icon: '🏠' },
    { id: 'productos', label: 'Productos', icon: '📦' },
    { id: 'todos-productos', label: 'Catálogo', icon: '📋' },
    { id: 'calidad', label: 'Calidad', icon: '⭐' },
    { id: 'cotizar', label: 'Cotizar', icon: '💰' },
    { id: 'contacto', label: 'Contacto', icon: '📞' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
          : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm'
      }`}
    >
      <nav className='container mx-auto px-4 py-3'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <div
            className='flex items-center space-x-2 cursor-pointer transition-transform hover:scale-105'
            onClick={handleLogoClick}
          >
            <Image
              src='/assets/images/zivah-logo.svg'
              alt='ZIVAH International S.A.'
              width={120}
              height={40}
              priority
            />
          </div>

          {/* Desktop Navigation */}
          <div className='hidden lg:flex items-center space-x-1'>
            {navigationItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'text-accent bg-accent/10 dark:bg-accent/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-accent hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className='mr-2'>{item.icon}</span>
                {item.label}
                {activeSection === item.id && (
                  <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full'></div>
                )}
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className='flex items-center space-x-3'>
            {/* Language Selector */}
            <div className='hidden md:block'>
              <select className='px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'>
                <option value='es'>🇪🇨 ES</option>
                <option value='en'>🇺🇸 EN</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* CTA Button */}
            <button
              onClick={() => scrollToSection('cotizar')}
              className='hidden md:inline-flex items-center bg-accent hover:bg-dark-accent text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg'
            >
              <span className='mr-2'>💬</span>
              Cotizar
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-accent transition-colors'
              aria-label='Toggle mobile menu'
            >
              <div className='w-6 h-6 flex flex-col justify-center items-center'>
                <span
                  className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4'>
            {/* Mobile Navigation Items */}
            <div className='space-y-2'>
              {navigationItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeSection === item.id
                      ? 'text-accent bg-accent/10'
                      : 'text-gray-700 dark:text-gray-300 hover:text-accent hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className='mr-3'>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className='mt-6 pt-4 border-t border-gray-200 dark:border-gray-700'>
              <div className='flex items-center justify-between mb-4'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Idioma:
                </span>
                <select className='px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'>
                  <option value='es'>🇪🇨 Español</option>
                  <option value='en'>🇺🇸 English</option>
                </select>
              </div>

              <button
                onClick={() => scrollToSection('cotizar')}
                className='w-full bg-accent hover:bg-dark-accent text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-md'
              >
                <span className='mr-2'>💬</span>
                Solicitar Cotización
              </button>
            </div>

            {/* Quick Links */}
            <div className='mt-6 pt-4 border-t border-gray-200 dark:border-gray-700'>
              <div className='grid grid-cols-2 gap-3'>
                <Link
                  href='/legal/privacy-policy'
                  className='text-sm text-gray-600 dark:text-gray-400 hover:text-accent transition-colors'
                >
                  Privacidad
                </Link>
                <Link
                  href='/legal/terms-of-service'
                  className='text-sm text-gray-600 dark:text-gray-400 hover:text-accent transition-colors'
                >
                  Términos
                </Link>
                <Link
                  href='/legal/cookie-policy'
                  className='text-sm text-gray-600 dark:text-gray-400 hover:text-accent transition-colors'
                >
                  Cookies
                </Link>
                <Link
                  href='/legal/data-protection'
                  className='text-sm text-gray-600 dark:text-gray-400 hover:text-accent transition-colors'
                >
                  Protección Datos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
