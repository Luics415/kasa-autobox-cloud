import { NextResponse } from 'next/server';
import { getCloudWatchLogs } from '@/lib/aws-service';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const logs = await getCloudWatchLogs(id);
  return NextResponse.json({ logs });
}
