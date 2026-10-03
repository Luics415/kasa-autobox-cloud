import { NextResponse } from 'next/server';
import { fetchArchivedSandboxes, provisionSandbox } from '@/lib/aws-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = (searchParams.get('filter') as 'week' | 'month' | 'year') || 'month';

    const archived = await fetchArchivedSandboxes(filter);
    
    // Calculate aggregate metrics for the archive
    const totalStoredKb = archived.reduce((acc, item) => acc + item.compressedSizeKb, 0);
    const totalHistoricalCost = archived.reduce((acc, item) => acc + item.estimatedCostUsd, 0);

    return NextResponse.json({
      filter,
      count: archived.length,
      totalStoredKb: Number(totalStoredKb.toFixed(1)),
      totalHistoricalCost: Number(totalHistoricalCost.toFixed(2)),
      archivedSandboxes: archived,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch archived sandboxes', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Restore / Relaunch from cold storage
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { templateId, vehicleVin, customName, ttlMinutes } = body;

    const result = await provisionSandbox({
      templateId,
      ttlMinutes: Number(ttlMinutes || 45),
      vehicleVin,
      customName: customName || 'Relaunched from Cold Archive',
      action: 'force_duplicate',
    });

    return NextResponse.json({ sandbox: result.sandbox }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to restore sandbox', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
