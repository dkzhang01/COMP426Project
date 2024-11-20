import { Database } from 'sqlite-async'

async function initDB () {
  const db = await Database.open('db.sqlite')

  // Users table
  await db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(255) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        );
    `)

  // Pokemons table
  await db.run(`
        CREATE TABLE IF NOT EXISTS pokemons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pokemon_name VARCHAR(255) UNIQUE NOT NULL,
            type1 VARCHAR(50),
            type2 VARCHAR(50),
            height INTEGER,
            weight INTEGER,
            image_url TEXT
        );
    `)

  // Pokedex table
  await db.run(`
        CREATE TABLE IF NOT EXISTS pokedex (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pokemon_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (pokemon_id) REFERENCES pokemons(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `)

  return db
}

export let db = await initDB()
