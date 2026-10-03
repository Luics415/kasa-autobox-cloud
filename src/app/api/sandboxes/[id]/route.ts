import { NextResponse } from 'next/server';
import { stopSandbox } from '@/lib/aws-service';
import { extendTtl, getSandboxById } from '@/lib/mock-engine';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sandbox = getSandboxById(id);
  if (!sandbox) {
    return NextResponse.json({ error: 'Sandbox not found' }, { status: 404 });
  }
  return NextResponse.json({ sandbox });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = await stopSandbox(id);
  if (!success) {
    return NextResponse.json({ error: 'Failed to terminate sandbox' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: `Sandbox ${id} marked for termination.` });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const additionalMinutes = Number(body.additionalMinutes || 30);

  const updated = extendTtl(id, additionalMinutes);
  if (!updated) {
    return NextResponse.json({ error: 'Sandbox not found or already terminated' }, { status: 404 });
  }

  return NextResponse.json({ sandbox: updated });
}
