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
    const { templateId, ttlMinutes, vehicleVin, customName, action } = body;

    if (!templateId || !ttlMinutes) {
      return NextResponse.json(
        { error: 'Missing required fields: templateId, ttlMinutes' },
        { status: 400 }
      );
    }

    const result = await provisionSandbox({
      templateId,
      ttlMinutes: Number(ttlMinutes),
      vehicleVin,
      customName,
      action,
    });

    if (result.conflict) {
      return NextResponse.json(
        { 
          conflict: true, 
          message: 'An active sandbox is already running for this vehicle.',
          existingSandbox: result.existingSandbox 
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ sandbox: result.sandbox }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to provision sandbox', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
