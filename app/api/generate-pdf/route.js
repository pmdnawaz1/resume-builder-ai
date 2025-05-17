import { NextResponse } from 'next/server';
import { generatePDF } from '@/lib/generatePdf';

export async function POST(request) {
  try {
    const data = await request.json();
    const pdfBuffer = await generatePDF(data);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${data.personalInfo.fullName.replace(/\s+/g, '_')}_resume.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to generate PDF' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}