import { NextResponse } from 'next/server';
import { fetchAllSandboxes, provisionSandbox } from '@/lib/aws-service';

export async function GET() {
  try {
    const sandboxes = await fetchAllSandboxes();
    return NextResponse.json({ sandboxes });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch sandboxes', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { templateId, ttlMinutes, vehicleVin, customName } = body;

    if (!templateId || !ttlMinutes) {
      return NextResponse.json(
        { error: 'Missing required fields: templateId, ttlMinutes' },
        { status: 400 }
      );
    }

    const newSandbox = await provisionSandbox({
      templateId,
      ttlMinutes: Number(ttlMinutes),
      vehicleVin,
      customName,
    });

    return NextResponse.json({ sandbox: newSandbox }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to provision sandbox', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
