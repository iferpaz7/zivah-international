import { NextRequest, NextResponse } from 'next/server'

// Productos ecuatorianos para el demo - contenido en español
const productos = [
  {
    id: 1,
    nombre: 'Camarón Blanco Premium',
    categoria: 'mariscos',
    descripcion: 'Camarón blanco vannamei fresco ecuatoriano, cosechado de manera sustentable',
    precio: 25.99,
    enStock: true,
    origen: 'Ecuador',
    certificaciones: ['HACCP', 'BRC'],
  },
  {
    id: 2,
    nombre: 'Café Arábica de Altura',
    categoria: 'cafe',
    descripcion: 'Granos de café arábica de origen único cultivados en las montañas andinas ecuatorianas',
    precio: 18.50,
    enStock: true,
    origen: 'Ecuador',
    certificaciones: ['Comercio Justo', 'Orgánico'],
  },
  {
    id: 3,
    nombre: 'Bananas Premium',
    categoria: 'frutas',
    descripcion: 'Bananas Cavendish premium, perfecta maduración para exportación',
    precio: 3.99,
    enStock: true,
    origen: 'Ecuador',
    certificaciones: ['GlobalGAP'],
  },
  {
    id: 4,
    nombre: 'Mango Tommy Atkins',
    categoria: 'frutas', 
    descripcion: 'Mangos Tommy Atkins y Kent de calidad premium para exportación',
    precio: 4.50,
    enStock: true,
    origen: 'Ecuador',
    certificaciones: ['GlobalGAP', 'Orgánico'],
  },
  {
    id: 5,
    nombre: 'Larvas de Camarón',
    categoria: 'larvas',
    descripcion: 'Larvas de camarón vannamei libres de patógenos del laboratorio certificado',
    precio: 45.00,
    enStock: true,
    origen: 'Ecuador',
    certificaciones: ['BAP', 'Laboratorio Certificado'],
  },
  {
    id: 6,
    nombre: 'Aguacate Hass',
    categoria: 'frutas',
    descripcion: 'Aguacate Hass premium de calidad exportación',
    precio: 5.99,
    enStock: true,
    origen: 'Ecuador',
    certificaciones: ['GlobalGAP'],
  },
  {
    id: 7,
    nombre: 'Palmito Orgánico',
    categoria: 'frutas',
    descripcion: 'Palmito orgánico sustentable certificado',
    precio: 8.50,
    enStock: true,
    origen: 'Ecuador',
    certificaciones: ['Orgánico USDA', 'Sustentable'],
  },
  {
    id: 8,
    nombre: 'Piña Golden MD2',
    categoria: 'frutas',
    descripcion: 'Piña Golden MD2 premium con dulzura natural',
    precio: 4.25,
    enStock: true,
    origen: 'Ecuador',
    certificaciones: ['GlobalGAP'],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')
    const busqueda = searchParams.get('busqueda')
    
    let productosFiltrados = productos
    
    if (categoria) {
      productosFiltrados = productos.filter(producto => producto.categoria === categoria)
    }
    
    if (busqueda) {
      const termino = busqueda.toLowerCase()
      productosFiltrados = productosFiltrados.filter(producto => 
        producto.nombre.toLowerCase().includes(termino) ||
        producto.descripcion.toLowerCase().includes(termino) ||
        producto.categoria.toLowerCase().includes(termino)
      )
    }
    
    return NextResponse.json({
      exitoso: true,
      datos: productosFiltrados,
      total: productosFiltrados.length,
      categorias: ['frutas', 'mariscos', 'cafe', 'larvas', 'arboles', 'nueces'],
    })
  } catch (error) {
    console.error('Error en API de productos:', error)
    return NextResponse.json(
      { exitoso: false, error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const cuerpo = await request.json()
    
    // Validar campos requeridos
    if (!cuerpo.nombre || !cuerpo.categoria || !cuerpo.precio) {
      return NextResponse.json(
        { exitoso: false, error: 'Faltan campos requeridos: nombre, categoría y precio' },
        { status: 400 }
      )
    }
    
    // En una aplicación real, guardar en la base de datos usando Prisma
    const nuevoProducto = {
      id: productos.length + 1,
      ...cuerpo,
      enStock: true,
      origen: 'Ecuador',
      certificaciones: cuerpo.certificaciones || [],
    }
    
    productos.push(nuevoProducto)
    
    return NextResponse.json({
      exitoso: true,
      datos: nuevoProducto,
      mensaje: 'Producto creado exitosamente',
    }, { status: 201 })
  } catch (error) {
    console.error('Error en API de productos:', error)
    return NextResponse.json(
      { exitoso: false, error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}