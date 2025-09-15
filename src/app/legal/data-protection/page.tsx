import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Protección de Datos | ZIVAH International S.A.',
  description:
    'Información sobre protección de datos personales según RGPD y leyes aplicables - ZIVAH International S.A.',
  keywords:
    'protección datos, RGPD, GDPR, derechos datos, privacidad, ZIVAH International',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://zivahinternational.com/legal/data-protection',
  },
  openGraph: {
    title: 'Protección de Datos | ZIVAH International S.A.',
    description: 'Sus derechos de protección de datos y cómo ejercitarlos.',
    url: 'https://zivahinternational.com/legal/data-protection',
    siteName: 'ZIVAH International S.A.',
    type: 'website',
  },
};

export default function DataProtectionPage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-16'>
      <div className='container mx-auto px-4 max-w-4xl'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Protección de Datos Personales
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300'>
            Última actualización:{' '}
            {new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Content */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8'>
          {/* Introduction */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              1. Responsable del Tratamiento
            </h2>
            <div className='bg-gray-50 dark:bg-gray-700 p-6 rounded-lg'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                ZIVAH International S.A.
              </h3>
              <p className='text-gray-700 dark:text-gray-300 mb-2'>
                <strong>Domicilio:</strong> Casa Matriz Mz 10 S L 31,
                Samborondón, Guayas, Ecuador
              </p>
              <p className='text-gray-700 dark:text-gray-300 mb-2'>
                <strong>RUC:</strong> [Número de RUC]
              </p>
              <p className='text-gray-700 dark:text-gray-300 mb-2'>
                <strong>Email:</strong> privacy@zivahinternational.com
              </p>
              <p className='text-gray-700 dark:text-gray-300'>
                <strong>Delegado de Protección de Datos:</strong>{' '}
                dpo@zivahinternational.com
              </p>
            </div>
          </section>

          {/* Legal Framework */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              2. Marco Legal
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              Esta política de protección de datos se basa en las siguientes
              normativas:
            </p>
            <ul className='list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2'>
              <li>
                <strong>Reglamento (UE) 2016/679 (RGPD):</strong> Para
                residentes de la Unión Europea
              </li>
              <li>
                <strong>
                  Ley Orgánica de Protección de Datos Personales (LOPD):
                </strong>{' '}
                Ecuador
              </li>
              <li>
                <strong>California Consumer Privacy Act (CCPA):</strong> Para
                residentes de California
              </li>
              <li>
                <strong>Normativas sectoriales:</strong> Aplicables al comercio
                internacional de alimentos
              </li>
            </ul>
          </section>

          {/* Data Processing Principles */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              3. Principios de Tratamiento de Datos
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              Tratamos sus datos personales de acuerdo con los siguientes
              principios:
            </p>
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg'>
                <h4 className='font-semibold text-green-900 dark:text-green-100 mb-2'>
                  Licitud, Lealtad y Transparencia
                </h4>
                <p className='text-green-800 dark:text-green-200 text-sm'>
                  Tratamos sus datos de forma legal, leal y transparente
                </p>
              </div>
              <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
                <h4 className='font-semibold text-blue-900 dark:text-blue-100 mb-2'>
                  Limitación de la Finalidad
                </h4>
                <p className='text-blue-800 dark:text-blue-200 text-sm'>
                  Recopilamos datos para fines específicos y legítimos
                </p>
              </div>
              <div className='bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg'>
                <h4 className='font-semibold text-purple-900 dark:text-purple-100 mb-2'>
                  Minimización de Datos
                </h4>
                <p className='text-purple-800 dark:text-purple-200 text-sm'>
                  Solo recopilamos los datos necesarios para nuestros fines
                </p>
              </div>
              <div className='bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg'>
                <h4 className='font-semibold text-orange-900 dark:text-orange-100 mb-2'>
                  Exactitud
                </h4>
                <p className='text-orange-800 dark:text-orange-200 text-sm'>
                  Mantenemos sus datos precisos y actualizados
                </p>
              </div>
              <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg'>
                <h4 className='font-semibold text-red-900 dark:text-red-100 mb-2'>
                  Limitación del Plazo de Conservación
                </h4>
                <p className='text-red-800 dark:text-red-200 text-sm'>
                  Conservamos sus datos solo durante el tiempo necesario
                </p>
              </div>
              <div className='bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg'>
                <h4 className='font-semibold text-indigo-900 dark:text-indigo-100 mb-2'>
                  Integridad y Confidencialidad
                </h4>
                <p className='text-indigo-800 dark:text-indigo-200 text-sm'>
                  Proteger sus datos contra el acceso no autorizado
                </p>
              </div>
            </div>
          </section>

          {/* Data Categories */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              4. Categorías de Datos Personales
            </h2>

            <h3 className='text-xl font-medium text-gray-900 dark:text-white mb-3'>
              4.1 Datos de Identificación
            </h3>
            <ul className='list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4'>
              <li>Nombre y apellidos</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Nombre de la empresa</li>
            </ul>

            <h3 className='text-xl font-medium text-gray-900 dark:text-white mb-3'>
              4.2 Datos de Contacto y Ubicación
            </h3>
            <ul className='list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4'>
              <li>Dirección postal</li>
              <li>País y ciudad de residencia</li>
              <li>Dirección IP</li>
            </ul>

            <h3 className='text-xl font-medium text-gray-900 dark:text-white mb-3'>
              4.3 Datos de Navegación
            </h3>
            <ul className='list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2'>
              <li>Páginas visitadas</li>
              <li>Tiempo de permanencia</li>
              <li>Preferencias de idioma</li>
              <li>Dispositivo y navegador utilizado</li>
            </ul>
          </section>

          {/* Legal Basis */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              5. Base Legal para el Tratamiento
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              Tratamos sus datos personales basándonos en las siguientes bases
              legales:
            </p>
            <ul className='list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2'>
              <li>
                <strong>Consentimiento:</strong> Para comunicaciones comerciales
                y cookies no esenciales
              </li>
              <li>
                <strong>Ejecución de contrato:</strong> Para procesar pedidos y
                cotizaciones
              </li>
              <li>
                <strong>Interés legítimo:</strong> Para mejorar nuestros
                servicios y prevenir fraudes
              </li>
              <li>
                <strong>Cumplimiento de obligaciones legales:</strong> Para
                cumplir con regulaciones aplicables
              </li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              6. Plazos de Conservación
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              Conservamos sus datos personales durante los siguientes períodos:
            </p>
            <ul className='list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2'>
              <li>
                <strong>Datos de clientes activos:</strong> Durante la relación
                comercial y 5 años después
              </li>
              <li>
                <strong>Datos de cotizaciones:</strong> 3 años desde la última
                actividad
              </li>
              <li>
                <strong>Datos de marketing:</strong> Hasta que retire su
                consentimiento
              </li>
              <li>
                <strong>Datos de navegación:</strong> 2 años para análisis
                estadísticos
              </li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              7. Sus Derechos como Titular de Datos
            </h2>

            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    ✅ Derecho de Acceso
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    Solicitar copia de sus datos personales que tratamos
                  </p>
                </div>

                <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    ✏️ Derecho de Rectificación
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    Corregir datos inexactos o incompletos
                  </p>
                </div>

                <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    🗑️ Derecho de Supresión
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    Solicitar eliminación de sus datos (&quot;Derecho al
                    olvido&quot;)
                  </p>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    📤 Derecho de Portabilidad
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    Obtener sus datos en formato estructurado
                  </p>
                </div>

                <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    🚫 Derecho de Oposición
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    Oponerse al tratamiento de sus datos
                  </p>
                </div>

                <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    ⏸️ Derecho de Limitación
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    Limitar el tratamiento de sus datos
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How to Exercise Rights */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              8. Cómo Ejercer sus Derechos
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              Para ejercer cualquiera de sus derechos, puede contactarnos a
              través de:
            </p>

            <div className='bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800'>
              <h4 className='font-semibold text-blue-900 dark:text-blue-100 mb-4'>
                Formas de Contacto
              </h4>
              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <h5 className='font-medium text-blue-900 dark:text-blue-100 mb-2'>
                    Por Email
                  </h5>
                  <p className='text-blue-800 dark:text-blue-200 text-sm mb-2'>
                    privacy@zivahinternational.com
                  </p>
                  <p className='text-blue-800 dark:text-blue-200 text-sm'>
                    Responderemos en un plazo máximo de 30 días
                  </p>
                </div>
                <div>
                  <h5 className='font-medium text-blue-900 dark:text-blue-100 mb-2'>
                    Por Correo Postal
                  </h5>
                  <p className='text-blue-800 dark:text-blue-200 text-sm'>
                    ZIVAH International S.A.
                    <br />
                    Casa Matriz Mz 10 S L 31
                    <br />
                    Samborondón, Guayas, Ecuador
                  </p>
                </div>
              </div>
            </div>

            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mt-4'>
              Para verificar su identidad, podremos solicitarle información
              adicional. Todos los derechos se ejercen de forma gratuita, salvo
              que las solicitudes sean manifiestamente infundadas o excesivas.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              9. Medidas de Seguridad
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              Implementamos medidas técnicas y organizativas apropiadas para
              proteger sus datos:
            </p>
            <ul className='list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2'>
              <li>
                <strong>Encriptación:</strong> Datos en tránsito y en reposo
              </li>
              <li>
                <strong>Control de acceso:</strong> Principio de mínimo
                privilegio
              </li>
              <li>
                <strong>Monitoreo continuo:</strong> Detección de amenazas y
                vulnerabilidades
              </li>
              <li>
                <strong>Copias de seguridad:</strong> Regulares y seguras
              </li>
              <li>
                <strong>Capacitación:</strong> Personal formado en protección de
                datos
              </li>
            </ul>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              10. Transferencias Internacionales
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
              Sus datos pueden transferirse a países fuera del Espacio Económico
              Europeo (EEE). En estos casos, garantizamos que las transferencias
              cumplan con las garantías adecuadas establecidas por la
              legislación aplicable, incluyendo cláusulas contractuales tipo o
              decisiones de adecuación de la Comisión Europea.
            </p>
          </section>

          {/* Complaints */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              11. Reclamaciones
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              Si considera que el tratamiento de sus datos personales no cumple
              con la normativa aplicable, tiene derecho a presentar una
              reclamación ante la autoridad de control competente:
            </p>
            <ul className='list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2'>
              <li>
                <strong>En Ecuador:</strong> Agencia de Regulación y Control de
                las Telecomunicaciones (ARCOTEL)
              </li>
              <li>
                <strong>En la UE:</strong> Autoridad de Protección de Datos de
                su país de residencia
              </li>
              <li>
                <strong>En España:</strong> Agencia Española de Protección de
                Datos (AEPD)
              </li>
            </ul>
          </section>

          {/* Updates */}
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
              12. Actualizaciones
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
              Esta política puede actualizarse para reflejar cambios en nuestras
              prácticas o en la legislación aplicable. Le informaremos sobre
              cambios significativos mediante un aviso destacado en nuestro
              sitio web o enviando una comunicación directa.
            </p>
          </section>
        </div>

        {/* Back to Home */}
        <div className='text-center mt-8'>
          <Link
            href='/'
            className='inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors'
          >
            ← Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
