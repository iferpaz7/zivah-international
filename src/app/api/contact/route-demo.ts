import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const cuerpo = await request.json()
    
    // Validar campos requeridos
    const { nombre, email, empresa, mensaje, productosInteres, pais, telefono } = cuerpo
    
    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { exitoso: false, error: 'Nombre, email y mensaje son campos requeridos' },
        { status: 400 }
      )
    }
    
    // Validar formato de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regexEmail.test(email)) {
      return NextResponse.json(
        { exitoso: false, error: 'Formato de email inválido' },
        { status: 400 }
      )
    }
    
    // En una aplicación real, se haría:
    // 1. Guardar en base de datos usando Prisma
    // 2. Enviar notificación por email
    // 3. Agregar al sistema CRM
    // 4. Enviar mensaje de WhatsApp si se proporciona teléfono
    
    console.log('Solicitud de cotización recibida:', {
      nombre,
      email,
      empresa,
      mensaje,
      productosInteres,
      pais,
      telefono,
      fechaHora: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
    })
    
    // Simular envío de email
    // await enviarEmailContacto({ nombre, email, empresa, mensaje, productosInteres, pais })
    
    // Simular notificación a WhatsApp Business
    // await enviarNotificacionWhatsApp({ nombre, empresa, productosInteres, pais })
    
    return NextResponse.json({
      exitoso: true,
      mensaje: '¡Gracias por tu solicitud! Nuestro equipo te contactará dentro de 24 horas.',
      tiempoRespuesta: '24 horas',
      siguientesPasos: [
        'Revisaremos tu solicitud en detalle',
        'Te contactaremos para aclarar especificaciones',
        'Enviaremos cotización personalizada',
        'Coordinaremos términos de envío'
      ]
    })
  } catch (error) {
    console.error('Error en API de contacto:', error)
    return NextResponse.json(
      { exitoso: false, error: 'Error al enviar mensaje. Por favor intenta nuevamente.' },
      { status: 500 }
    )
  }
}