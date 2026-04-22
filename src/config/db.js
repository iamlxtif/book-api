import pkg from 'pg'
const {Pool} = pkg

export const pool = new Pool({
    host: process.env.DB_HOSTNAME,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})

pool.connect((err, client, release) => {
    if(err){
        console.error('[DB] Connection error:', err.message)
    }
    else{
        console.log('[DB] Connected to PostgreSQL')
        release()
    }
})

export const query = (text, params) => pool.query(text, params)