// Países de exportación de Ecuador - Principales destinos comerciales
const ECUADOR_EXPORT_COUNTRIES = [
  // América del Norte
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸', region: 'América del Norte' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦', region: 'América del Norte' },
  { code: 'MX', name: 'México', flag: '🇲🇽', region: 'América del Norte' },

  // América del Sur
  { code: 'BR', name: 'Brasil', flag: '🇧🇷', region: 'América del Sur' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'América del Sur' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', region: 'América del Sur' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', region: 'América del Sur' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪', region: 'América del Sur' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', region: 'América del Sur' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', region: 'América del Sur' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', region: 'América del Sur' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', region: 'América del Sur' },

  // Europa
  { code: 'ES', name: 'España', flag: '🇪🇸', region: 'Europa' },
  { code: 'IT', name: 'Italia', flag: '🇮🇹', region: 'Europa' },
  { code: 'FR', name: 'Francia', flag: '🇫🇷', region: 'Europa' },
  { code: 'DE', name: 'Alemania', flag: '🇩🇪', region: 'Europa' },
  { code: 'NL', name: 'Países Bajos', flag: '🇳🇱', region: 'Europa' },
  { code: 'BE', name: 'Bélgica', flag: '🇧🇪', region: 'Europa' },
  { code: 'UK', name: 'Reino Unido', flag: '🇬🇧', region: 'Europa' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', region: 'Europa' },
  { code: 'SE', name: 'Suecia', flag: '🇸🇪', region: 'Europa' },
  { code: 'NO', name: 'Noruega', flag: '🇳🇴', region: 'Europa' },
  { code: 'DK', name: 'Dinamarca', flag: '🇩🇰', region: 'Europa' },
  { code: 'FI', name: 'Finlandia', flag: '🇫🇮', region: 'Europa' },
  { code: 'CH', name: 'Suiza', flag: '🇨🇭', region: 'Europa' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', region: 'Europa' },

  // Asia
  { code: 'JP', name: 'Japón', flag: '🇯🇵', region: 'Asia' },
  { code: 'KR', name: 'Corea del Sur', flag: '🇰🇷', region: 'Asia' },
  { code: 'CN', name: 'China', flag: '🇨🇳', region: 'Asia' },
  { code: 'SG', name: 'Singapur', flag: '🇸🇬', region: 'Asia' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', region: 'Asia' },
  { code: 'TW', name: 'Taiwán', flag: '🇹🇼', region: 'Asia' },
  { code: 'TH', name: 'Tailandia', flag: '🇹🇭', region: 'Asia' },
  { code: 'MY', name: 'Malasia', flag: '🇲🇾', region: 'Asia' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', region: 'Asia' },
  { code: 'IN', name: 'India', flag: '🇮🇳', region: 'Asia' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', region: 'Asia' },
  { code: 'PH', name: 'Filipinas', flag: '🇵🇭', region: 'Asia' },

  // Medio Oriente
  { code: 'AE', name: 'Emiratos Árabes Unidos', flag: '🇦🇪', region: 'Medio Oriente' },
  { code: 'SA', name: 'Arabia Saudita', flag: '🇸🇦', region: 'Medio Oriente' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', region: 'Medio Oriente' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', region: 'Medio Oriente' },
  { code: 'BH', name: 'Bahréin', flag: '🇧🇭', region: 'Medio Oriente' },
  { code: 'OM', name: 'Omán', flag: '🇴🇲', region: 'Medio Oriente' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', region: 'Medio Oriente' },
  { code: 'TR', name: 'Turquía', flag: '🇹🇷', region: 'Medio Oriente' },

  // África
  { code: 'ZA', name: 'Sudáfrica', flag: '🇿🇦', region: 'África' },
  { code: 'EG', name: 'Egipto', flag: '🇪🇬', region: 'África' },
  { code: 'MA', name: 'Marruecos', flag: '🇲🇦', region: 'África' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'África' },
  { code: 'KE', name: 'Kenia', flag: '🇰🇪', region: 'África' },

  // Oceanía
  { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'Oceanía' },
  { code: 'NZ', name: 'Nueva Zelanda', flag: '🇳🇿', region: 'Oceanía' },

  // Centroamérica y Caribe
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', region: 'Centroamérica' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', region: 'Centroamérica' },
  { code: 'PA', name: 'Panamá', flag: '🇵🇦', region: 'Centroamérica' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', region: 'Centroamérica' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', region: 'Centroamérica' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', region: 'Centroamérica' },
  { code: 'BZ', name: 'Belice', flag: '🇧🇿', region: 'Centroamérica' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', region: 'Caribe' },
  { code: 'TT', name: 'Trinidad y Tobago', flag: '🇹🇹', region: 'Caribe' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧', region: 'Caribe' },
  { code: 'DO', name: 'República Dominicana', flag: '🇩🇴', region: 'Caribe' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', region: 'Caribe' }
];

// Función para obtener países por región
function getCountriesByRegion() {
  const regions = {};
  ECUADOR_EXPORT_COUNTRIES.forEach(country => {
    if (!regions[country.region]) {
      regions[country.region] = [];
    }
    regions[country.region].push(country);
  });
  return regions;
}

// Función para buscar países
function searchCountries(query) {
  return ECUADOR_EXPORT_COUNTRIES.filter(country => 
    country.name.toLowerCase().includes(query.toLowerCase()) ||
    country.code.toLowerCase().includes(query.toLowerCase())
  );
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ECUADOR_EXPORT_COUNTRIES, getCountriesByRegion, searchCountries };
}
// P
roductos de exportación de Ecuador organizados por categorías
const ECUADOR_EXPORT_PRODUCTS = [
  {
    category: 'Frutas Tropicales',
    icon: '🥭',
    products: [
      { value: 'aguacate', name: 'Aguacate Hass', icon: '🥑', description: 'Premium export quality' },
      { value: 'mango', name: 'Mango Premium', icon: '🥭', description: 'Tommy Atkins y Kent' },
      { value: 'papaya', name: 'Papaya Hawaiana', icon: '🧡', description: 'Dulzura natural' },
      { value: 'pina', name: 'Piña Golden MD2', icon: '🍍', description: 'Máxima calidad' },
      { value: 'platano', name: 'Plátano Verde', icon: '🍌', description: 'Para exportación' },
      { value: 'coco', name: 'Coco Tropical', icon: '🥥', description: 'Costa ecuatoriana' },
      { value: 'pitahaya', name: 'Pitahaya', icon: '🐉', description: 'Fruta del dragón' }
    ]
  },
  {
    category: 'Productos del Mar',
    icon: '🦐',
    products: [
      { value: 'camaron', name: 'Camarón Blanco Premium', icon: '🦐', description: 'Vannamei certificado' },
      { value: 'atun', name: 'Atún Fresco', icon: '🐟', description: 'Captura sustentable' },
      { value: 'mahi-mahi', name: 'Mahi-Mahi', icon: '🐠', description: 'Dorado del Pacífico' },
      { value: 'pescado-blanco', name: 'Pescado Blanco', icon: '🐟', description: 'Variedades selectas' }
    ]
  },
  {
    category: 'Café y Especias',
    icon: '☕',
    products: [
      { value: 'cafe', name: 'Café Arábica de Altura', icon: '☕', description: 'Montañas andinas' },
      { value: 'curcuma', name: 'Cúrcuma', icon: '🟡', description: 'Propiedades medicinales' },
      { value: 'jengibre', name: 'Jengibre Fresco', icon: '🫚', description: 'Calidad exportación' },
      { value: 'canela', name: 'Canela', icon: '🟤', description: 'Aroma intenso' }
    ]
  },
  {
    category: 'Tubérculos y Vegetales',
    icon: '🍠',
    products: [
      { value: 'yuca', name: 'Yuca Premium', icon: '🍠', description: 'Procesamiento industrial' },
      { value: 'camote', name: 'Camote Dulce', icon: '🍠', description: 'Rica en nutrientes' },
      { value: 'name', name: 'Ñame Tropical', icon: '🍠', description: 'Variedades autóctonas' },
      { value: 'nampi', name: 'Ñampí', icon: '🍠', description: 'Tubérculo andino' },
      { value: 'calabaza', name: 'Calabaza Premium', icon: '🎃', description: 'Cultivo orgánico' },
      { value: 'cebolla', name: 'Cebolla Premium', icon: '🧅', description: 'Variedades selectas' },
      { value: 'chayote', name: 'Chayote Orgánico', icon: '🥒', description: 'Certificado internacional' }
    ]
  },
  {
    category: 'Acuicultura y Biotecnología',
    icon: '🧬',
    products: [
      { value: 'larvas', name: 'Larvas de Camarón', icon: '🧬', description: 'Laboratorio certificado' },
      { value: 'reproductores', name: 'Reproductores de Camarón', icon: '🦐', description: 'Genética superior' },
      { value: 'alimento-balanceado', name: 'Alimento Balanceado Acuícola', icon: '🌾', description: 'Nutrición acuícola' }
    ]
  },
  {
    category: 'Árboles y Plantas',
    icon: '🌳',
    products: [
      { value: 'arboles-mango', name: 'Árboles de Mango', icon: '🥭', description: 'Variedades tropicales' },
      { value: 'arboles-aguacate', name: 'Árboles de Aguacate', icon: '🥑', description: 'Hass y criollos' },
      { value: 'arboles-citricos', name: 'Árboles Cítricos', icon: '🍊', description: 'Naranja, limón, mandarina' },
      { value: 'arboles-cacao', name: 'Árboles de Cacao', icon: '🍫', description: 'Fino de aroma' },
      { value: 'palmito', name: 'Palmito Orgánico', icon: '🌴', description: 'Sustentable certificado' }
    ]
  },
  {
    category: 'Nueces y Frutos Secos',
    icon: '🥜',
    products: [
      { value: 'macadamia', name: 'Nueces de Macadamia', icon: '🥜', description: 'Cultivo especializado' },
      { value: 'pecanas', name: 'Nueces Pecanas', icon: '🥜', description: 'Adaptadas al trópico' },
      { value: 'almendras', name: 'Almendras Tropicales', icon: '🥜', description: 'Variedades ecuatorianas' }
    ]
  },
  {
    category: 'Cereales y Otros',
    icon: '🌾',
    products: [
      { value: 'cana-azucar', name: 'Caña de Azúcar', icon: '🎋', description: 'Procesamiento natural' },
      { value: 'quinoa', name: 'Quinoa Andina', icon: '🌾', description: 'Superfood certificado' },
      { value: 'cacao-grano', name: 'Cacao Fino de Aroma', icon: '🍫', description: 'Calidad premium' },
      { value: 'otro', name: 'Otro producto', icon: '📦', description: 'Producto específico' },
      { value: 'multiple', name: 'Múltiples Productos', icon: '📦', description: 'Combinación personalizada' }
    ]
  }
];

// Función para obtener productos por categoría
function getProductsByCategory() {
  return ECUADOR_EXPORT_PRODUCTS;
}

// Función para buscar productos
function searchProducts(query) {
  const results = [];
  ECUADOR_EXPORT_PRODUCTS.forEach(category => {
    const matchingProducts = category.products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.value.toLowerCase().includes(query.toLowerCase()) ||
      category.category.toLowerCase().includes(query.toLowerCase())
    );
    
    if (matchingProducts.length > 0) {
      results.push({
        ...category,
        products: matchingProducts
      });
    }
  });
  return results;
}

// Exportar productos también
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    ECUADOR_EXPORT_COUNTRIES, 
    getCountriesByRegion, 
    searchCountries,
    ECUADOR_EXPORT_PRODUCTS,
    getProductsByCategory,
    searchProducts
  };
}