import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { db } from './db.mjs'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

const app = express()
const port = 3000

// Load environment variables from a .env file
dotenv.config()

// Middleware setup
app.use(bodyParser.json()) // Parse JSON bodies in requests
app.use(cookieParser()) // Parse cookies
app.use(cors()) // Allow cross-origin resource sharing

// Route: Get All Registered Users
// Fetches all users from the `users` table, excluding their hashed passwords
app.get('/users', async (req, res) => {
  try {
    const users = await db.all('SELECT id, username FROM users')
    res.status(200).json({ users })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Route: Login
// Authenticates a user by checking their username and password
app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    // Check if the user exists in the database
    const user = await db.get('SELECT * FROM users WHERE username = ?', [
      username
    ])
    if (!user) return res.status(404).json({ error: 'User not found' })

    // Compare the entered password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate a JWT token upon successful login
    const token = jwt.sign({ id: user.id }, 'your-secret-key', {
      expiresIn: '1h'
    })
    res.status(200).json({ token })
  } catch (err) {
    console.error('Error during login:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Route: Register
// Registers a new user by hashing their password and storing it in the database
app.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    // Hash the password using bcrypt
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Insert the new user into the database
    await db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [
      username,
      passwordHash
    ])

    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    console.error('Error during registration:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Route: Get All Pokemons
// Fetches all Pokémon details from the `pokemons` table
app.get('/pokemons', async (req, res) => {
  try {
    const pokemons = await db.all(
      'SELECT id, pokemon_name, type1, type2, height, weight, image_url FROM pokemons'
    )
    res.status(200).json({ pokemons })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Route: Post Pokémon and Save Relationship
// Saves a guessed Pokémon into the user's Pokédex
app.post('/guess/save', authenticateToken, async (req, res) => {
  const { pokemon_name, type1, type2, height, weight, image_url, user_id } =
    req.body

  try {
    // Check if the Pokémon already exists in the database
    const pokemon = await db.get(
      'SELECT * FROM pokemons WHERE pokemon_name = ?',
      [pokemon_name]
    )
    let pokemonId

    if (!pokemon) {
      // If the Pokémon doesn't exist, insert it
      const result = await db.run(
        `INSERT INTO pokemons (pokemon_name, type1, type2, height, weight, image_url)
                 VALUES (?, ?, ?, ?, ?, ?)`,
        [pokemon_name, type1, type2, height, weight, image_url]
      )
      pokemonId = result.lastID // Get the ID of the new Pokémon
    } else {
      pokemonId = pokemon.id
    }

    // Insert the relationship between the Pokémon and the user into the `pokedex` table
    await db.run(`INSERT INTO pokedex (pokemon_id, user_id) VALUES (?, ?)`, [
      pokemonId,
      user_id
    ])

    res.status(201).json({ message: 'Pokémon added to Pokédex successfully.' })
  } catch (err) {
    console.error('Error saving Pokémon to Pokédex:', err)
    res.status(500).json({ error: 'Internal server error.' })
  }
})

// Route: Get User's Pokedex
// Retrieves all Pokémon from a specific user's Pokédex
app.get('/pokedex', authenticateToken, async (req, res) => {
  try {
    const pokedex = await db.all(
      `SELECT pokemons.* 
             FROM pokemons 
             JOIN pokedex ON pokemons.id = pokedex.pokemon_id 
             WHERE pokedex.user_id = ?`,
      [req.user.id]
    )

    res.status(200).json({ pokedex })
  } catch (err) {
    console.error('Error fetching Pokedex:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Middleware: Authenticate Token
// Verifies the JWT token to protect routes
function authenticateToken (req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Extract token from "Bearer <token>"
  if (!token) return res.status(403).json({ error: 'No token provided' })

  // Verify the JWT token
  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' })
    req.user = user // Attach the decoded user data to the request
    next()
  })
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
