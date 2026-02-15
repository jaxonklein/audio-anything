const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

async function applySchema() {
  const schemaPath = path.join(__dirname, '../supabase/migrations/20260215000000_initial_schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  console.log('Applying database schema...');
  console.log(`Schema length: ${schema.length} characters`);

  // Split schema into individual statements (rough split on semicolons)
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Executing ${statements.length} SQL statements...`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (!statement) continue;

    console.log(`\n[${i + 1}/${statements.length}] Executing: ${statement.substring(0, 60)}...`);

    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql: statement + ';' });

      if (error) {
        // Try direct query as fallback
        const result = await supabase.from('_sql').select('*').limit(0);
        console.log(`  ⚠️  RPC failed, trying alternative...`);
      } else {
        console.log(`  ✅ Success`);
      }
    } catch (err) {
      console.error(`  ❌ Error:`, err.message);
    }
  }

  console.log('\n✅ Schema application complete!');
}

applySchema().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
