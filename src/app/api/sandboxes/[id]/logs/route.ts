import { NextResponse } from 'next/server';
import { getCloudWatchLogs } from '@/lib/aws-service';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const logs = await getCloudWatchLogs(id === 'all' ? undefined : id);
    return NextResponse.json({ logs });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch logs', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
