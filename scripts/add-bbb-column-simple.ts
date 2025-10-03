import { createClient } from '@supabase/supabase-js'

// This script adds the bbb_accredited column to the contractors table
async function addBbbColumn() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables')
    console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    console.log('🔧 Adding bbb_accredited column to contractors table...')
    
    // Try to add the column using a simple SQL query
    const { data, error } = await supabase
      .from('contractors')
      .select('id')
      .limit(1)

    if (error) {
      console.error('❌ Error connecting to database:', error)
      process.exit(1)
    }

    console.log('✅ Connected to database successfully')
    console.log('📝 Please run the following SQL in your Supabase SQL Editor:')
    console.log('')
    console.log('-- Add BBB Accredited Column to Contractors Table')
    console.log('ALTER TABLE contractors ADD COLUMN IF NOT EXISTS bbb_accredited BOOLEAN DEFAULT FALSE;')
    console.log('')
    console.log('-- Add comment')
    console.log("COMMENT ON COLUMN contractors.bbb_accredited IS 'Indicates if the contractor is BBB (Better Business Bureau) accredited';")
    console.log('')
    console.log('-- Create index')
    console.log('CREATE INDEX IF NOT EXISTS idx_contractors_bbb_accredited ON contractors(bbb_accredited);')
    console.log('')
    console.log('After running this SQL, the BBB Accredited feature will work!')

  } catch (error) {
    console.error('❌ Script failed:', error)
    process.exit(1)
  }
}

addBbbColumn()
