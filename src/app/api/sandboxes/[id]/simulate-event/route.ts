import { NextResponse } from 'next/server';
import { injectDiagnosticEvent } from '@/lib/mock-engine';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const updatedSandbox = injectDiagnosticEvent(id, body);
  if (!updatedSandbox) {
    return NextResponse.json(
      { error: 'Sandbox not found or already terminated' },
      { status: 404 }
    );
  }

  return NextResponse.json({ sandbox: updatedSandbox });
}
