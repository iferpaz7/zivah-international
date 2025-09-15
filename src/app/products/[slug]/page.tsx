import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

// This would typically come from your database/API
const getProduct = async (slug: string) => {
  // Mock data - replace with actual API call
  const mockProducts = {
    'camaron-vannamei': {
      id: 1,
      name: 'Camarón Vannamei Premium',
      slug: 'camaron-vannamei',
      description: 'Camarón Vannamei de la más alta calidad, cultivado en aguas controladas de Ecuador. Con certificaciones internacionales BAP, HACCP y GlobalGAP.',
      shortDescription: 'Camarón blanco ecuatoriano premium con certificación internacional',
      specifications: {
        tamaño: '16/20, 21/25, 26/30, 31/35 por libra',
        presentación: 'Congelado IQF, cabeza on/off',
        origen: 'Ecuador - Provincia de Guayas',
        temporada: 'Todo el año'
      },
      basePrice: 8.50,
      priceUnit: 'USD/kg',
      stockQuantity: 50000,
      minOrderQty: 1000,
      certifications: ['BAP', 'HACCP', 'GlobalGAP', 'BRC'],
      harvestSeason: 'Todo el año',
      origin: 'Ecuador',
      nutritionalInfo: {
        proteína: '20.4g por 100g',
        grasa: '1.2g por 100g',
        calorías: '85 kcal por 100g'
      },
      imageUrl: '/assets/images/products/camaron-vannamei.jpg',
      category: {
        name: 'Productos del Mar',
        slug: 'productos-mar'
      },
      seoTitle: 'Camarón Vannamei Premium Ecuador | ZIVAH International',
      seoDescription: 'Camarón Vannamei congelado premium de Ecuador. Certificado BAP, HACCP, GlobalGAP. Exportación directa desde Guayas.'
    },
    'cafe-arabica': {
      id: 2,
      name: 'Café Arábica de Altura',
      slug: 'cafe-arabica',
      description: 'Café arábica premium cultivado en las alturas de Ecuador. Con notas florales y acidez balanceada, perfecto para el mercado internacional.',
      shortDescription: 'Café arábica ecuatoriano de altura premium',
      specifications: {
        tipo: 'Arábica 100%',
        altura: '1,200 - 1,800 metros sobre el nivel del mar',
        proceso: 'Lavado natural',
        tueste: 'Disponible en verde o tostado'
      },
      basePrice: 4.20,
      priceUnit: 'USD/kg',
      stockQuantity: 25000,
      minOrderQty: 500,
      certifications: ['Orgánico', 'Comercio Justo', 'Rainforest Alliance'],
      harvestSeason: 'Marzo - Agosto',
      origin: 'Ecuador - Sierra',
      nutritionalInfo: {
        cafeína: '95mg por taza (240ml)',
        antioxidantes: 'Alto contenido',
        origen: '100% Arábica'
      },
      imageUrl: '/assets/images/products/cafe-arabica.jpg',
      category: {
        name: 'Café',
        slug: 'cafe'
      },
      seoTitle: 'Café Arábica Ecuador Premium | ZIVAH International',
      seoDescription: 'Café arábica de altura ecuatoriano premium. Certificado orgánico y Comercio Justo. Exportación directa desde Ecuador.'
    }
  }

  return mockProducts[slug as keyof typeof mockProducts] || null
}

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: 'Producto no encontrado | ZIVAH International'
    }
  }

  return {
    title: product.seoTitle || `${product.name} | ZIVAH International`,
    description: product.seoDescription || product.shortDescription,
    keywords: `${product.name}, ${product.category.name}, Ecuador, exportación, premium`,
    openGraph: {
      title: product.seoTitle || `${product.name} | ZIVAH International`,
      description: product.seoDescription || product.shortDescription,
      images: product.imageUrl ? [product.imageUrl] : [],
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-green-600 dark:hover:text-green-400">
                Inicio
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/#productos" className="hover:text-green-600 dark:hover:text-green-400">
                Productos
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/#${product.category.slug}`} className="hover:text-green-600 dark:hover:text-green-400">
                {product.category.name}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white font-medium">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    📦
                  </div>
                )}
              </div>

              {/* Certifications */}
              {product.certifications && product.certifications.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-sm font-medium rounded-full"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {product.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {product.shortDescription}
                </p>
              </div>

              {/* Price */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Precio base:</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${product.basePrice.toFixed(2)} {product.priceUnit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Cantidad mínima:</span>
                  <span className="font-medium">{product.minOrderQty} {product.priceUnit.split('/')[1]}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Stock disponible:</span>
                  <span className="font-medium">{product.stockQuantity.toLocaleString()} {product.priceUnit.split('/')[1]}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-4">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Solicitar Cotización
                </button>
                <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Contactar
                </button>
              </div>

              {/* Origin & Season */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Origen:</span>
                  <p className="text-gray-600 dark:text-gray-400">{product.origin}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Temporada:</span>
                  <p className="text-gray-600 dark:text-gray-400">{product.harvestSeason}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Descripción del Producto
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {product.specifications && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Especificaciones Técnicas
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutritional Info */}
            {product.nutritionalInfo && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Información Nutricional
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Quote Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Cotización Rápida
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cantidad requerida
                  </label>
                  <input
                    type="number"
                    min={product.minOrderQty}
                    placeholder={`Mínimo ${product.minOrderQty}`}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    País de destino
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>Estados Unidos</option>
                    <option>Unión Europea</option>
                    <option>Canadá</option>
                    <option>Otros</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Solicitar Cotización
                </button>
              </form>
            </div>

            {/* Related Products */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Productos Relacionados
              </h3>
              <div className="space-y-3">
                <Link
                  href="/products/cafe-arabica"
                  className="block p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">Café Arábica Premium</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Desde Ecuador</div>
                </Link>
                <Link
                  href="/products/camaron-vannamei"
                  className="block p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">Camarón Vannamei</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Certificado BAP</div>
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
                ¿Necesita más información?
              </h3>
              <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
                <p>📧 sales@zivahinternational.com</p>
                <p>📱 +1 (305) XXX-XXXX</p>
                <p>🏢 Samborondón, Guayas, Ecuador</p>
              </div>
              <Link
                href="/#contacto"
                className="inline-block mt-4 text-green-600 dark:text-green-400 hover:underline font-medium"
              >
                Contactar ahora →
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Products */}
        <div className="text-center mt-12">
          <Link
            href="/#todos-productos"
            className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
          >
            ← Ver todos los productos
          </Link>
        </div>
      </div>
    </div>
  )
}