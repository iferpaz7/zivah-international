import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed...');

  // Create admin users with full details
  console.log('👤 Creating admin users...');
  const adminPassword = await bcrypt.hash('admin123!', 12);
  const managerPassword = await bcrypt.hash('manager123!', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@zivahinternational.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@zivahinternational.com',
      password: adminPassword,
      name: 'Administrador ZIVAH',
      role: 'ADMIN',
      isActive: true,
      department: 'Administración',
      phone: '+593-4-234-5678',
      company: 'ZIVAH International'
    }
  });

  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@zivahinternational.com' },
    update: {},
    create: {
      username: 'manager',
      email: 'manager@zivahinternational.com',
      password: managerPassword,
      name: 'Gerente de Ventas',
      role: 'SALES_MANAGER',
      isActive: true,
      department: 'Ventas',
      phone: '+593-4-234-5679',
      company: 'ZIVAH International'
    }
  });

  // Create comprehensive categories according to Ecuador's main exports
  console.log('🏷️ Creating Ecuadorian export categories...');
  const agricolasCategory = await prisma.category.upsert({
    where: { slug: 'agricolas' },
    update: {},
    create: {
      name: 'Agrícolas',
      slug: 'agricolas',
      description: 'Banano: Ecuador es uno de los mayores exportadores mundiales de banano. Cacao: El país es un importante exportador de cacao fino y de aroma, usado para la elaboración de chocolate de alta calidad. Flores: Ecuador es un gran productor de flores, especialmente rosas, y es uno de los principales exportadores mundiales de este producto. Café: El país cultiva diversas variedades de café, exportando un producto aromático y de alta demanda. Otras frutas: También se exportan otras frutas como la piña, el brócoli y los jugos y conservas de frutas.',
      icon: '🌱',
      color: '#4CAF50',
      sortOrder: 1,
      isActive: true
    }
  });

  const marinosCategory = await prisma.category.upsert({
    where: { slug: 'marinos-y-pesca' },
    update: {},
    create: {
      name: 'Marinos y de la Pesca',
      slug: 'marinos-y-pesca', 
      description: 'Camarón: Ecuador es un líder mundial en la exportación de crustáceos, principalmente camarón y langostino. Pescado: Se exporta pescado, incluyendo atún, así como productos procesados y enlatados.',
      icon: '🦐',
      color: '#2196F3',
      sortOrder: 2,
      isActive: true
    }
  });

  const otrosCategory = await prisma.category.upsert({
    where: { slug: 'otros-productos' },
    update: {},
    create: {
      name: 'Otros Productos',
      slug: 'otros-productos',
      description: 'Manufacturas: Se exportan algunas manufacturas, como las de metales y los elaborados de banano. Madera: La madera es otro producto de exportación del país. Aceites y grasas: También se incluyen productos como el aceite de palma y aceites de pescado.',
      icon: '📦',
      color: '#795548',
      sortOrder: 3,
      isActive: true
    }
  });

  console.log('📦 Creating comprehensive products...');

  // BANANO - Main Ecuadorian agricultural export
  await prisma.product.upsert({
    where: { slug: 'banano-cavendish-premium' },
    update: {},
    create: {
      name: 'Banano Cavendish Premium',
      slug: 'banano-cavendish-premium',
      categoryId: agricolasCategory.id,
      description: 'Banano Cavendish de exportación premium cultivado en la costa ecuatoriana. Ecuador es uno de los mayores exportadores mundiales de banano con excelente calidad y vida útil.',
      shortDescription: 'Banano premium de exportación con certificación internacional',
      sku: 'BAN-CAV-001',
      specifications: {
        weight: '90-150g',
        size: '16-22cm',
        calibre: '38-48mm',
        harvest: 'Todo el año',
        packaging: 'Cajas de 18.14kg (11-16 manos)',
        features: [
          'Calibre: 38-48mm',
          'Peso promedio: 90-150g por unidad',
          'Longitud: 16-22cm',
          'Vida útil: 14-21 días',
          'Certificación GlobalGAP y Rainforest Alliance'
        ]
      },
      basePrice: 0.85,
      priceUnit: 'kg',
      stockQuantity: 15000,
      minOrderQty: 2000,
      imageUrl: '/assets/images/products/banano-cavendish.jpg',
      imageGallery: [
        '/assets/images/products/banano-1.jpg',
        '/assets/images/products/banano-2.jpg'
      ],
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['GlobalGAP', 'Rainforest Alliance', 'HACCP', 'Orgánico'],
      nutritionalInfo: {
        calories: 89,
        protein: '1.1g',
        carbs: '23g',
        fiber: '2.6g',
        potassium: '358mg',
        vitaminC: '8.7mg'
      },
      isActive: true,
      isFeatured: true,
      seoTitle: 'Banano Cavendish Premium Ecuador - Exportación',
      seoDescription: 'Banano premium certificado de Ecuador, líder mundial en exportación'
    }
  });

  // CACAO - Ecuador's fine aroma cacao
  await prisma.product.upsert({
    where: { slug: 'cacao-fino-aroma' },
    update: {},
    create: {
      name: 'Cacao Fino de Aroma Nacional',
      slug: 'cacao-fino-aroma',
      categoryId: agricolasCategory.id,
      description: 'Cacao Nacional ecuatoriano de fino aroma, reconocido mundialmente por su calidad superior para chocolate premium. Ecuador es líder en la exportación de cacao fino.',
      shortDescription: 'Cacao Nacional de aroma fino para chocolate premium',
      sku: 'CAC-NAL-001',
      specifications: {
        variety: 'Nacional Trinitario',
        fermentation: '5-7 días',
        humidity: 'Máximo 7%',
        grading: 'Superior 85%',
        packaging: 'Sacos de jute 60kg',
        features: [
          'Variedad: Nacional Trinitario',
          'Fermentación: 5-7 días',
          'Humedad: Máximo 7%',
          'Grano superior: 85% mínimo',
          'Aroma floral y frutal característico'
        ]
      },
      basePrice: 4.20,
      priceUnit: 'kg',
      stockQuantity: 3000,
      minOrderQty: 500,
      imageUrl: '/assets/images/products/cacao-nacional.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Enero - Mayo, Octubre - Diciembre',
      certifications: ['Orgánico', 'Comercio Justo', 'Rainforest Alliance', 'UTZ'],
      nutritionalInfo: {
        calories: 228,
        protein: '19.6g',
        carbs: '13.9g',
        fat: '13.7g',
        fiber: '37g'
      },
      isActive: true,
      isFeatured: true
    }
  });

  // CAMARÓN - Ecuador's leading marine export
  await prisma.product.upsert({
    where: { slug: 'camaron-blanco-premium' },
    update: {},
    create: {
      name: 'Camarón Blanco Premium',
      slug: 'camaron-blanco-premium',
      categoryId: marinosCategory.id,
      description: 'Camarón blanco Litopenaeus vannamei de granjas acuícolas ecuatorianas. Ecuador es líder mundial en exportación de camarón con la más alta calidad y certificaciones internacionales.',
      shortDescription: 'Camarón blanco fresco certificado HACCP y BRC',
      sku: 'CMR-BLC-001',
      specifications: {
        sizes: ['16/20', '21/25', '26/30', '31/40', '41/50', '51/60'],
        presentation: 'Entero, Pelado, Pelado y Desvenado (PUD)',
        packaging: 'Bloques IQF 2kg, Master carton 10kg',
        temperature: '-18°C',
        features: [
          'Especies: Litopenaeus vannamei',
          'Presentaciones: Entero, Pelado, PUD',
          'Congelado IQF (-18°C)',
          'Certificación HACCP, BRC, BAP',
          'Trazabilidad completa'
        ]
      },
      basePrice: 8.50,
      priceUnit: 'kg',
      stockQuantity: 5000,
      minOrderQty: 100,
      imageUrl: '/assets/images/products/camaron-blanco.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['HACCP', 'BRC', 'GlobalGAP', 'BAP', 'ASC'],
      nutritionalInfo: {
        calories: 85,
        protein: '18g',
        carbs: '0g',
        fat: '1.4g',
        sodium: '111mg',
        omega3: '0.3g'
      },
      isActive: true,
      isFeatured: true
    }
  });

  // FLORES - Ecuador's rose exports
  await prisma.product.upsert({
    where: { slug: 'rosas-rojas-premium' },
    update: {},
    create: {
      name: 'Rosas Rojas Premium',
      slug: 'rosas-rojas-premium',
      categoryId: agricolasCategory.id,
      description: 'Rosas rojas ecuatorianas de exportación cultivadas en la sierra ecuatoriana. Ecuador es uno de los principales exportadores mundiales de flores, especialmente rosas de alta calidad.',
      shortDescription: 'Rosas premium cultivadas en altura con certificación MPS',
      sku: 'ROS-ROJ-001',
      specifications: {
        variety: 'Red Naomi, Explorer, Freedom',
        length: '50-70cm',
        heads: '4.5-7cm',
        cultivation: 'Greenhouse hydroponic',
        packaging: 'Bunches of 25 stems',
        features: [
          'Variedades: Red Naomi, Explorer, Freedom',
          'Longitud: 50-70cm',
          'Cabeza: 4.5-7cm diámetro',
          'Cultivo hidropónico en invernadero',
          'Vida en florero: 12-15 días'
        ]
      },
      basePrice: 0.65,
      priceUnit: 'stem',
      stockQuantity: 50000,
      minOrderQty: 500,
      imageUrl: '/assets/images/products/rosas-rojas.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['MPS', 'Rainforest Alliance', 'GlobalGAP', 'Flowerabel'],
      isActive: true,
      isFeatured: true
    }
  });

  // LARVAS DE CAMARÓN - Ecuador's aquaculture specialty, moved to marine category
  await prisma.product.upsert({
    where: { slug: 'larvas-camaron-postlarva' },
    update: {},
    create: {
      name: 'Larvas de Camarón Post-Larva',
      slug: 'larvas-camaron-postlarva',
      categoryId: marinosCategory.id, // Now correctly categorized under marine products
      description: 'Larvas de camarón libres de patógenos producidas en laboratorio certificado con tecnología de punta para acuicultura sustentable y desarrollo del sector camaronero ecuatoriano.',
      shortDescription: 'Larvas de camarón certificadas para acuicultura',
      sku: 'LAR-CAM-001',
      specifications: {
        species: 'Litopenaeus vannamei',
        stage: 'Post-larva PL10-PL15',
        density: '100,000-300,000 por caja',
        survival: '85% mínimo',
        packaging: 'Bolsas oxigenadas transportables',
        features: [
          'Especies: Litopenaeus vannamei',
          'Estadio: Post-larva PL10-PL15',
          'Libres de patógenos específicos',
          'Control genético y sanitario',
          'Asesoría técnica incluida'
        ]
      },
      basePrice: 0.008,
      priceUnit: 'unit',
      stockQuantity: 1000000,
      minOrderQty: 100000,
      imageUrl: '/assets/images/products/larvas-camaron.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['SENASA', 'OIRSA', 'Laboratorio Certificado', 'SPF'],
      isActive: true,
      isFeatured: true
    }
  });

  // AGUACATE HASS - Premium export avocado
  await prisma.product.upsert({
    where: { slug: 'aguacate-hass-premium' },
    update: {},
    create: {
      name: 'Aguacate Hass Premium',
      slug: 'aguacate-hass-premium',
      categoryId: agricolasCategory.id,
      description: 'Aguacate Hass de calidad exportación cultivado en Ecuador. Textura cremosa, sabor intenso y certificación orgánica disponible.',
      shortDescription: 'Aguacate Hass premium export quality',
      sku: 'AGU-HAS-001',
      specifications: {
        weight: '180-300g',
        size: '70-85mm',
        maturity: '21-26% aceite',
        harvest: 'Todo el año',
        packaging: 'Cajas de 4kg (14-18 unidades)',
        features: [
          'Peso: 180-300g por unidad',
          'Calibre: 70-85mm',
          'Contenido de aceite: 21-26%',
          'Vida útil: 7-14 días',
          'Certificación orgánica disponible'
        ]
      },
      basePrice: 3.50,
      priceUnit: 'kg',
      stockQuantity: 4000,
      minOrderQty: 500,
      imageUrl: '/assets/images/products/aguacate-hass.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['GlobalGAP', 'HACCP', 'Orgánico', 'Rainforest Alliance'],
      nutritionalInfo: {
        calories: 160,
        protein: '2g',
        carbs: '9g',
        fiber: '7g',
        fat: '15g',
        potassium: '485mg'
      },
      isActive: true,
      isFeatured: true
    }
  });

  // MANGO PREMIUM - Tommy Atkins variety
  await prisma.product.upsert({
    where: { slug: 'mango-tommy-atkins' },
    update: {},
    create: {
      name: 'Mango Tommy Atkins Premium',
      slug: 'mango-tommy-atkins',
      categoryId: agricolasCategory.id,
      description: 'Mango Tommy Atkins de exportación premium cultivado en la costa ecuatoriana. Frutos grandes, dulces y con excelente vida útil postcosecha.',
      shortDescription: 'Mango premium Tommy Atkins export quality',
      sku: 'MAN-TOM-001',
      specifications: {
        weight: '350-600g',
        size: '10-15cm',
        brix: '12-16°',
        harvest: 'Noviembre - Marzo',
        packaging: 'Cajas de 4kg (8-12 unidades)',
        features: [
          'Variedad: Tommy Atkins',
          'Peso: 350-600g por unidad',
          'Brix: 12-16 grados',
          'Vida útil: 15-21 días',
          'Resistente al transporte'
        ]
      },
      basePrice: 2.80,
      priceUnit: 'kg',
      stockQuantity: 6000,
      minOrderQty: 1000,
      imageUrl: '/assets/images/products/mango-tommy.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Noviembre - Marzo',
      certifications: ['GlobalGAP', 'HACCP', 'Orgánico', 'SENASA'],
      nutritionalInfo: {
        calories: 60,
        protein: '0.8g',
        carbs: '15g',
        fiber: '1.6g',
        vitaminC: '36.4mg',
        vitaminA: '54mcg'
      },
      isActive: true,
      isFeatured: true
    }
  });

  // CAFÉ ARÁBICA - Highland coffee from Ecuador
  await prisma.product.upsert({
    where: { slug: 'cafe-arabica-altura' },
    update: {},
    create: {
      name: 'Café Arábica de Altura Premium',
      slug: 'cafe-arabica-altura',
      categoryId: agricolasCategory.id,
      description: 'Granos de café cultivados en las montañas andinas ecuatorianas entre 1200-1800 msnm, reconocidos mundialmente por su calidad excepcional y perfil único.',
      shortDescription: 'Café arábica de altura 100% premium',
      sku: 'CAF-ARA-001',
      specifications: {
        altitude: '1200-1800 msnm',
        process: 'Lavado',
        roast: 'Grano verde',
        cupping: '84+ puntos SCA',
        packaging: 'Sacos de yute 69kg',
        features: [
          'Altitud: 1200-1800 msnm',
          'Proceso: Lavado',
          'Microclimas únicos',
          'Perfil: Cítrico y floral',
          'Comercio justo certificado'
        ]
      },
      basePrice: 6.20,
      priceUnit: 'kg',
      stockQuantity: 2000,
      minOrderQty: 100,
      imageUrl: '/assets/images/products/cafe-arabica.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Abril - Agosto',
      certifications: ['Orgánico', 'Comercio Justo', 'Rainforest Alliance', 'SCA'],
      isActive: true,
      isFeatured: true
    }
  });

  // ATÚN FRESCO - Fresh Pacific tuna
  await prisma.product.upsert({
    where: { slug: 'atun-fresco-pacifico' },
    update: {},
    create: {
      name: 'Atún Fresco del Pacífico',
      slug: 'atun-fresco-pacifico',
      categoryId: marinosCategory.id,
      description: 'Atún fresco capturado en las ricas aguas del Pacífico ecuatoriano con técnicas sustentables. Procesamiento inmediato post-captura.',
      shortDescription: 'Atún fresco captura sustentable',
      sku: 'ATU-FRE-001',
      specifications: {
        species: 'Thunnus albacares (Yellowfin)',
        weight: '15-80kg por pieza',
        temperature: '0-2°C',
        processing: 'Inmediato post-captura',
        packaging: 'Cajas isotérmicas',
        features: [
          'Especie: Atún aleta amarilla',
          'Captura sustentable MSC',
          'Procesamiento en barco',
          'Cadena de frío garantizada',
          'Trazabilidad completa'
        ]
      },
      basePrice: 12.50,
      priceUnit: 'kg',
      stockQuantity: 1500,
      minOrderQty: 50,
      imageUrl: '/assets/images/products/atun-fresco.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['MSC', 'HACCP', 'BRC', 'IUU-free'],
      nutritionalInfo: {
        calories: 144,
        protein: '23g',
        fat: '5g',
        omega3: '1.3g',
        iron: '1.0mg'
      },
      isActive: true,
      isFeatured: false
    }
  });

  // CALABAZA PREMIUM - Premium pumpkin
  await prisma.product.upsert({
    where: { slug: 'calabaza-premium' },
    update: {},
    create: {
      name: 'Calabaza Premium',
      slug: 'calabaza-premium',
      categoryId: agricolasCategory.id,
      description: 'Calabaza premium cultivada con métodos orgánicos en Ecuador. Rica en nutrientes y perfecta para exportación.',
      shortDescription: 'Calabaza orgánica premium',
      sku: 'CAL-PRE-001',
      specifications: {
        weight: '2-5kg',
        variety: 'Butternut, Kabocha',
        harvest: 'Junio - Diciembre',
        packaging: 'Cajas de 10kg',
        features: ['Cultivo orgánico', 'Rica en nutrientes', 'Vida útil extendida']
      },
      basePrice: 1.20,
      priceUnit: 'kg',
      stockQuantity: 2000,
      minOrderQty: 200,
      imageUrl: '/assets/images/products/calabaza-premium.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Junio - Diciembre',
      certifications: ['Orgánico', 'GlobalGAP'],
      isActive: true,
      isFeatured: false
    }
  });

  // CAMOTE DULCE - Sweet potato
  await prisma.product.upsert({
    where: { slug: 'camote-dulce' },
    update: {},
    create: {
      name: 'Camote Dulce',
      slug: 'camote-dulce',
      categoryId: agricolasCategory.id,
      description: 'Camote dulce ecuatoriano rico en nutrientes y vitaminas. Cultivo sustentable en la costa.',
      shortDescription: 'Camote dulce rico en nutrientes',
      sku: 'CAM-DUL-001',
      specifications: {
        weight: '150-400g',
        variety: 'Orange flesh, Purple',
        harvest: 'Todo el año',
        packaging: 'Cajas de 15kg',
        features: ['Rico en vitamina A', 'Antioxidantes naturales', 'Fibra alta']
      },
      basePrice: 0.90,
      priceUnit: 'kg',
      stockQuantity: 3000,
      minOrderQty: 300,
      imageUrl: '/assets/images/products/camote-dulce.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['GlobalGAP', 'HACCP'],
      isActive: true,
      isFeatured: false
    }
  });

  // CAÑA DE AZÚCAR - Sugar cane
  await prisma.product.upsert({
    where: { slug: 'cana-azucar' },
    update: {},
    create: {
      name: 'Caña de Azúcar',
      slug: 'cana-azucar',
      categoryId: agricolasCategory.id,
      description: 'Caña de azúcar ecuatoriana para procesamiento natural. Cultivo sustentable en la costa.',
      shortDescription: 'Caña de azúcar procesamiento natural',
      sku: 'CAN-AZU-001',
      specifications: {
        length: '2-3m',
        brix: '18-22°',
        harvest: 'Mayo - Noviembre',
        packaging: 'Atados de 25kg',
        features: ['Alto contenido de sacarosa', 'Procesamiento natural', 'Fibra aprovechable']
      },
      basePrice: 0.35,
      priceUnit: 'kg',
      stockQuantity: 5000,
      minOrderQty: 1000,
      imageUrl: '/assets/images/products/cana-azucar.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Mayo - Noviembre',
      certifications: ['GlobalGAP', 'Orgánico'],
      isActive: true,
      isFeatured: false
    }
  });

  // CEBOLLA PREMIUM - Premium onion
  await prisma.product.upsert({
    where: { slug: 'cebolla-premium' },
    update: {},
    create: {
      name: 'Cebolla Premium',
      slug: 'cebolla-premium',
      categoryId: agricolasCategory.id,
      description: 'Cebolla premium de variedades selectas cultivada en Ecuador. Sabor intenso y larga conservación.',
      shortDescription: 'Cebolla variedades selectas',
      sku: 'CEB-PRE-001',
      specifications: {
        size: '60-80mm',
        variety: 'Red, Yellow, White',
        harvest: 'Junio - Octubre',
        packaging: 'Sacos de 25kg',
        features: ['Variedades selectas', 'Sabor intenso', 'Larga conservación']
      },
      basePrice: 0.75,
      priceUnit: 'kg',
      stockQuantity: 4000,
      minOrderQty: 500,
      imageUrl: '/assets/images/products/cebolla-premium.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Junio - Octubre',
      certifications: ['GlobalGAP', 'HACCP'],
      isActive: true,
      isFeatured: false
    }
  });

  // CHAYOTE ORGÁNICO - Organic chayote
  await prisma.product.upsert({
    where: { slug: 'chayote-organico' },
    update: {},
    create: {
      name: 'Chayote Orgánico',
      slug: 'chayote-organico',
      categoryId: agricolasCategory.id,
      description: 'Chayote orgánico certificado internacionalmente. Bajo en calorías y rico en nutrientes.',
      shortDescription: 'Chayote certificado internacional',
      sku: 'CHA-ORG-001',
      specifications: {
        weight: '200-500g',
        variety: 'Verde claro, Verde oscuro',
        harvest: 'Todo el año',
        packaging: 'Cajas de 12kg',
        features: ['Certificación orgánica', 'Bajo en calorías', 'Rico en vitamina C']
      },
      basePrice: 1.10,
      priceUnit: 'kg',
      stockQuantity: 2500,
      minOrderQty: 250,
      imageUrl: '/assets/images/products/chayote-organico.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['Orgánico', 'GlobalGAP', 'HACCP'],
      isActive: true,
      isFeatured: false
    }
  });

  // COCO TROPICAL - Tropical coconut
  await prisma.product.upsert({
    where: { slug: 'coco-tropical' },
    update: {},
    create: {
      name: 'Coco Tropical',
      slug: 'coco-tropical',
      categoryId: agricolasCategory.id,
      description: 'Coco tropical de la costa ecuatoriana. Agua de coco natural y pulpa fresca.',
      shortDescription: 'Coco costa ecuatoriana',
      sku: 'COC-TRO-001',
      specifications: {
        weight: '800-1500g',
        variety: 'Malayo Enano, Gigante',
        harvest: 'Todo el año',
        packaging: 'Cajas de 15 unidades',
        features: ['Agua natural', 'Pulpa fresca', 'Rico en electrolitos']
      },
      basePrice: 0.85,
      priceUnit: 'unit',
      stockQuantity: 3000,
      minOrderQty: 100,
      imageUrl: '/assets/images/products/coco-tropical.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['GlobalGAP', 'HACCP'],
      isActive: true,
      isFeatured: false
    }
  });

  // CÚRCUMA - Turmeric
  await prisma.product.upsert({
    where: { slug: 'curcuma' },
    update: {},
    create: {
      name: 'Cúrcuma',
      slug: 'curcuma',
      categoryId: agricolasCategory.id,
      description: 'Cúrcuma ecuatoriana con propiedades medicinales. Rica en curcumina y antioxidantes.',
      shortDescription: 'Cúrcuma propiedades medicinales',
      sku: 'CUR-CUM-001',
      specifications: {
        form: 'Fresca, Seca en polvo',
        curcumin: '3-5%',
        harvest: 'Agosto - Diciembre',
        packaging: 'Cajas de 5kg',
        features: ['Rica en curcumina', 'Propiedades antiinflamatorias', 'Antioxidante natural']
      },
      basePrice: 4.50,
      priceUnit: 'kg',
      stockQuantity: 1000,
      minOrderQty: 50,
      imageUrl: '/assets/images/products/curcuma.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Agosto - Diciembre',
      certifications: ['Orgánico', 'GlobalGAP'],
      isActive: true,
      isFeatured: false
    }
  });

  // JENGIBRE FRESCO - Fresh ginger
  await prisma.product.upsert({
    where: { slug: 'jengibre-fresco' },
    update: {},
    create: {
      name: 'Jengibre Fresco',
      slug: 'jengibre-fresco',
      categoryId: agricolasCategory.id,
      description: 'Jengibre fresco de calidad exportación. Sabor intenso y propiedades medicinales.',
      shortDescription: 'Jengibre calidad exportación',
      sku: 'JEN-FRE-001',
      specifications: {
        form: 'Rizoma fresco',
        moisture: '80-85%',
        harvest: 'Septiembre - Enero',
        packaging: 'Cajas de 10kg',
        features: ['Sabor intenso', 'Propiedades digestivas', 'Antiinflamatorio natural']
      },
      basePrice: 3.20,
      priceUnit: 'kg',
      stockQuantity: 1500,
      minOrderQty: 100,
      imageUrl: '/assets/images/products/jengibre-fresco.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Septiembre - Enero',
      certifications: ['GlobalGAP', 'HACCP', 'Orgánico'],
      isActive: true,
      isFeatured: false
    }
  });

  // Continue with more products...

  // ÑAME TROPICAL - Tropical yam
  await prisma.product.upsert({
    where: { slug: 'name-tropical' },
    update: {},
    create: {
      name: 'Ñame Tropical',
      slug: 'name-tropical',
      categoryId: agricolasCategory.id,
      description: 'Ñame tropical de variedades autóctonas ecuatorianas. Tubérculo nutritivo y versátil.',
      shortDescription: 'Ñame variedades autóctonas',
      sku: 'NAM-TRO-001',
      specifications: {
        weight: '500-2000g',
        variety: 'Blanco, Morado',
        harvest: 'Julio - Noviembre',
        packaging: 'Sacos de 20kg',
        features: ['Variedades autóctonas', 'Alto contenido nutricional', 'Versátil en cocina']
      },
      basePrice: 1.40,
      priceUnit: 'kg',
      stockQuantity: 2000,
      minOrderQty: 200,
      imageUrl: '/assets/images/products/name-tropical.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Julio - Noviembre',
      certifications: ['GlobalGAP', 'HACCP'],
      isActive: true,
      isFeatured: false
    }
  });

  // ÑAMPÍ - Andean tuber
  await prisma.product.upsert({
    where: { slug: 'nampi' },
    update: {},
    create: {
      name: 'Ñampí',
      slug: 'nampi',
      categoryId: agricolasCategory.id,
      description: 'Ñampí, tubérculo andino tradicional ecuatoriano. Rico en almidón y minerales.',
      shortDescription: 'Ñampí tubérculo andino',
      sku: 'NAM-PI-001',
      specifications: {
        weight: '300-800g',
        variety: 'Tradicional andino',
        harvest: 'Junio - Octubre',
        packaging: 'Sacos de 18kg',
        features: ['Tubérculo andino', 'Rico en almidón', 'Tradicional ecuatoriano']
      },
      basePrice: 1.60,
      priceUnit: 'kg',
      stockQuantity: 1500,
      minOrderQty: 150,
      imageUrl: '/assets/images/products/nampi.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Junio - Octubre',
      certifications: ['GlobalGAP', 'Orgánico'],
      isActive: true,
      isFeatured: false
    }
  });

  // PALMITO ORGÁNICO - Organic palm heart
  await prisma.product.upsert({
    where: { slug: 'palmito-organico' },
    update: {},
    create: {
      name: 'Palmito Orgánico',
      slug: 'palmito-organico',
      categoryId: agricolasCategory.id,
      description: 'Palmito orgánico sustentable certificado. Cosecha responsable de palma de pejibaye.',
      shortDescription: 'Palmito sustentable certificado',
      sku: 'PAL-ORG-001',
      specifications: {
        diameter: '2-4cm',
        length: '15-20cm',
        harvest: 'Todo el año',
        packaging: 'Frascos de vidrio 450g',
        features: ['Cultivo sustentable', 'Certificación orgánica', 'Cosecha responsable']
      },
      basePrice: 8.50,
      priceUnit: 'kg',
      stockQuantity: 800,
      minOrderQty: 50,
      imageUrl: '/assets/images/products/palmito-organico.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['Orgánico', 'Rainforest Alliance', 'FSC'],
      isActive: true,
      isFeatured: false
    }
  });

  // PAPAYA HAWAIANA - Hawaiian papaya
  await prisma.product.upsert({
    where: { slug: 'papaya-hawaiana' },
    update: {},
    create: {
      name: 'Papaya Hawaiana',
      slug: 'papaya-hawaiana',
      categoryId: agricolasCategory.id,
      description: 'Papaya hawaiana de dulzura natural cultivada en Ecuador. Rica en enzimas digestivas.',
      shortDescription: 'Papaya dulzura natural',
      sku: 'PAP-HAW-001',
      specifications: {
        weight: '800-2500g',
        brix: '11-13°',
        harvest: 'Todo el año',
        packaging: 'Cajas de 12kg',
        features: ['Dulzura natural', 'Rica en papaína', 'Enzimas digestivas']
      },
      basePrice: 1.80,
      priceUnit: 'kg',
      stockQuantity: 3000,
      minOrderQty: 300,
      imageUrl: '/assets/images/products/papaya-hawaiana.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['GlobalGAP', 'HACCP', 'Orgánico'],
      isActive: true,
      isFeatured: false
    }
  });

  // PIÑA GOLDEN - Golden pineapple MD2
  await prisma.product.upsert({
    where: { slug: 'pina-golden' },
    update: {},
    create: {
      name: 'Piña Golden MD2',
      slug: 'pina-golden',
      categoryId: agricolasCategory.id,
      description: 'Piña Golden MD2 de máxima calidad cultivada en Ecuador. Dulzura excepcional y bajo contenido ácido.',
      shortDescription: 'Piña MD2 máxima calidad',
      sku: 'PIN-GOL-001',
      specifications: {
        weight: '1200-2500g',
        brix: '15-18°',
        variety: 'MD2 Golden',
        harvest: 'Todo el año',
        packaging: 'Cajas de 12kg',
        features: ['Variedad MD2', 'Dulzura excepcional', 'Bajo contenido ácido']
      },
      basePrice: 2.20,
      priceUnit: 'kg',
      stockQuantity: 4000,
      minOrderQty: 400,
      imageUrl: '/assets/images/products/pina-golden.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['GlobalGAP', 'HACCP', 'Rainforest Alliance'],
      isActive: true,
      isFeatured: false
    }
  });

  // PLÁTANO VERDE - Green plantain
  await prisma.product.upsert({
    where: { slug: 'platano-verde' },
    update: {},
    create: {
      name: 'Plátano Verde',
      slug: 'platano-verde',
      categoryId: agricolasCategory.id,
      description: 'Plátano verde ecuatoriano para exportación. Ideal para procesamiento industrial y consumo.',
      shortDescription: 'Plátano verde para exportación',
      sku: 'PLA-VER-001',
      specifications: {
        weight: '200-400g',
        length: '20-25cm',
        harvest: 'Todo el año',
        packaging: 'Cajas de 18kg',
        features: ['Para exportación', 'Procesamiento industrial', 'Rico en almidón']
      },
      basePrice: 0.70,
      priceUnit: 'kg',
      stockQuantity: 8000,
      minOrderQty: 1000,
      imageUrl: '/assets/images/products/platano-verde.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['GlobalGAP', 'HACCP', 'Rainforest Alliance'],
      isActive: true,
      isFeatured: false
    }
  });

  // YUCA PREMIUM - Premium cassava
  await prisma.product.upsert({
    where: { slug: 'yuca-premium' },
    update: {},
    create: {
      name: 'Yuca Premium',
      slug: 'yuca-premium',
      categoryId: agricolasCategory.id,
      description: 'Yuca premium para procesamiento industrial. Tubérculo versátil y nutritivo.',
      shortDescription: 'Yuca procesamiento industrial',
      sku: 'YUC-PRE-001',
      specifications: {
        length: '20-40cm',
        diameter: '3-8cm',
        harvest: 'Todo el año',
        packaging: 'Sacos de 25kg',
        features: ['Procesamiento industrial', 'Alto contenido de almidón', 'Versátil uso']
      },
      basePrice: 0.60,
      priceUnit: 'kg',
      stockQuantity: 6000,
      minOrderQty: 1000,
      imageUrl: '/assets/images/products/yuca-premium.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['GlobalGAP', 'HACCP'],
      isActive: true,
      isFeatured: false
    }
  });

  // ÁRBOLES DE MANGO - Mango trees
  await prisma.product.upsert({
    where: { slug: 'arboles-mango' },
    update: {},
    create: {
      name: 'Árboles de Mango',
      slug: 'arboles-mango',
      categoryId: otrosCategory.id,
      description: 'Árboles de mango de variedades tropicales para cultivo. Plantas certificadas y adaptadas.',
      shortDescription: 'Árboles mango variedades tropicales',
      sku: 'ARB-MAN-001',
      specifications: {
        height: '50-80cm',
        varieties: 'Tommy Atkins, Kent, Keitt',
        age: '6-12 meses',
        packaging: 'Bolsas individuales',
        features: ['Variedades tropicales', 'Plantas certificadas', 'Adaptadas al clima']
      },
      basePrice: 15.00,
      priceUnit: 'unit',
      stockQuantity: 500,
      minOrderQty: 50,
      imageUrl: '/assets/images/products/arboles-mango.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['SENASA', 'Fitosanitario'],
      isActive: true,
      isFeatured: false
    }
  });

  // ÁRBOLES DE AGUACATE - Avocado trees
  await prisma.product.upsert({
    where: { slug: 'arboles-aguacate' },
    update: {},
    create: {
      name: 'Árboles de Aguacate',
      slug: 'arboles-aguacate',
      categoryId: otrosCategory.id,
      description: 'Árboles de aguacate Hass y criollos para cultivo comercial. Plantas injertadas certificadas.',
      shortDescription: 'Árboles aguacate Hass y criollos',
      sku: 'ARB-AGU-001',
      specifications: {
        height: '60-100cm',
        varieties: 'Hass, Fuerte, Criollo',
        age: '8-18 meses',
        packaging: 'Contenedores individuales',
        features: ['Plantas injertadas', 'Certificación fitosanitaria', 'Variedades comerciales']
      },
      basePrice: 18.00,
      priceUnit: 'unit',
      stockQuantity: 400,
      minOrderQty: 25,
      imageUrl: '/assets/images/products/arboles-aguacate.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['SENASA', 'Fitosanitario'],
      isActive: true,
      isFeatured: false
    }
  });

  // ÁRBOLES CÍTRICOS - Citrus trees
  await prisma.product.upsert({
    where: { slug: 'arboles-citricos' },
    update: {},
    create: {
      name: 'Árboles Cítricos',
      slug: 'arboles-citricos',
      categoryId: otrosCategory.id,
      description: 'Árboles cítricos: naranja, limón, mandarina para cultivo comercial. Variedades adaptadas.',
      shortDescription: 'Árboles naranja, limón, mandarina',
      sku: 'ARB-CIT-001',
      specifications: {
        height: '50-80cm',
        varieties: 'Naranja Valencia, Limón Tahití, Mandarina',
        age: '6-15 meses',
        packaging: 'Bolsas individuales',
        features: ['Variedades comerciales', 'Adaptadas al trópico', 'Certificación sanitaria']
      },
      basePrice: 12.00,
      priceUnit: 'unit',
      stockQuantity: 600,
      minOrderQty: 50,
      imageUrl: '/assets/images/products/arboles-citricos.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['SENASA', 'Fitosanitario'],
      isActive: true,
      isFeatured: false
    }
  });

  // NUECES DE MACADAMIA - Macadamia nuts
  await prisma.product.upsert({
    where: { slug: 'nueces-macadamia' },
    update: {},
    create: {
      name: 'Nueces de Macadamia',
      slug: 'nueces-macadamia',
      categoryId: otrosCategory.id,
      description: 'Nueces de macadamia de cultivo especializado en Ecuador. Premium quality con certificación.',
      shortDescription: 'Nueces macadamia cultivo especializado',
      sku: 'NUE-MAC-001',
      specifications: {
        size: '18-22mm',
        moisture: '1.5% máximo',
        harvest: 'Marzo - Agosto',
        packaging: 'Bolsas vacuum 5kg',
        features: ['Cultivo especializado', 'Premium quality', 'Procesamiento artesanal']
      },
      basePrice: 25.00,
      priceUnit: 'kg',
      stockQuantity: 300,
      minOrderQty: 20,
      imageUrl: '/assets/images/products/nueces-macadamia.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Marzo - Agosto',
      certifications: ['Orgánico', 'GlobalGAP'],
      isActive: true,
      isFeatured: false
    }
  });

  // NUECES PECANAS - Pecan nuts
  await prisma.product.upsert({
    where: { slug: 'nueces-pecanas' },
    update: {},
    create: {
      name: 'Nueces Pecanas',
      slug: 'nueces-pecanas',
      categoryId: otrosCategory.id,
      description: 'Nueces pecanas adaptadas al trópico ecuatoriano. Cultivo innovador con técnicas especializadas.',
      shortDescription: 'Nueces pecanas adaptadas al trópico',
      sku: 'NUE-PEC-001',
      specifications: {
        size: '15-20mm',
        moisture: '3% máximo',
        harvest: 'Abril - Septiembre',
        packaging: 'Bolsas vacuum 5kg',
        features: ['Adaptadas al trópico', 'Cultivo innovador', 'Técnicas especializadas']
      },
      basePrice: 22.00,
      priceUnit: 'kg',
      stockQuantity: 200,
      minOrderQty: 15,
      imageUrl: '/assets/images/products/nueces-pecanas.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Abril - Septiembre',
      certifications: ['Orgánico', 'GlobalGAP'],
      isActive: true,
      isFeatured: false
    }
  });

  // ALMENDRAS TROPICALES - Tropical almonds
  await prisma.product.upsert({
    where: { slug: 'almendras-tropicales' },
    update: {},
    create: {
      name: 'Almendras Tropicales',
      slug: 'almendras-tropicales',
      categoryId: otrosCategory.id,
      description: 'Almendras tropicales de variedades ecuatorianas. Cultivo tradicional con métodos modernos.',
      shortDescription: 'Almendras variedades ecuatorianas',
      sku: 'ALM-TRO-001',
      specifications: {
        size: '12-18mm',
        moisture: '4% máximo',
        harvest: 'Febrero - Julio',
        packaging: 'Bolsas vacuum 5kg',
        features: ['Variedades ecuatorianas', 'Cultivo tradicional', 'Métodos modernos']
      },
      basePrice: 18.00,
      priceUnit: 'kg',
      stockQuantity: 400,
      minOrderQty: 25,
      imageUrl: '/assets/images/products/almendras-tropicales.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Febrero - Julio',
      certifications: ['Orgánico', 'GlobalGAP'],
      isActive: true,
      isFeatured: false
    }
  });

  console.log('✅ Comprehensive Ecuadorian export database seeded successfully!');
  console.log('📊 Created:');
  console.log('  - 3 Ecuadorian export categories: Agrícolas, Marinos y de la Pesca, Otros Productos');
  console.log('  - 26 premium export products: Complete catalog matching page.tsx products');
  console.log('  - 2 admin users with contact details');
  console.log('  - All products include detailed specifications, certifications, and export standards');
  console.log('  - Categories reflect Ecuador\'s main export industries and products');
  console.log('  - Larvas de Camarón correctly categorized under Marinos y de la Pesca');
  console.log('  - All products from static page now available in database');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });