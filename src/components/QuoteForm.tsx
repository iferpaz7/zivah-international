'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select';
import { createQuoteSchema } from '@/lib/validations';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { useBusinessTracking } from '@/components/BusinessIntelligence';

interface Product {
  id: number;
  name: string;
  basePrice: number;
  description: string;
  sku: string;
}

interface Country {
  id: number;
  name: string;
  code: string;
  icon?: string;
  currency: string;
  callingCode?: string;
  phoneFormat?: string;
}

interface Measure {
  id: number;
  name: string;
  shortName: string;
  symbol?: string;
  type: string;
  baseUnit?: string;
  conversionFactor?: number;
  description?: string;
}

interface QuoteItem {
  productId: number;
  measureId?: number;
  quantity: number;
  unitPrice?: number;
  notes?: string;
  specifications?: Record<string, any>;
}

interface QuoteFormData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  countryId?: number;
  recipientEmail?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates?: { lat: number; lng: number };
  };
  message?: string;
  items: QuoteItem[];
}

export default function QuoteForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductList, setShowProductList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesError, setCountriesError] = useState<string | null>(null);
  const [measuresLoading, setMeasuresLoading] = useState(true);
  const [productsSearching, setProductsSearching] = useState(false);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<QuoteFormData>({
    resolver: zodResolver(createQuoteSchema),
    defaultValues: {
      items: []
    }
  });

  // Business tracking hook
  const { trackQuoteFormComplete, trackBusinessConversion } = useBusinessTracking();

  // Load countries from API
  useEffect(() => {
    setCountriesLoading(true);
    setCountriesError(null);
    
    fetch('/api/quotes/countries')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Countries API response:', data); // Debug log
        if (!data.error && data.data?.length > 0) {
          setCountries(data.data);
          console.log('Loaded countries:', data.data.length); // Debug log
        } else {
          setCountriesError('No countries available. Please contact support.');
          console.error('Failed to load countries:', data.message || 'No data returned');
        }
      })
      .catch(error => {
        setCountriesError('Error loading countries. Please check your connection and try again.');
        console.error('Error loading countries:', error);
      })
      .finally(() => {
        setCountriesLoading(false);
      });
  }, []);

  // Load measures from API
  useEffect(() => {
    setMeasuresLoading(true);
    
    fetch('/api/quotes/measures')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Measures API response:', data); // Debug log
        if (!data.error && data.data?.length > 0) {
          setMeasures(data.data);
          console.log('Loaded measures:', data.data.length); // Debug log
        } else {
          console.error('Failed to load measures:', data.message || 'No data returned');
        }
      })
      .catch(error => {
        console.error('Error loading measures:', error);
      })
      .finally(() => {
        setMeasuresLoading(false);
      });
  }, []);

  // Search products from API only
  const searchProducts = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setProducts([]);
      setShowProductList(false);
      return;
    }

    setProductsSearching(true);
    
    try {
      const res = await fetch(`/api/quotes/products/search?q=${encodeURIComponent(query)}&limit=10`);
      const data = await res.json();
      
      if (!data.error && data.data?.length > 0) {
        setProducts(data.data);
        setShowProductList(true);
      } else {
        setProducts([]);
        setShowProductList(true); // Show empty state
        console.log('No products found for query:', query);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
      setShowProductList(false);
    } finally {
      setProductsSearching(false);
    }
  };

  // Add product to quote with multiple selection support
  const addProduct = (product: Product) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      const newSelectedProducts = [...selectedProducts, product];
      setSelectedProducts(newSelectedProducts);
      
      const currentItems = watch('items') || [];
      setValue('items', [...currentItems, {
        productId: product.id,
        measureId: measures.find(m => m.type === 'WEIGHT')?.id || measures[0]?.id, // Default to first weight measure or first available
        quantity: 1,
        unitPrice: product.basePrice
      }]);
    }
    // Don't hide the list to allow multiple selections
  };

  // Remove product from quote
  const removeProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    const currentItems = watch('items') || [];
    setValue('items', currentItems.filter(item => item.productId !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId: number, quantity: number) => {
    const currentItems = watch('items') || [];
    setValue('items', currentItems.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    ));
  };

  // Update item measure
  const updateMeasure = (productId: number, measureId: number) => {
    const currentItems = watch('items') || [];
    setValue('items', currentItems.map(item =>
      item.productId === productId ? { ...item, measureId } : item
    ));
  };

  // Update item notes
  const updateNotes = (productId: number, notes: string) => {
    const currentItems = watch('items') || [];
    setValue('items', currentItems.map(item =>
      item.productId === productId ? { ...item, notes } : item
    ));
  };

  // Validate phone number based on selected country
  const validatePhone = (phone: string, countryId?: number): string | null => {
    if (!phone || !countryId) return null;
    
    const cleanPhone = phone.replace(/\s|-|\(|\)/g, '');
    const selectedCountry = countries.find(c => c.id === countryId);
    
    if (!selectedCountry?.callingCode) return null;
    
    const callingCode = selectedCountry.callingCode.replace('+', '');
    
    // Check if phone starts with country code
    if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith(callingCode)) {
      return `El teléfono debe incluir el código ${selectedCountry.callingCode}`;
    }
    
    // Basic length validation
    if (cleanPhone.length < 10) {
      return 'El teléfono debe tener al menos 10 dígitos';
    }
    
    if (cleanPhone.length > 20) {
      return 'El teléfono no puede exceder 20 caracteres';
    }
    
    return null;
  };

  // Calculate total
  const calculateTotal = () => {
    const items = watch('items') || [];
    return items.reduce((total, item) => {
      return total + ((item.unitPrice || 0) * (item.quantity || 0));
    }, 0);
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          sendEmail: true // Always send email
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage({
          type: 'success',
          text: `Cotización creada exitosamente. Email enviado a ${data.customerEmail}.`
        });

        // Track successful quote submission
        const selectedCountry = countries.find(c => c.id === data.countryId)
        trackQuoteFormComplete({
          products: selectedProducts.map(p => ({
            id: p.id.toString(),
            name: p.name,
            quantity: data.items.find(item => item.productId === p.id)?.quantity || 0
          })),
          contactInfo: {
            name: data.customerName,
            email: data.customerEmail,
            company: data.company
          },
          deliveryInfo: selectedCountry ? {
            country: selectedCountry.name,
            port: undefined // Could be added to form later
          } : undefined
        })

        // Track business conversion
        trackBusinessConversion('quote_request')

        // Reset form
        setSelectedProducts([]);
        setValue('items', []);
        setSearchQuery('');
        setShowProductList(false);
      } else {
        setSubmitMessage({
          type: 'error',
          text: result.message || 'Error al crear la cotización'
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Error de conexión. Intente nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Nombre Completo *
            </label>
            <input
              {...register('customerName')}
              type="text"
              className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Tu nombre completo"
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-300">{errors.customerName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email *
            </label>
            <input
              {...register('customerEmail')}
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="email@empresa.com"
            />
            {errors.customerEmail && (
              <p className="mt-1 text-sm text-red-300">{errors.customerEmail.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              País de Destino *
            </label>
            {countriesLoading ? (
              <div className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white/70">
                Cargando países...
              </div>
            ) : countriesError ? (
              <div className="w-full px-4 py-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-100 text-sm">
                {countriesError}
              </div>
            ) : (
              <Controller
                name="countryId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={countries.map(country => ({
                      value: country.id,
                      label: `${country.icon || '🌍'} ${country.name} (${country.currency})`
                    }))}
                    onChange={(option) => field.onChange(option?.value)}
                    value={countries.find(c => c.id === field.value) ?
                      { value: field.value, label: `${countries.find(c => c.id === field.value)?.icon || '🌍'} ${countries.find(c => c.id === field.value)?.name} (${countries.find(c => c.id === field.value)?.currency})` } :
                      null
                    }
                    className="text-gray-900"
                    placeholder="Seleccione el país de destino"
                    isDisabled={countries.length === 0}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'white'
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: 'white',
                        color: 'black'
                      })
                    }}
                  />
                )}
              />
            )}
            {errors.countryId && (
              <p className="mt-1 text-sm text-red-300">Seleccione un país</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Teléfono
            </label>
            <div className="relative">
              {watch('countryId') && countries.find(c => c.id === watch('countryId')) && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 pointer-events-none">
                  <span className="text-lg">
                    {countries.find(c => c.id === watch('countryId'))?.icon || '🌍'}
                  </span>
                  <span className="text-white/70 text-sm">
                    {countries.find(c => c.id === watch('countryId'))?.callingCode || '+'}
                  </span>
                </div>
              )}
              <input
                {...register('customerPhone', {
                  validate: (value) => {
                    if (!value) return true; // Optional field
                    const error = validatePhone(value, watch('countryId'));
                    return error || true;
                  }
                })}
                type="tel"
                className={`w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                  watch('countryId') ? 'pl-20' : ''
                }`}
                placeholder={
                  countries.find(c => c.id === watch('countryId'))?.phoneFormat || 
                  "+1 234 567 8900"
                }
              />
            </div>
            {errors.customerPhone && (
              <p className="mt-1 text-sm text-red-300">{errors.customerPhone.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white mb-2">
              Empresa
            </label>
            <input
              {...register('company')}
              type="text"
              className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Nombre de tu empresa"
            />
          </div>
        </div>

        {/* Product Search with Multiple Selection */}
        <div className="relative">
          <label className="block text-sm font-medium text-white mb-2">
            Buscar y Seleccionar Productos *
          </label>
          <input
            type="text"
            value={searchQuery}
            placeholder="Escriba para buscar productos... (ej: rosas, claveles, girasoles)"
            onChange={(e) => searchProducts(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowProductList(true)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          
          {productsSearching && searchQuery.length >= 2 && (
            <div className="absolute z-10 mt-2 w-full bg-white rounded-md shadow-lg border p-4">
              <div className="flex items-center justify-center text-gray-600">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Buscando productos...
              </div>
            </div>
          )}
          
          {showProductList && !productsSearching && searchQuery.length >= 2 && (
            <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto bg-white rounded-md shadow-lg border">
              {products.length > 0 ? (
                <>
                  <div className="p-2 border-b bg-gray-50">
                    <small className="text-gray-600">Haga clic en los productos para agregar a la cotización</small>
                  </div>
                  {products.map(product => {
                    const isSelected = selectedProducts.find(p => p.id === product.id);
                    return (
                      <div
                        key={product.id}
                        className={`p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 text-gray-900 ${isSelected ? 'bg-green-50 border-l-4 border-l-green-500' : ''}`}
                        onClick={() => addProduct(product)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium flex items-center">
                              {product.name}
                              {isSelected && <span className="ml-2 text-green-600 text-sm">✓ Agregado</span>}
                            </div>
                            <div className="text-sm text-gray-600">
                              ${product.basePrice} por unidad - {product.description}
                            </div>
                            <div className="text-xs text-gray-400">SKU: {product.sku}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <div className="text-sm">No se encontraron productos para &quot;{searchQuery}&quot;</div>
                  <div className="text-xs mt-1 text-gray-400">Intente con otros términos de búsqueda</div>
                </div>
              )}
              <div className="p-2 border-t bg-gray-50">
                <button
                  type="button"
                  onClick={() => setShowProductList(false)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Cerrar lista
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Products */}
        {selectedProducts.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-white">Productos Seleccionados ({selectedProducts.length})</h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedProducts([]);
                  setValue('items', []);
                }}
                className="text-sm text-red-300 hover:text-red-100"
              >
                Limpiar todo
              </button>
            </div>
            
            {selectedProducts.length > 0 && (
              <div className="text-sm text-white/70 mb-4 p-3 bg-white/10 rounded-lg">
                <p className="mb-2">💡 <strong>Unidades de medida:</strong></p>
                <ul className="text-xs space-y-1">
                  <li>• <strong>Peso:</strong> kg (kilogramos), MT (toneladas métricas), lb (libras)</li>
                  <li>• <strong>Volumen:</strong> L (litros), m³ (metros cúbicos), gal (galones)</li>
                  <li>• <strong>Contenedores:</strong> 20ft, 40ft, 40HC (high cube)</li>
                  <li>• <strong>Cantidad:</strong> pcs (piezas), dz (docenas), ctn (cajas), plt (pallets)</li>
                </ul>
              </div>
            )}
            
            {selectedProducts.map(product => {
              const item = watch('items')?.find(i => i.productId === product.id);
              return (
                <div key={product.id} className="p-4 bg-white/20 rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 text-white">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm opacity-75">{product.description}</div>
                      <div className="text-xs opacity-60">SKU: {product.sku}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      className="text-red-300 hover:text-red-100 ml-4"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-3 items-end">
                    <div>
                      <label className="block text-xs text-white/70 mb-1">Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        value={item?.quantity || 1}
                        onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-md bg-white/30 border border-white/30 text-white text-center"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-white/70 mb-1">Unidad de Medida</label>
                      <select
                        value={item?.measureId || ''}
                        onChange={(e) => updateMeasure(product.id, parseInt(e.target.value))}
                        className="w-full px-3 py-2 rounded-md bg-white/30 border border-white/30 text-white"
                        title={item?.measureId ? measures.find(m => m.id === item.measureId)?.description : 'Seleccione una unidad de medida'}
                      >
                        <option value="">Seleccionar unidad...</option>
                        {['WEIGHT', 'VOLUME', 'CONTAINER', 'QUANTITY', 'LENGTH'].map(type => {
                          const typeMeasures = measures.filter(m => m.type === type);
                          if (typeMeasures.length === 0) return null;
                          
                          const typeNames = {
                            WEIGHT: 'Peso',
                            VOLUME: 'Volumen', 
                            CONTAINER: 'Contenedores',
                            QUANTITY: 'Cantidad',
                            LENGTH: 'Longitud'
                          };
                          
                          return (
                            <optgroup key={type} label={typeNames[type as keyof typeof typeNames]} className="text-gray-900">
                              {typeMeasures.map(measure => (
                                <option key={measure.id} value={measure.id} className="text-gray-900">
                                  {measure.name} ({measure.shortName}) {measure.symbol && `- ${measure.symbol}`}
                                </option>
                              ))}
                            </optgroup>
                          );
                        })}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-white/70 mb-1">
                        Precio Unitario
                        {item?.measureId && (
                          <span className="ml-1">
                            (por {measures.find(m => m.id === item.measureId)?.shortName})
                          </span>
                        )}
                      </label>
                      <div className="px-3 py-2 bg-white/10 rounded-md text-white text-center">
                        ${product.basePrice}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-white/70 mb-1">Subtotal</label>
                      <div className="px-3 py-2 bg-white/10 rounded-md text-white font-medium text-center">
                        ${((item?.quantity || 1) * product.basePrice).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-white/70 mb-1">Notas especiales (opcional)</label>
                    <textarea
                      placeholder="Especificaciones, colores, tamaños, etc."
                      value={item?.notes || ''}
                      onChange={(e) => updateNotes(product.id, e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-white/30 border border-white/30 text-white placeholder:text-white/50 text-sm"
                      rows={2}
                    />
                  </div>
                </div>
              );
            })}
            
            <div className="text-right">
              <div className="text-xl font-bold text-white bg-white/20 inline-block px-4 py-2 rounded-lg">
                Total Estimado: ${calculateTotal().toFixed(2)} USD
              </div>
              <div className="text-xs text-white/70 mt-1">
                * Precio final puede variar según especificaciones y términos de envío
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Mensaje Adicional
          </label>
          <textarea
            {...register('message')}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="Comentarios adicionales, requerimientos especiales, fechas de entrega, etc."
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || selectedProducts.length === 0}
            className="bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Enviando...' : `Solicitar Cotización${selectedProducts.length > 0 ? ` (${selectedProducts.length} productos)` : ''}`}
          </Button>
        </div>

        {/* Info Message */}
        <div className="text-center text-sm text-white/70">
          La cotización será enviada automáticamente por email con precios actualizados y términos de envío.
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`p-4 rounded-md ${submitMessage.type === 'success' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
            {submitMessage.text}
          </div>
        )}
      </form>
    </div>
  );
}