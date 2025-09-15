import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad | ZIVAH International S.A.',
  description: 'Política de privacidad de ZIVAH International S.A. - Cómo recopilamos, usamos y protegemos su información personal.',
  keywords: 'política privacidad, protección datos, GDPR, RGPD, datos personales, ZIVAH International',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://zivahinternational.com/legal/privacy-policy',
  },
  openGraph: {
    title: 'Política de Privacidad | ZIVAH International S.A.',
    description: 'Cómo protegemos su información personal y cumplimos con las normativas de privacidad.',
    url: 'https://zivahinternational.com/legal/privacy-policy',
    siteName: 'ZIVAH International S.A.',
    type: 'website',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Política de Privacidad
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Última actualización: {new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Introducción
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              ZIVAH International S.A. (&quot;nosotros&quot;, &quot;nuestro&quot; o &quot;ZIVAH&quot;) se compromete a proteger su privacidad y sus datos personales.
              Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando utiliza nuestro sitio web
              y nuestros servicios.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Información que Recopilamos
            </h2>

            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
              2.1 Información que Usted Nos Proporciona
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Nombre y apellidos</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Nombre de la empresa</li>
              <li>Dirección de envío y facturación</li>
              <li>Información de productos de interés</li>
              <li>Cualquier otra información que nos proporcione voluntariamente</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
              2.2 Información Recopilada Automáticamente
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Dirección IP y ubicación geográfica</li>
              <li>Tipo de navegador y versión</li>
              <li>Sistema operativo</li>
              <li>Páginas visitadas y tiempo de permanencia</li>
              <li>Referencias de origen</li>
              <li>Cookies y tecnologías similares</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Cómo Utilizamos su Información
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Utilizamos la información recopilada para los siguientes propósitos:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Procesar y gestionar sus solicitudes de cotización</li>
              <li>Proporcionar información sobre nuestros productos y servicios</li>
              <li>Mejorar nuestro sitio web y servicios</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
              <li>Enviar comunicaciones comerciales (con su consentimiento)</li>
              <li>Prevenir fraudes y mantener la seguridad</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Compartir su Información
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en las siguientes situaciones:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Con su consentimiento expreso</li>
              <li>Con proveedores de servicios que nos ayudan a operar (bajo acuerdos de confidencialidad)</li>
              <li>Cuando sea requerido por ley o para proteger nuestros derechos</li>
              <li>En caso de fusión, adquisición o venta de activos</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Seguridad de los Datos
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Implementamos medidas de seguridad técnicas, administrativas y físicas apropiadas para proteger su información personal
              contra acceso no autorizado, alteración, divulgación o destrucción. Estas medidas incluyen:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-4">
              <li>Encriptación SSL/TLS para transmisiones de datos</li>
              <li>Almacenamiento seguro de datos con acceso restringido</li>
              <li>Monitoreo continuo de sistemas y redes</li>
              <li>Actualizaciones regulares de seguridad</li>
              <li>Capacitación del personal en seguridad de datos</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Cookies y Tecnologías Similares
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio web.
              Para más información sobre cómo utilizamos las cookies, consulte nuestra{' '}
              <a href="/legal/cookie-policy" className="text-green-600 dark:text-green-400 hover:underline">
                Política de Cookies
              </a>.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Sus Derechos
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              De acuerdo con las leyes aplicables de protección de datos, usted tiene los siguientes derechos:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Derecho de acceso:</strong> Solicitar una copia de sus datos personales</li>
              <li><strong>Derecho de rectificación:</strong> Corregir información inexacta</li>
              <li><strong>Derecho de supresión:</strong> Solicitar la eliminación de sus datos</li>
              <li><strong>Derecho a la portabilidad:</strong> Obtener sus datos en formato estructurado</li>
              <li><strong>Derecho de oposición:</strong> Oponerse al procesamiento de sus datos</li>
              <li><strong>Derecho a la limitación:</strong> Limitar el procesamiento de sus datos</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Contacto
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos,
              puede contactarnos a través de:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Oficina Principal</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    ZIVAH International S.A.<br />
                    Casa Matriz Mz 10 S L 31<br />
                    Samborondón, Guayas, Ecuador<br />
                    Email: privacy@zivahinternational.com
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Oficina de Distribución</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    ZIVAH International<br />
                    Miami, Florida, Estados Unidos<br />
                    Email: privacy@zivahinternational.com
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Actualizaciones de esta Política
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios significativos
              mediante un aviso destacado en nuestro sitio web o enviando un correo electrónico. El uso continuado de
              nuestros servicios después de dichos cambios constituye su aceptación de la política actualizada.
            </p>
          </section>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
          >
            ← Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}