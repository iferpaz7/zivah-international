'use client';

import Navigation from '@/components/Navigation';
import QuoteForm from '@/components/QuoteForm';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Types for our data
interface Category {
  id: number; // Changed from string to number
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: number; // Changed from string to number
  name: string;
  slug: string;
  categoryId: number | null;
  description?: string;
  shortDescription?: string;
  sku?: string;
  specifications?: any;
  basePrice?: number;
  priceUnit?: string;
  stockQuantity: number;
  minOrderQty?: number;
  imageUrl?: string;
  imageGallery?: any;
  origin: string;
  harvestSeason?: string;
  certifications?: string[];
  nutritionalInfo?: any;
  isActive: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navigation height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // Handle logo click to reload page/scroll to top
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Optional: Also reload the page if you want
    // window.location.reload()
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products'),
        ]);

        if (categoriesRes.ok && productsRes.ok) {
          const categoriesData = await categoriesRes.json();
          const productsData = await productsRes.json();

          // Handle the API response structure
          const categories = categoriesData.data || categoriesData || [];
          const products = productsData.data || productsData || [];

          // Process products to ensure proper typing
          const processedProducts = products.map((product: any) => ({
            ...product,
            basePrice: product.basePrice ? parseFloat(product.basePrice) : null,
            certifications: Array.isArray(product.certifications)
              ? product.certifications
              : [],
          }));

          setCategories(Array.isArray(categories) ? categories : []);
          setProducts(
            Array.isArray(processedProducts) ? processedProducts : []
          );
          setFilteredProducts(
            Array.isArray(processedProducts) ? processedProducts : []
          );
        } else {
          console.error('API responses not ok:', {
            categoriesRes: categoriesRes.status,
            productsRes: productsRes.status,
          });
          setCategories([]);
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategories([]);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products by category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products || []);
    } else {
      const filtered = (products || []).filter(
        product => product.category?.slug === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  return (
    <div className='min-h-screen'>
      {/* Enhanced Navigation */}
      <Navigation onScrollToSection={scrollToSection} />

      {/* Hero Section */}
      <section
        className='pt-28 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 py-20'
        id='home'
      >
        <div className='container mx-auto px-4'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <div>
              <div className='inline-block bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6'>
                🇪🇨 Desde Ecuador Hacia el Mundo - Samborondón, Guayas
              </div>

              <h1 className='text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight'>
                Los Mejores Productos{' '}
                <span className='text-green-600 dark:text-green-400'>
                  Ecuatorianos
                </span>{' '}
                para Mercados Internacionales
              </h1>

              <p className='text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed'>
                Desde Ecuador hacia el mundo, conectamos la excelencia
                ecuatoriana con compradores globales. Con sede principal en
                Samborondón, Guayas y oficina de distribución en Miami, somos
                especialistas en acuicultura, larvas de camarón, cultivo de
                árboles frutales y productos premium ecuatorianos.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 mb-12'>
                <button
                  onClick={() => scrollToSection('productos')}
                  className='bg-green-600 dark:bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-center font-medium'
                >
                  Explorar Productos
                </button>
                <button
                  onClick={() => scrollToSection('cotizar')}
                  className='border-2 border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 px-8 py-4 rounded-lg hover:bg-green-600 dark:hover:bg-green-500 hover:text-white transition-colors text-center font-medium'
                >
                  Solicitar Cotización
                </button>
              </div>

              <div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-green-600 dark:text-green-400'>
                    8+
                  </div>
                  <div className='text-gray-600 dark:text-gray-400'>
                    Países Atendidos
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-green-600 dark:text-green-400'>
                    50+
                  </div>
                  <div className='text-gray-600 dark:text-gray-400'>
                    Contenedores/Año
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-green-600 dark:text-green-400'>
                    4+
                  </div>
                  <div className='text-gray-600 dark:text-gray-400'>
                    Años de Experiencia
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-green-600 dark:text-green-400'>
                    99.8%
                  </div>
                  <div className='text-gray-600 dark:text-gray-400'>
                    Calidad Garantizada
                  </div>
                </div>
              </div>
            </div>

            <div className='lg:text-right'>
              <div className='glass-card p-8 rounded-2xl'>
                <div className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                  Productos Ecuatorianos Premium
                </div>
                <div className='text-gray-700 dark:text-gray-300'>
                  Frutas • Mariscos • Café • Acuicultura • Árboles Frutales •
                  Nueces
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className='pt-20 pb-20 bg-white dark:bg-gray-900' id='productos'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <div className='inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4'>
              Nuestros Productos Principales
            </div>
            <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-6'>
              Excelencia Ecuatoriana en Cada Envío
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto'>
              {loading
                ? 'Cargando productos...'
                : 'Desde frutas tropicales hasta productos marinos premium y larvas de acuicultura, llevamos lo mejor de Ecuador a mesas de todo el mundo con la más alta calidad y trazabilidad.'}
            </p>
          </div>

          {loading ? (
            <div className='grid lg:grid-cols-2 gap-8'>
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className='bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 animate-pulse'
                >
                  <div className='w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded mb-6'></div>
                  <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4'></div>
                  <div className='h-4 bg-gray-100 dark:bg-gray-600 rounded mb-6'></div>
                  <div className='space-y-2 mb-6'>
                    {[...Array(4)].map((_, idx) => (
                      <div
                        key={idx}
                        className='h-4 bg-gray-100 dark:bg-gray-600 rounded'
                      ></div>
                    ))}
                  </div>
                  <div className='h-10 bg-gray-200 dark:bg-gray-700 rounded w-40'></div>
                </div>
              ))}
            </div>
          ) : (
            <div className='grid lg:grid-cols-2 gap-8'>
              {(categories || []).map((category, index) => {
                const categoryProducts = (products || []).filter(
                  p => p.category?.slug === category.slug
                );
                const bgColors = [
                  'bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-100 dark:border-orange-800',
                  'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-100 dark:border-blue-800',
                  'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-100 dark:border-emerald-800',
                ];
                const buttonColors = [
                  'bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600',
                  'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
                  'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600',
                ];

                return (
                  <div
                    key={category.id}
                    className={`${bgColors[index % bgColors.length]} p-8 rounded-2xl border`}
                  >
                    <div className='text-6xl mb-6'>{category.icon}</div>
                    <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                      {category.name}
                    </h3>
                    <p className='text-gray-700 dark:text-gray-300 mb-6'>
                      {category.description}
                    </p>
                    <ul className='space-y-2 mb-6'>
                      {categoryProducts.slice(0, 4).map(product => (
                        <li
                          key={product.id}
                          className='flex items-center text-gray-700 dark:text-gray-300'
                        >
                          <span className='text-green-600 dark:text-green-400 mr-2'>
                            ✓
                          </span>
                          {product.name}
                          {product.basePrice && (
                            <span className='ml-auto text-sm text-green-600 dark:text-green-400 font-medium'>
                              ${product.basePrice.toFixed(2)}/
                              {product.priceUnit}
                            </span>
                          )}
                        </li>
                      ))}
                      {categoryProducts.length > 4 && (
                        <li className='flex items-center text-gray-600'>
                          <span className='text-green-600 mr-2'>✓</span>+
                          {categoryProducts.length - 4} productos más
                        </li>
                      )}
                    </ul>
                    <div className='flex gap-3'>
                      <button
                        onClick={() => scrollToSection('cotizar')}
                        className={`inline-block ${buttonColors[index % buttonColors.length]} text-white px-6 py-3 rounded-lg transition-colors`}
                      >
                        Solicitar Cotización
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCategory(category.slug);
                          document
                            .getElementById('todos-productos')
                            ?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className='inline-block border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                      >
                        Ver {categoryProducts.length} productos
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* All Products Section - Dynamic */}
      <section
        className='pt-20 pb-20 bg-gray-50 dark:bg-gray-800'
        id='todos-productos'
      >
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <div className='inline-block bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4'>
              Catálogo Completo
            </div>
            <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-6'>
              Todos Nuestros Productos Ecuatorianos
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8'>
              {loading
                ? 'Cargando productos...'
                : `${(filteredProducts || []).length} variedades de productos premium ecuatorianos disponibles para exportación mundial`}
            </p>

            {/* Category Filter */}
            {!loading && (categories || []).length > 0 && (
              <div className='flex flex-wrap justify-center gap-3 mb-8'>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-green-600 dark:bg-green-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  Todos ({(products || []).length})
                </button>
                {(categories || []).map(category => {
                  const categoryProductCount = (products || []).filter(
                    p => p.category?.slug === category.slug
                  ).length;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category.slug
                          ? 'bg-green-600 dark:bg-green-500 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <span className='mr-2'>{category.icon}</span>
                      {category.name} ({categoryProductCount})
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
              {[...Array(12)].map((_, index) => (
                <div
                  key={index}
                  className='bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 animate-pulse'
                >
                  <div className='h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2'></div>
                  <div className='h-3 bg-gray-100 dark:bg-gray-500 rounded'></div>
                </div>
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
              {(filteredProducts || []).map(product => (
                <div
                  key={product.id}
                  className='bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow text-center group cursor-pointer'
                  onClick={() => {
                    // Scroll to quote section
                    document
                      .getElementById('cotizar')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div className='mb-2'>
                    <span className='text-2xl'>
                      {product.category?.icon || '📦'}
                    </span>
                  </div>
                  <h4 className='font-semibold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors'>
                    {product.name}
                  </h4>
                  <p className='text-xs text-gray-600 dark:text-gray-400 mb-2'>
                    {product.shortDescription || 'Premium quality'}
                  </p>
                  <div className='flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400'>
                    <span className='text-green-600 dark:text-green-400'>
                      ✓
                    </span>
                    <span>{product.origin}</span>
                  </div>
                  {product.basePrice && (
                    <div className='mt-2 text-xs font-medium text-green-600 dark:text-green-400'>
                      ${product.basePrice.toFixed(2)}/{product.priceUnit}
                    </div>
                  )}
                  {product.certifications &&
                    product.certifications.length > 0 && (
                      <div className='mt-2 flex flex-wrap gap-1 justify-center'>
                        {product.certifications.slice(0, 2).map((cert, idx) => (
                          <span
                            key={idx}
                            className='text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded'
                          >
                            {cert}
                          </span>
                        ))}
                        {product.certifications.length > 2 && (
                          <span className='text-xs text-gray-500 dark:text-gray-400'>
                            +{product.certifications.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}

          {/* No products found */}
          {!loading && (filteredProducts || []).length === 0 && (
            <div className='text-center py-12'>
              <div className='text-6xl mb-4'>🔍</div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                No se encontraron productos
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Intenta seleccionar una categoría diferente
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Quote Section */}
      <section
        className='pt-20 pb-20 bg-gradient-to-br from-green-600 to-blue-600 text-white'
        id='cotizar'
      >
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-12'>
              <div className='inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-4'>
                Sistema Avanzado de Cotizaciones
              </div>
              <h2 className='text-4xl font-bold mb-6'>
                Cotizaciones Interactivas y Personalizadas
              </h2>
              <p className='text-xl opacity-90 mb-8'>
                Nuestro nuevo sistema de cotizaciones te permite seleccionar
                productos específicos, calcular precios en tiempo real y recibir
                propuestas personalizadas por email automáticamente.
              </p>

              <div className='grid md:grid-cols-3 gap-6 mb-12'>
                <div className='bg-white/10 backdrop-blur-sm p-6 rounded-xl'>
                  <div className='text-3xl mb-4'>🔍</div>
                  <h3 className='text-lg font-semibold mb-2'>
                    Búsqueda Inteligente
                  </h3>
                  <p className='opacity-90 text-sm'>
                    Encuentra productos rápidamente con nuestro sistema de
                    búsqueda avanzado
                  </p>
                </div>

                <div className='bg-white/10 backdrop-blur-sm p-6 rounded-xl'>
                  <div className='text-3xl mb-4'>🛒</div>
                  <h3 className='text-lg font-semibold mb-2'>
                    Selección Múltiple
                  </h3>
                  <p className='opacity-90 text-sm'>
                    Combina múltiples productos en una sola cotización con
                    cantidades personalizadas
                  </p>
                </div>

                <div className='bg-white/10 backdrop-blur-sm p-6 rounded-xl'>
                  <div className='text-3xl mb-4'>📧</div>
                  <h3 className='text-lg font-semibold mb-2'>
                    Envío Automático
                  </h3>
                  <p className='opacity-90 text-sm'>
                    Recibe cotizaciones profesionales por email con seguimiento
                    automático
                  </p>
                </div>
              </div>

              <QuoteForm initialProducts={products} />
            </div>
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className='pt-20 pb-20 bg-white dark:bg-gray-900' id='calidad'>
        <div className='container mx-auto px-4'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <div>
              <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-6'>
                Calidad Mundial, Origen Ecuatoriano
              </h2>
              <p className='text-xl text-gray-600 dark:text-gray-300 mb-8'>
                Nuestros productos cumplen con los más altos estándares
                internacionales de calidad y seguridad alimentaria. Cada envío
                está respaldado por certificaciones reconocidas mundialmente y
                procesos de trazabilidad completos desde la finca hasta el
                destino final.
              </p>

              <div className='grid grid-cols-2 gap-6'>
                <div className='text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                  <div className='text-3xl font-bold text-green-600 dark:text-green-400 mb-2'>
                    HACCP
                  </div>
                  <div className='text-gray-600 dark:text-gray-400'>
                    Análisis de Peligros
                  </div>
                </div>
                <div className='text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                  <div className='text-3xl font-bold text-green-600 dark:text-green-400 mb-2'>
                    BRC
                  </div>
                  <div className='text-gray-600 dark:text-gray-400'>
                    Seguridad Alimentaria
                  </div>
                </div>
                <div className='text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                  <div className='text-3xl font-bold text-green-600 dark:text-green-400 mb-2'>
                    BAP
                  </div>
                  <div className='text-gray-600 dark:text-gray-400'>
                    Acuicultura Responsable
                  </div>
                </div>
                <div className='text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                  <div className='text-3xl font-bold text-green-600 dark:text-green-400 mb-2'>
                    GlobalGAP
                  </div>
                  <div className='text-gray-600 dark:text-gray-400'>
                    Buenas Prácticas
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-gradient-to-br from-green-600 to-blue-600 p-12 rounded-2xl text-white text-center'>
              <div className='text-6xl mb-6'>🏆</div>
              <h3 className='text-2xl font-bold mb-4'>
                Reconocimientos Internacionales
              </h3>
              <p className='opacity-90'>
                Premiados por la excelencia en exportación y compromiso con la
                calidad en múltiples mercados internacionales. Más de 4 años de
                experiencia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section
        className='pt-20 pb-20 bg-gray-50 dark:bg-gray-800'
        id='mercados'
      >
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <div className='inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4'>
              Alcance Global
            </div>
            <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-6'>
              Desde Ecuador Hacia el Mundo
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto'>
              Desde Ecuador hacia el mundo, nuestra red logística con oficina de
              distribución en Miami nos permite llegar a los principales
              mercados mundiales con la eficiencia y calidad que nuestros
              clientes demandan
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16'>
            <div className='text-center'>
              <div className='text-4xl font-bold text-green-600 dark:text-green-400'>
                8+
              </div>
              <div className='text-gray-600 dark:text-gray-400'>
                Países Atendidos
              </div>
            </div>
            <div className='text-center'>
              <div className='text-4xl font-bold text-green-600 dark:text-green-400'>
                50+
              </div>
              <div className='text-gray-600 dark:text-gray-400'>
                Contenedores por Año
              </div>
            </div>
            <div className='text-center'>
              <div className='text-4xl font-bold text-green-600 dark:text-green-400'>
                4+
              </div>
              <div className='text-gray-600 dark:text-gray-400'>
                Años de Experiencia
              </div>
            </div>
            <div className='text-center'>
              <div className='text-4xl font-bold text-green-600 dark:text-green-400'>
                100%
              </div>
              <div className='text-gray-600 dark:text-gray-400'>
                Productos Certificados
              </div>
            </div>
            <div className='text-center'>
              <div className='text-4xl font-bold text-green-600 dark:text-green-400'>
                99.8%
              </div>
              <div className='text-gray-600 dark:text-gray-400'>
                Satisfacción del Cliente
              </div>
            </div>
            <div className='text-center'>
              <div className='text-4xl font-bold text-green-600 dark:text-green-400'>
                24/7
              </div>
              <div className='text-gray-600 dark:text-gray-400'>
                Soporte Especializado
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className='pt-20 pb-20 bg-white dark:bg-gray-900' id='contacto'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <div className='inline-block bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4'>
              Contacto
            </div>
            <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-6'>
              Conecta con Nuestro Equipo
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
              Estamos aquí para ayudarte con todas tus necesidades de
              importación de productos ecuatorianos
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl'>
              <div className='text-4xl mb-4'>🏢</div>
              <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                Oficina Principal
              </h4>
              <p className='text-gray-600 dark:text-gray-400'>
                Samborondón, Guayas
                <br />
                Ecuador
              </p>
            </div>

            <div className='text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl'>
              <div className='text-4xl mb-4'>🏢</div>
              <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                Oficina de Distribución
              </h4>
              <p className='text-gray-600 dark:text-gray-400'>
                Miami, Florida
                <br />
                Estados Unidos
              </p>
            </div>

            <div className='text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl'>
              <div className='text-4xl mb-4'>📧</div>
              <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                Email Comercial
              </h4>
              <p className='text-gray-600 dark:text-gray-400'>
                sales@zivahinternational.com
                <br />
                info@zivahinternational.com
              </p>
            </div>

            <div className='text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl'>
              <div className='text-4xl mb-4'>📱</div>
              <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                Teléfonos
              </h4>
              <p className='text-gray-600 dark:text-gray-400'>
                +1 (305) XXX-XXXX
                <br />
                WhatsApp: +593 9X XXX XXXX
              </p>
            </div>
          </div>

          <div className='mt-12 text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl'>
            <div className='text-4xl mb-4'>⏰</div>
            <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Horario de Atención
            </h4>
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <strong className='text-gray-900 dark:text-white'>
                  Sede Principal (Ecuador):
                </strong>
                <br />
                <span className='text-gray-600 dark:text-gray-400'>
                  Lunes - Viernes: 8:00 AM - 6:00 PM ECT
                  <br />
                  Sábados: 9:00 AM - 2:00 PM ECT
                </span>
              </div>
              <div>
                <strong className='text-gray-900 dark:text-white'>
                  Oficina Miami:
                </strong>
                <br />
                <span className='text-gray-600 dark:text-gray-400'>
                  Lunes - Viernes: 8:00 AM - 6:00 PM EST
                  <br />
                  Sábados: 9:00 AM - 2:00 PM EST
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-16'>
        <div className='container mx-auto px-4'>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
            <div>
              <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                ZIVAH International S.A.
              </h4>
              <p className='text-gray-600 dark:text-gray-400 text-sm mb-4'>
                Exportadores premium de productos ecuatorianos con más de 4 años
                conectando Ecuador con el mundo desde nuestra sede principal en
                Samborondón, Guayas.
              </p>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>
                <strong className='text-gray-900 dark:text-white'>
                  Especialistas en:
                </strong>{' '}
                Acuicultura, Larvas de Camarón, Frutas Tropicales, Productos del
                Mar y Café de Altura.
              </p>
            </div>

            <div>
              <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                Productos Principales
              </h4>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400'>
                <li>
                  <a
                    href='#productos'
                    className='hover:text-green-600 dark:hover:text-green-400 transition-colors'
                  >
                    Frutas Tropicales
                  </a>
                </li>
                <li>
                  <a
                    href='#productos'
                    className='hover:text-green-600 dark:hover:text-green-400 transition-colors'
                  >
                    Productos del Mar
                  </a>
                </li>
                <li>
                  <a
                    href='#productos'
                    className='hover:text-green-600 dark:hover:text-green-400 transition-colors'
                  >
                    Café Arábica
                  </a>
                </li>
                <li>
                  <a
                    href='#productos'
                    className='hover:text-green-600 dark:hover:text-green-400 transition-colors'
                  >
                    Camarón Premium
                  </a>
                </li>
                <li>
                  <a
                    href='#productos'
                    className='hover:text-green-600 dark:hover:text-green-400 transition-colors'
                  >
                    Larvas de Camarón
                  </a>
                </li>
                <li>
                  <a
                    href='#todos-productos'
                    className='hover:text-green-600 dark:hover:text-green-400 transition-colors'
                  >
                    Ver Catálogo Completo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                Servicios
              </h4>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400'>
                <li>
                  <a
                    href='#calidad'
                    className='hover:text-green-600 dark:hover:text-green-400 transition-colors'
                  >
                    Certificaciones
                  </a>
                </li>
                <li>
                  <a
                    href='#cotizar'
                    className='hover:text-green-600 dark:hover:text-green-400 transition-colors'
                  >
                    Cotizaciones
                  </a>
                </li>
                <li>
                  <a
                    href='#mercados'
                    className='hover:text-green-600 dark:hover:text-green-400 transition-colors'
                  >
                    Distribución Global
                  </a>
                </li>
                <li>
                  <a
                    href='#contacto'
                    className='hover:text-green-600 dark:hover:text-green-400 transition-colors'
                  >
                    Asesoría Técnica
                  </a>
                </li>
                <li>
                  <a
                    href='#contacto'
                    className='hover:text-green-600 dark:hover:text-green-400 transition-colors'
                  >
                    Soporte 24/7
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                Legal
              </h4>
              <ul className='space-y-2 text-gray-600 dark:text-gray-400'>
                <li>
                  <Link
                    href='/legal/privacy-policy'
                    className='hover:text-green-600 dark:hover:text-green-400 transition-colors'
                  >
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link
                    href='/legal/terms-of-service'
                    className='hover:text-green-600 dark:hover:text-green-400 transition-colors'
                  >
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link
                    href='/legal/cookie-policy'
                    className='hover:text-green-600 dark:hover:text-green-400 transition-colors'
                  >
                    Política de Cookies
                  </Link>
                </li>
                <li>
                  <Link
                    href='/legal/data-protection'
                    className='hover:text-green-600 dark:hover:text-green-400 transition-colors'
                  >
                    Protección de Datos
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-t border-gray-300 dark:border-gray-700 pt-8'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>
                &copy; 2025 ZIVAH International S.A. Todos los derechos
                reservados.
              </p>
              <p className='text-gray-600 dark:text-gray-400 text-sm mt-2 md:mt-0'>
                Exportadores Premium de Productos Ecuatorianos
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
