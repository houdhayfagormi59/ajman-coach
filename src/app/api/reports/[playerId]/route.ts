import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { createClient } from '@/lib/supabase/server';
import PlayerReport from '@/lib/pdf/playerReport';
import type { Player, Injury, Performance, Evaluation } from '@/lib/types';

export async function GET(
  _: NextRequest,
  { params }: { params: { playerId: string } }
) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [pR, iR, perfR, eR, cR] = await Promise.all([
    supabase.from('players').select('*').eq('id', params.playerId).single(),
    supabase.from('injuries').select('*').eq('player_id', params.playerId),
    supabase.from('performances').select('*').eq('player_id', params.playerId),
    supabase.from('evaluations').select('*').eq('player_id', params.playerId).limit(1),
    supabase.from('coaches').select('full_name').eq('id', user.id).single(),
  ]);

  if (!pR.data) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
  }

  const player = pR.data as Player;

  const injuries = (iR.data ?? []) as Injury[];
  const performances = (perfR.data ?? []) as Performance[];
  const evaluation = (eR.data?.[0] ?? null) as Evaluation | null;

  const coachName = cR.data?.full_name || user.email || 'Coach';
  const generatedAt = new Date().toLocaleString('en-GB');

  // ✅ CORRECT: pass JSX directly (NO React.createElement)
  const stream = await renderToStream(
    <PlayerReport
      player={player}
      injuries={injuries}
      performances={performances}
      evaluation={evaluation}
      coachName={coachName}
      generatedAt={generatedAt}
    />
  );

  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${player.last_name}-report.pdf"`,
    },
  });
}