import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  try {
    // In production, we would check for admin access here
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    }

    console.log('Refreshing Supabase schema cache...');

    // Refresh the schema cache by calling the PostgREST admin endpoint
    // This tells PostgREST to reload its schema cache
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceRoleKey,
        'Authorization': `Bearer ${supabaseServiceRoleKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Alternative method: force a schema refresh by making a small schema change
    // This is more reliable as it forces PostgREST to reload
    await supabaseAdmin.rpc('exec_sql', {
      sql: `
        -- Force schema cache refresh by sending a NOTIFY signal to PostgREST
        NOTIFY pgrst, 'reload schema';
        
        -- Also update a system table to trigger schema reload
        COMMENT ON TABLE public.workout_exercises IS 'Workout exercises junction table - updated to refresh schema cache';
      `
    });

    console.log('Schema cache refresh completed');

    return NextResponse.json({ 
      success: true, 
      message: 'Schema cache refreshed successfully'
    });
  } catch (error) {
    console.error('Schema refresh error:', error);
    return NextResponse.json({ 
      error: 'Schema refresh failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 