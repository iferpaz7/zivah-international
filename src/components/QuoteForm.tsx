'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';

import { useBusinessTracking } from '@/components/BusinessIntelligence';
import { Button } from '@/components/ui/button';
import { createQuoteSchema } from '@/lib/validations';

interface QuoteProduct {
  id: number;
  name: string;
  basePrice?: number | undefined;
  description?: string;
  sku?: string;
  priceUnit?: string; // Base unit of the product (optional)
  // TODO: Replace with database-driven pricing after migration
  // This is a temporary solution until we implement the product_prices table
  priceMatrix?: {
    [unitId: number]: number; // measureId -> price per unit
  };
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
  type: string; // 'WEIGHT', 'VOLUME', 'LENGTH', 'AREA', 'COUNT', etc.
  baseUnit?: string;
  conversionFactor?: number;
  description?: string;
  family?: string; // Group related measures (e.g., 'weight', 'volume')
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

interface QuoteFormProps {
  initialProducts?: QuoteProduct[];
}

export default function QuoteForm({ initialProducts }: QuoteFormProps = {}) {
  const [products, setProducts] = useState<QuoteProduct[]>(initialProducts || []);
  const [countries, setCountries] = useState<Country[]>([]);
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<QuoteProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductList, setShowProductList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesError, setCountriesError] = useState<string | null>(null);
  const [measuresLoading, _setMeasuresLoading] = useState(true);
  const [productsSearching, setProductsSearching] = useState(false);

