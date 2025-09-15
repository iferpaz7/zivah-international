'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { updateConsent } from './Analytics';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    const consentDate = localStorage.getItem('cookie-consent-date');

    if (!consent) {
      // Show banner if no consent given
      setShowBanner(true);
    } else if (consentDate) {
      // Check if consent is older than 12 months (GDPR requirement)
      const consentDateTime = new Date(consentDate);
      const now = new Date();
      const monthsDiff =
        (now.getTime() - consentDateTime.getTime()) /
        (1000 * 60 * 60 * 24 * 30);

      if (monthsDiff > 12) {
        // Consent expired, show banner again
        localStorage.removeItem('cookie-consent');
        localStorage.removeItem('cookie-consent-date');
        localStorage.removeItem('cookie-preferences');
        setShowBanner(true);
      } else {
        // Load existing preferences
        const savedPreferences = localStorage.getItem('cookie-preferences');
        if (savedPreferences) {
          setPreferences(JSON.parse(savedPreferences));
        }
      }
    }
  }, []);

  const acceptAllCookies = () => {
    const allPreferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };

    setPreferences(allPreferences);
    saveConsent(allPreferences);
    setShowBanner(false);

    // Initialize tracking if accepted
    initializeTracking(allPreferences);
  };

  const acceptNecessaryOnly = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };

    setPreferences(necessaryOnly);
    saveConsent(necessaryOnly);
    setShowBanner(false);
  };

  const saveCustomPreferences = () => {
    saveConsent(preferences);
    setShowBanner(false);
    setShowPreferences(false);

    // Initialize tracking based on preferences
    initializeTracking(preferences);
  };

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    localStorage.setItem('cookie-preferences', JSON.stringify(prefs));
  };

  const initializeTracking = (prefs: CookiePreferences) => {
    // Update consent through Analytics component
    updateConsent({
      analytics: prefs.analytics,
      marketing: prefs.marketing,
      functional: prefs.functional,
    });

    // Initialize functional cookies if accepted
    if (prefs.functional) {
      // Enable functional features like theme preference saving
      localStorage.setItem('functional-cookies-enabled', 'true');
    }
  };

  const updatePreference = (type: keyof CookiePreferences, value: boolean) => {
    if (type === 'necessary') return; // Cannot disable necessary cookies

    setPreferences(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className='fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex flex-col lg:flex-row items-start lg:items-center gap-4'>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='text-2xl'>🍪</div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  Cookies en ZIVAH International
                </h3>
              </div>
              <p className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed'>
                Utilizamos cookies para mejorar su experiencia, analizar el
                tráfico y personalizar el contenido. Al continuar navegando,
                acepta nuestro uso de cookies según nuestra{' '}
                <Link
                  href='/legal/cookie-policy'
                  className='text-green-600 dark:text-green-400 hover:underline'
                >
                  Política de Cookies
                </Link>
                .
              </p>
            </div>

            <div className='flex flex-col sm:flex-row gap-3 lg:ml-6'>
              <button
                onClick={() => setShowPreferences(true)}
                className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors'
              >
                Gestionar Preferencias
              </button>
              <button
                onClick={acceptNecessaryOnly}
                className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors'
              >
                Solo Necesarias
              </button>
              <button
                onClick={acceptAllCookies}
                className='px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors'
              >
                Aceptar Todas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  Preferencias de Cookies
                </h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                >
                  ✕
                </button>
              </div>

              <div className='space-y-6'>
                {/* Necessary Cookies */}
                <div className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='font-semibold text-gray-900 dark:text-white'>
                      Cookies Necesarias
                    </h4>
                    <span className='text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded'>
                      Siempre activas
                    </span>
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
                    Estas cookies son esenciales para el funcionamiento del
                    sitio web y no pueden ser desactivadas.
                  </p>
                  <div className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={preferences.necessary}
                      disabled
                      className='mr-3'
                    />
                    <span className='text-sm text-gray-700 dark:text-gray-300'>
                      Necesarias
                    </span>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='font-semibold text-gray-900 dark:text-white'>
                      Cookies de Análisis
                    </h4>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={preferences.analytics}
                        onChange={e =>
                          updatePreference('analytics', e.target.checked)
                        }
                        className='sr-only peer'
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Nos ayudan a entender cómo los visitantes interactúan con
                    nuestro sitio web mediante la recopilación de información de
                    forma anónima.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='font-semibold text-gray-900 dark:text-white'>
                      Cookies Funcionales
                    </h4>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={preferences.functional}
                        onChange={e =>
                          updatePreference('functional', e.target.checked)
                        }
                        className='sr-only peer'
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Permiten recordar sus preferencias y configuraciones para
                    mejorar su experiencia de navegación.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='font-semibold text-gray-900 dark:text-white'>
                      Cookies de Marketing
                    </h4>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={preferences.marketing}
                        onChange={e =>
                          updatePreference('marketing', e.target.checked)
                        }
                        className='sr-only peer'
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Se utilizan para mostrar anuncios relevantes y medir la
                    efectividad de nuestras campañas publicitarias.
                  </p>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
                <button
                  onClick={acceptNecessaryOnly}
                  className='flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors'
                >
                  Solo Necesarias
                </button>
                <button
                  onClick={saveCustomPreferences}
                  className='flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors'
                >
                  Guardar Preferencias
                </button>
              </div>

              <p className='text-xs text-gray-500 dark:text-gray-400 mt-4 text-center'>
                Para más información, consulte nuestra{' '}
                <Link
                  href='/legal/cookie-policy'
                  className='text-green-600 dark:text-green-400 hover:underline'
                >
                  Política de Cookies
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
