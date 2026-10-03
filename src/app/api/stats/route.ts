import { NextResponse } from 'next/server';
import { calculateFinOpsMetrics } from '@/lib/mock-engine';

export async function GET() {
  const stats = calculateFinOpsMetrics();
  return NextResponse.json({ stats });
}