  // State for price conversion
  const [conversionErrors, setConversionErrors] = useState<{
    [productId: number]: string;
  }>({});
  const [calculatedPrices, setCalculatedPrices] = useState<{
    [productId: number]: number;
  }>({});

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(createQuoteSchema),
    defaultValues: {
      items: [],
    },
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
        if (!data.error && data.data?.length > 0) {
          setCountries(data.data);
        } else {
          setCountriesError('No countries available. Please contact support.');
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
    _setMeasuresLoading(true);

    fetch('/api/quotes/measures')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (!data.error && data.data?.length > 0) {
          setMeasures(data.data);
        }
      })
      .catch(_error => {
        // Error handling - measures will remain empty
      })
      .finally(() => {
        _setMeasuresLoading(false);
      });
  }, []);

  const watchedItems = watch('items');

  // Search products from API only
  const searchProducts = async (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setProducts([]);
      setShowProductList(false);
      return;
    }

    setProductsSearching(true);
    setSearchQuery(query);

    if (query.length < 2) {
      setProducts([]);
      setShowProductList(false);
      return;
    }

    setProductsSearching(true);

    try {
      const res = await fetch(
        `/api/quotes/products/search?q=${encodeURIComponent(query)}&limit=10`
      );
      const data = await res.json();

      if (!data.error && data.data?.length > 0) {
        setProducts(data.data);
        setShowProductList(true);
      } else {
        setProducts([]);
        setShowProductList(true); // Show empty state
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
      setShowProductList(false);
    } finally {
      setProductsSearching(false);
    }
  };

  // Function to get available measures for a product (same family only)
  const getAvailableMeasuresForProduct = (product: QuoteProduct): Measure[] => {
    if (!product.priceUnit) {
      return measures; // If no price unit specified, allow all measures
    }

    // Find the base measure for this product
    const baseMeasure = measures.find(
      m => m.shortName === product.priceUnit || m.name === product.priceUnit
    );

    if (!baseMeasure) {
      return measures; // Fallback to all measures
    }

    // Return only measures from the same family/type
    return measures.filter(
      m => m.type === baseMeasure.type || m.family === baseMeasure.family || m.id === baseMeasure.id
    );
  };

  // Function to get price for a specific unit
  const getPriceForUnit = useCallback(
    (product: QuoteProduct, measureId: number): number | null => {
      // Check if product has a price matrix
      if (product.priceMatrix && product.priceMatrix[measureId]) {
        return product.priceMatrix[measureId];
      }

      // Find the measure
      const measure = measures.find(m => m.id === measureId);
      if (!measure) return null;

      // Check if this is the base unit
      if (measure.shortName === product.priceUnit || measure.name === product.priceUnit) {
        return product.basePrice || 0;
      }

      // For same family conversions, use mathematical conversion as fallback
      const baseMeasure = measures.find(
        m => m.shortName === product.priceUnit || m.name === product.priceUnit
      );

      if (
        baseMeasure &&
        measure.type === baseMeasure.type &&
        baseMeasure.baseUnit === measure.baseUnit
      ) {
        const factor = measure.conversionFactor || 1;
        const fromFactor = baseMeasure.conversionFactor || 1;
        const basePrice = product.basePrice || 0;

        // Convert price per unit (inverse of quantity conversion)
        return (basePrice * fromFactor) / factor;
      }

      // No conversion available
      return null;
    },
    [measures]
  );

  // Simplified conversion function that uses price matrix
  const convertPrice = useCallback(
    (product: QuoteProduct, measureId: number, quantity: number): number | null => {
      const unitPrice = getPriceForUnit(product, measureId);

      if (unitPrice === null) {
        return null;
      }

      return unitPrice * quantity;
    },
    [getPriceForUnit]
  );

  // Recalculate prices when items, measures, or products change
  useEffect(() => {
    const items = watchedItems || [];
    const newCalculatedPrices: { [productId: number]: number } = {};
    const newErrors: { [productId: number]: string } = {};

    items.forEach(item => {
      const product = selectedProducts.find(p => p.id === item.productId);

      if (product && item.measureId) {
        // Calculate total price using new system
        const totalPrice = convertPrice(product, item.measureId, item.quantity || 1);

        if (totalPrice !== null) {
          newCalculatedPrices[item.productId] = totalPrice;
        } else {
          const measure = measures.find(m => m.id === item.measureId);
          newErrors[item.productId] =
            `Conversion not available from ${product.priceUnit || 'unit'} to ${
              measure?.shortName || measure?.name || 'unknown unit'
            }`;
        }
      }
    });

    setCalculatedPrices(newCalculatedPrices);
    setConversionErrors(newErrors);
  }, [selectedProducts, measures, watchedItems, convertPrice]);

  // Add product to quote with multiple selection support
  const addProduct = (product: QuoteProduct) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      const newSelectedProducts = [...selectedProducts, product];
      setSelectedProducts(newSelectedProducts);

      const currentItems = watch('items') || [];
      // Auto-select the product's base unit
      const defaultMeasureId =
        measures.find(
          m =>
            m.shortName === (product.priceUnit || 'unit') ||
            m.name === (product.priceUnit || 'unit')
        )?.id ||
        measures.find(m => m.type === 'WEIGHT')?.id ||
        measures[0]?.id;

      setValue('items', [
        ...currentItems,
        {
          productId: product.id,
          measureId: defaultMeasureId,
          quantity: 1,
          unitPrice: product.basePrice,
        },
      ]);

      // Calculate initial price if conversion is available
      const selectedMeasure = measures.find(m => m.id === defaultMeasureId);
      if (selectedMeasure && defaultMeasureId) {
        const initialUnitPrice = getPriceForUnit(product, defaultMeasureId);
        const initialTotalPrice = convertPrice(product, defaultMeasureId, 1);

        if (initialUnitPrice !== null && initialTotalPrice !== null) {
          // Update the unitPrice in the item
          setValue('items', [
            ...currentItems,
            {
              productId: product.id,
              measureId: defaultMeasureId,
              quantity: 1,
              unitPrice: initialUnitPrice,
            },
          ]);
          // Calculate initial subtotal
          setCalculatedPrices(prev => ({
            ...prev,
            [product.id]: initialTotalPrice,
          }));
        } else {
          // Without conversion, use base price
          setCalculatedPrices(prev => ({
            ...prev,
            [product.id]: product.basePrice || 0,
          }));
        }
      } else {
        // Without measure or priceUnit, use base price
        setCalculatedPrices(prev => ({
          ...prev,
          [product.id]: product.basePrice || 0,
        }));
      }
    }
    // Don't hide the list to allow multiple selections
  };

  // Remove product from quote
  const removeProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    const currentItems = watch('items') || [];
    setValue(
      'items',
      currentItems.filter(item => item.productId !== productId)
    );
  };

  // Update item quantity
  const updateQuantity = (productId: number, quantity: number) => {
    const currentItems = watch('items') || [];
    const currentItem = currentItems.find(item => item.productId === productId);

    setValue(
      'items',
      currentItems.map(item => (item.productId === productId ? { ...item, quantity } : item))
    );

    // Recalcular el subtotal con la nueva cantidad
    if (currentItem?.unitPrice) {
      const newTotalPrice = currentItem.unitPrice * quantity;
      setCalculatedPrices(prev => ({
        ...prev,
        [productId]: newTotalPrice,
      }));
    }
  };

  // Update item measure
  const updateMeasure = (productId: number, measureId: number) => {
    const currentItems = watch('items') || [];
    const product = selectedProducts.find(p => p.id === productId);
    const newMeasure = measures.find(m => m.id === measureId);

    if (!product || !newMeasure) return;

    // Calculate the new converted price using new system
    const quantity = currentItems.find(item => item.productId === productId)?.quantity || 1;
    const unitPrice = getPriceForUnit(product, measureId);
    const totalPrice = convertPrice(product, measureId, quantity);

    // Update form state with new measure and unit price
    const updatedItems = currentItems.map(item =>
      item.productId === productId
        ? {
            ...item,
            measureId,
            unitPrice: unitPrice || product.basePrice, // Fallback to base price if conversion fails
          }
        : item
    );

    setValue('items', updatedItems, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    // Force re-render by triggering form validation
    trigger('items');

    // Update the calculated price (subtotal) immediately
    setCalculatedPrices(prev => ({
      ...prev,
      [productId]: totalPrice || (product.basePrice || 0) * quantity,
    }));

    // Update conversion errors
    if (unitPrice === null) {
      setConversionErrors(prev => ({
        ...prev,
        [productId]: `Cannot convert from ${product.priceUnit || 'unit'} to ${newMeasure.shortName || newMeasure.name}`,
      }));
    } else {
      setConversionErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[productId];
        return newErrors;
      });
    }
  };

  // Update item notes
  const updateNotes = (productId: number, notes: string) => {
    const currentItems = watch('items') || [];
    setValue(
      'items',
      currentItems.map(item => (item.productId === productId ? { ...item, notes } : item))
    );
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
      // Usar precio calculado si existe, sino usar unitPrice
      const price = calculatedPrices[item.productId] || item.unitPrice || 0;
      return total + price;
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
          sendEmail: true, // Always send email
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage({
          type: 'success',
          text: `Cotización creada exitosamente. Email enviado a ${data.customerEmail}.`,
        });

        // Track successful quote submission
        const selectedCountry = countries.find(c => c.id === data.countryId);
        trackQuoteFormComplete({
          products: selectedProducts.map(p => ({
            id: p.id.toString(),
            name: p.name,
            quantity: data.items.find(item => item.productId === p.id)?.quantity || 0,
          })),
          contactInfo: {
            name: data.customerName,
            email: data.customerEmail,
            company: data.company,
          },
          deliveryInfo: selectedCountry
            ? {
                country: selectedCountry.name,
                port: undefined, // Could be added to form later
              }
            : undefined,
        });

        // Track business conversion
        trackBusinessConversion('quote_request');

        // Reset form
        setSelectedProducts([]);
        setValue('items', []);
        setSearchQuery('');
        setShowProductList(false);
      } else {
        setSubmitMessage({
          type: 'error',
          text: result.message || 'Error al crear la cotización',
        });
      }
    } catch (_error) {
      setSubmitMessage({
        type: 'error',
        text: 'Error de conexión. Intente nuevamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-card/80 border-border rounded-2xl border p-8 shadow-xl backdrop-blur-sm'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-6'
      >
        {/* Customer Information */}
        <div className='grid gap-6 md:grid-cols-2'>
          <div>
            <label
              htmlFor='customerName'
              className='text-foreground mb-2 block text-sm font-medium'
            >
              Nombre Completo *
            </label>
            <input
              {...register('customerName')}
              id='customerName'
              type='text'
              className='bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border px-4 py-3 backdrop-blur-sm focus:ring-2 focus:outline-none'
              placeholder='Tu nombre completo'
            />
            {errors.customerName && (
              <p className='text-destructive mt-1 text-sm'>{errors.customerName.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor='customerEmail'
              className='text-foreground mb-2 block text-sm font-medium'
            >
              Email *
            </label>
            <input
              {...register('customerEmail')}
              id='customerEmail'
              type='email'
              className='bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border px-4 py-3 backdrop-blur-sm focus:ring-2 focus:outline-none'
              placeholder='email@empresa.com'
            />
            {errors.customerEmail && (
              <p className='text-destructive mt-1 text-sm'>{errors.customerEmail.message}</p>
            )}
          </div>{' '}
          <div>
            <label
              htmlFor='countryId'
              className='text-foreground mb-2 block text-sm font-medium'
            >
              País de Destino *
            </label>
            {countriesLoading ? (
              <div className='bg-muted text-muted-foreground border-border w-full rounded-lg border px-4 py-3 backdrop-blur-sm'>
                Cargando países...
              </div>
            ) : countriesError ? (
              <div className='bg-destructive/10 text-destructive border-destructive/30 w-full rounded-lg border px-4 py-3 text-sm'>
                {countriesError}
              </div>
            ) : (
              <Controller
                name='countryId'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={countries.map(country => ({
                      value: country.id,
                      label: `${country.icon || '🌍'} ${country.name} (${country.currency})`,
                    }))}
                    onChange={option => field.onChange(option?.value)}
                    value={
                      countries.find(c => c.id === field.value)
                        ? {
                            value: field.value,
                            label: `${countries.find(c => c.id === field.value)?.icon || '🌍'} ${countries.find(c => c.id === field.value)?.name} (${countries.find(c => c.id === field.value)?.currency})`,
                          }
                        : null
                    }
                    className='text-foreground'
                    placeholder='Seleccione el país de destino'
                    isDisabled={countries.length === 0}
                    styles={{
                      control: base => ({
                        ...base,
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))',
                        borderRadius: '0.5rem',
                      }),
                      menu: base => ({
                        ...base,
                        backgroundColor: 'hsl(var(--popover))',
                        color: 'hsl(var(--popover-foreground))',
                        borderRadius: '0.5rem',
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? 'hsl(var(--accent))'
                          : state.isFocused
                            ? 'hsl(var(--accent) / 0.1)'
                            : 'hsl(var(--popover))',
                        color: state.isSelected
                          ? 'hsl(var(--accent-foreground))'
                          : 'hsl(var(--popover-foreground))',
                      }),
                    }}
                  />
                )}
              />
            )}
            {errors.countryId && (
              <p className='text-destructive mt-1 text-sm'>Seleccione un país</p>
            )}
          </div>
          <div>
            <label
              htmlFor='customerPhone'
              className='text-foreground mb-2 block text-sm font-medium'
            >
              Teléfono
            </label>
            <div className='relative'>
              {watch('countryId') && countries.find(c => c.id === watch('countryId')) && (
                <div className='pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 transform items-center space-x-2'>
                  <span className='text-lg'>
                    {countries.find(c => c.id === watch('countryId'))?.icon || '🌍'}
                  </span>
                  <span className='text-muted-foreground text-sm'>
                    {countries.find(c => c.id === watch('countryId'))?.callingCode || '+'}
                  </span>
                </div>
              )}
              <input
                {...register('customerPhone', {
                  validate: value => {
                    if (!value) return true; // Optional field
                    const error = validatePhone(value, watch('countryId'));
                    return error || true;
                  },
                })}
                type='tel'
                className={`bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border px-4 py-3 backdrop-blur-sm focus:ring-2 focus:outline-none ${
                  watch('countryId') ? 'pl-20' : ''
                }`}
                placeholder={
                  countries.find(c => c.id === watch('countryId'))?.phoneFormat || '+1 234 567 8900'
                }
              />
            </div>
            {errors.customerPhone && (
              <p className='text-destructive mt-1 text-sm'>{errors.customerPhone.message}</p>
            )}
          </div>
          <div className='md:col-span-2'>
            <label
              htmlFor='company'
              className='text-foreground mb-2 block text-sm font-medium'
            >
              Empresa
            </label>
            <input
              {...register('company')}
              type='text'
              className='bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border px-4 py-3 backdrop-blur-sm focus:ring-2 focus:outline-none'
              placeholder='Nombre de tu empresa'
            />
          </div>
        </div>

        {/* Product Search with Multiple Selection */}
        <div className='relative'>
          <label
            htmlFor='productSearch'
            className='text-foreground mb-2 block text-sm font-medium'
          >
            Buscar y Seleccionar Productos *
          </label>
          <input
            id='productSearch'
            type='text'
            value={searchQuery}
            placeholder='Escriba para buscar productos... (ej: rosas, claveles, girasoles)'
            onChange={e => searchProducts(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowProductList(true)}
            className='bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border px-4 py-3 backdrop-blur-sm focus:ring-2 focus:outline-none'
          />

          {productsSearching && searchQuery.length >= 2 && (
            <div className='bg-card border-border absolute z-10 mt-2 w-full rounded-md border p-4 shadow-lg'>
              <div className='text-muted-foreground flex items-center justify-center'>
                <svg
                  className='text-muted-foreground mr-3 -ml-1 h-5 w-5 animate-spin'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                Buscando productos...
              </div>
            </div>
          )}

          {showProductList && !productsSearching && searchQuery.length >= 2 && (
            <div className='bg-card border-border absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-md border shadow-lg'>
              {products.length > 0 ? (
                <>
                  <div className='border-border bg-muted/50 border-b p-2'>
                    <small className='text-muted-foreground'>
                      Haga clic en los productos para agregar a la cotización
                    </small>
                  </div>
                  {products.map(product => {
                    const isSelected = selectedProducts.find(p => p.id === product.id);
                    return (
                      <button
                        key={product.id}
                        type='button'
                        className={`hover:bg-muted/50 border-border text-foreground w-full cursor-pointer border-b p-3 text-left last:border-b-0 ${isSelected ? 'bg-accent/10 border-l-accent border-l-4' : ''}`}
                        onClick={() => addProduct(product)}
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex-1'>
                            <div className='flex items-center font-medium'>
                              {product.name}
                              {isSelected && (
                                <span className='text-accent ml-2 text-sm'>✓ Agregado</span>
                              )}
                            </div>
                            <div className='text-muted-foreground text-sm'>
                              ${product.basePrice || 0} por unidad -{' '}
                              {product.description || 'Sin descripción'}
                            </div>
                            <div className='text-muted-foreground text-xs'>
                              SKU: {product.sku || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </>
              ) : (
                <div className='text-muted-foreground p-4 text-center'>
                  <div className='text-sm'>
                    No se encontraron productos para &quot;{searchQuery}&quot;
                  </div>
                  <div className='text-muted-foreground mt-1 text-xs'>
                    Intente con otros términos de búsqueda
                  </div>
                </div>
              )}
              <div className='border-border bg-muted/50 border-t p-2'>
                <button
                  type='button'
                  onClick={() => setShowProductList(false)}
                  className='text-secondary hover:text-secondary/80 text-sm'
                >
                  Cerrar lista
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Products */}
        {selectedProducts.length > 0 && (
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-foreground font-medium'>
                Productos Seleccionados ({selectedProducts.length})
              </h3>
              <button
                type='button'
                onClick={() => {
                  setSelectedProducts([]);
                  setValue('items', []);
                }}
                className='text-destructive hover:text-destructive/80 text-sm'
              >
                Limpiar todo
              </button>
            </div>

            {selectedProducts.length > 0 && (
              <div className='bg-muted/50 border-border rounded-lg border p-3 text-sm'>
                <p className='text-muted-foreground mb-2'>
                  💡 <strong>Unidades de medida:</strong>
                </p>
                <ul className='text-muted-foreground space-y-1 text-xs'>
                  <li>
                    • <strong>Peso:</strong> kg (kilogramos), MT (toneladas métricas), lb (libras)
                  </li>
                  <li>
                    • <strong>Volumen:</strong> L (litros), m³ (metros cúbicos), gal (galones)
                  </li>
                  <li>
                    • <strong>Contenedores:</strong> 20ft, 40ft, 40HC (high cube)
                  </li>
                  <li>
                    • <strong>Cantidad:</strong> pcs (piezas), dz (docenas), ctn (cajas), plt
                    (pallets)
                  </li>
                </ul>
              </div>
            )}

            {selectedProducts.map(product => {
              const item = watch('items')?.find(i => i.productId === product.id);
              return (
                <div
                  key={product.id}
                  className='bg-card border-border rounded-lg border p-4 shadow-sm'
                >
                  <div className='flex items-start justify-between'>
                    <div className='text-foreground flex-1'>
                      <div className='font-medium'>{product.name}</div>
                      <div className='text-muted-foreground text-sm'>
                        {product.description || 'Sin descripción'}
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        SKU: {product.sku || 'N/A'}
                      </div>
                    </div>
                    <button
                      type='button'
                      onClick={() => removeProduct(product.id)}
                      className='text-destructive hover:text-destructive/80 ml-4'
                    >
                      ✕
                    </button>
                  </div>

                  <div className='grid items-end gap-3 md:grid-cols-4'>
                    <div>
                      <label
                        htmlFor={`quantity-${product.id}`}
                        className='text-muted-foreground mb-1 block text-xs'
                      >
                        Cantidad
                      </label>
                      <input
                        id={`quantity-${product.id}`}
                        type='number'
                        min='1'
                        value={item?.quantity || 1}
                        onChange={e => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                        className='bg-background border-border text-foreground w-full rounded-md border px-3 py-2 text-center'
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`measure-${product.id}`}
                        className='text-muted-foreground mb-1 block text-xs'
                      >
                        Unit of Measure
                      </label>
                      <select
                        id={`measure-${product.id}`}
                        value={item?.measureId || ''}
                        onChange={e => updateMeasure(product.id, parseInt(e.target.value))}
                        className='bg-background border-border text-foreground w-full rounded-md border px-3 py-2'
                        title={
                          item?.measureId
                            ? measures.find(m => m.id === item.measureId)?.description
                            : 'Select a unit of measure'
                        }
                      >
                        <option value=''>Select unit...</option>
                        {(() => {
                          // Get available measures for this product (same family only)
                          const availableMeasures = getAvailableMeasuresForProduct(product);
                          const measuresByType: {
                            [key: string]: typeof availableMeasures;
                          } = {};

                          // Group measures by type
                          availableMeasures.forEach(measure => {
                            if (!measuresByType[measure.type]) {
                              measuresByType[measure.type] = [];
                            }
                            measuresByType[measure.type].push(measure);
                          });

                          return Object.entries(measuresByType).map(([type, typeMeasures]) => {
                            if (typeMeasures.length === 0) return null;

                            const typeNames = {
                              WEIGHT: 'Weight',
                              VOLUME: 'Volume',
                              CONTAINER: 'Containers',
                              QUANTITY: 'Quantity',
                              LENGTH: 'Length',
                              COUNT: 'Count',
                              AREA: 'Area',
                            };

                            return (
                              <optgroup
                                key={type}
                                label={typeNames[type as keyof typeof typeNames] || type}
                                className='text-foreground'
                              >
                                {typeMeasures.map(measure => {
                                  const unitPrice = getPriceForUnit(product, measure.id);
                                  const isAvailable = unitPrice !== null;

                                  return (
                                    <option
                                      key={measure.id}
                                      value={measure.id}
                                      disabled={!isAvailable}
                                      className={isAvailable ? 'text-gray-900' : 'text-gray-400'}
                                    >
                                      {measure.name} ({measure.shortName})
                                      {measure.symbol && ` - ${measure.symbol}`}
                                      {isAvailable && ` - $${unitPrice.toFixed(2)}`}
                                      {!isAvailable && ' - Not available'}
                                    </option>
                                  );
                                })}
                              </optgroup>
                            );
                          });
                        })()}
                      </select>
                    </div>

                    <div>
                      <label className='text-muted-foreground mb-1 block text-xs'>
                        Precio Unitario
                        {item?.measureId && (
                          <span className='ml-1'>
                            (por {measures.find(m => m.id === item.measureId)?.shortName})
                          </span>
                        )}
                      </label>
                      <div className='bg-muted text-foreground rounded-md px-3 py-2 text-center'>
                        ${item?.unitPrice ? item.unitPrice.toFixed(2) : product.basePrice || 0}
                      </div>
                    </div>

                    <div>
                      <span className='text-muted-foreground mb-1 block text-xs'>Subtotal</span>
                      <div className='bg-muted text-foreground rounded-md px-3 py-2 text-center font-medium'>
                        $
                        {(
                          calculatedPrices[product.id] ||
                          (item?.quantity || 1) * (product.basePrice || 0)
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`notes-${product.id}`}
                      className='text-muted-foreground mb-1 block text-xs'
                    >
                      Notas especiales (opcional)
                    </label>
                    <textarea
                      id={`notes-${product.id}`}
                      placeholder='Especificaciones, colores, tamaños, etc.'
                      value={item?.notes || ''}
                      onChange={e => updateNotes(product.id, e.target.value)}
                      className='bg-background border-border text-foreground placeholder:text-muted-foreground w-full rounded-md border px-3 py-2 text-sm'
                      rows={2}
                    />
                  </div>

                  {conversionErrors[product.id] && (
                    <div className='bg-destructive/10 text-destructive border-destructive/30 mt-2 rounded-md border p-2'>
                      <p className='text-sm'>⚠️ {conversionErrors[product.id]}</p>
                    </div>
                  )}
                </div>
              );
            })}

            <div className='text-right'>
              <div className='bg-accent/10 text-accent inline-block rounded-lg px-4 py-2 text-xl font-bold'>
                Total Estimado: ${calculateTotal().toFixed(2)} USD
              </div>
              <div className='text-muted-foreground mt-1 text-xs'>
                * Precio final puede variar según especificaciones y términos de envío
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        <div>
          <label
            htmlFor='message'
            className='text-foreground mb-2 block text-sm font-medium'
          >
            Mensaje Adicional
          </label>
          <textarea
            {...register('message')}
            id='message'
            rows={4}
            className='bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border px-4 py-3 backdrop-blur-sm focus:ring-2 focus:outline-none'
            placeholder='Comentarios adicionales, requerimientos especiales, fechas de entrega, etc.'
          />
        </div>

        {/* Submit */}
        <div className='flex justify-end'>
          <Button
            type='submit'
            disabled={isSubmitting || selectedProducts.length === 0}
            className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-8 py-3 font-bold transition-colors disabled:opacity-50'
          >
            {isSubmitting
              ? 'Enviando...'
              : `Solicitar Cotización${selectedProducts.length > 0 ? ` (${selectedProducts.length} productos)` : ''}`}
          </Button>
        </div>

        {/* Info Message */}
        <div className='text-muted-foreground text-center text-sm'>
          La cotización será enviada automáticamente por email con precios actualizados y términos
          de envío.
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div
            className={`rounded-md p-4 ${submitMessage.type === 'success' ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'}`}
          >
            {submitMessage.text}
          </div>
        )}
      </form>
    </div>
  );
}
