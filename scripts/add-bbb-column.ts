import { createClient } from '@supabase/supabase-js'

// This script adds the bbb_accredited column to the contractors table
async function addBbbColumn() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables')
    console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log('🔧 Adding bbb_accredited column to contractors table...')
    
    // Add the column
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE contractors 
        ADD COLUMN IF NOT EXISTS bbb_accredited BOOLEAN DEFAULT FALSE;
      `
    })

    if (error) {
      console.error('❌ Error adding column:', error)
      process.exit(1)
    }

    console.log('✅ Successfully added bbb_accredited column')

    // Add comment
    await supabase.rpc('exec_sql', {
      sql: `
        COMMENT ON COLUMN contractors.bbb_accredited IS 'Indicates if the contractor is BBB (Better Business Bureau) accredited';
      `
    })

    // Create index
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_contractors_bbb_accredited ON contractors(bbb_accredited);
      `
    })

    console.log('✅ Successfully added comment and index')
    console.log('🎉 Migration completed successfully!')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

addBbbColumn()
