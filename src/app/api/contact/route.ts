import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactSubmissionSchema } from '@/lib/validations';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactSubmissionSchema.parse(body);
    
    const contactSubmission = await prisma.contactSubmission.create({
      data: validatedData
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'CONTACT_SUBMISSION',
        entityType: 'ContactSubmission',
        entityId: contactSubmission.id,
        details: JSON.stringify({
          contactId: contactSubmission.id,
          email: contactSubmission.email,
          type: contactSubmission.type,
          company: contactSubmission.company
        })
      }
    });

    return NextResponse.json({
      error: false,
      data: { id: contactSubmission.id },
      message: 'Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto.',
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating contact submission:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: true,
        message: 'Datos del formulario inválidos',
        details: error.issues,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    return NextResponse.json({
      error: true,
      message: 'Error interno del servidor al enviar mensaje',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '10'), 100);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const [submissions, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.contactSubmission.count({ where })
    ]);

    return NextResponse.json({
      error: false,
      data: submissions,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    
    return NextResponse.json({
      error: true,
      message: 'Error interno del servidor al obtener mensajes',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}