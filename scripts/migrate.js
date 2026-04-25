import '../src/config/env.js'

import '../src/config/db.js'
import {fileURLToPath} from 'url'
import { readdirSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { pool, query } from '../src/config/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function migrate() {
    console.log('[migrate] Connecting to database...')

    const migrationsDir = join(__dirname, '..', 'migrations')
    const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

    console.log(`[migrate] Found ${files.length} migration file(s)`)

    for (const file of files){
        const filePath = join(migrationsDir, file)
        const sql = readFileSync(filePath, 'utf8')

        console.log(`[migrate] Running: ${file}`)
        await query(sql)
        console.log(`[migrate] Done:    ${file}`)
    }

    console.log('[migrate] All migrations complete.')
    await pool.end()
}

migrate().catch(err => {
  console.error('[migrate] Error:', err.message)
  process.exit(1)
})