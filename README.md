Use the command npm install in the terminal at the top level of this repository to install express and other necessary modules.

Run node setup_db.mjs in the terminal to initialize the database, this should create with db.sqlite file. If you already have one and need to reset the database, simply delete the file and run the command.

This is a Pokemon Wordle-inspired web application that combines user authentication and personalized gameplay with a focus on Pokémon. Users can guess Pokémon based on hinted attributes like type, height, and weight, and their progress is tracked in a personalized Pokédex.

Features:

- User Authentication: Secure registration and login using hashed passwords and JWT-based session management.
- Pokémon Database: A collection of Pokémon with attributes such as type, height, weight, and images.
- Personalized Pokédex: Each user has their own Pokédex to track the Pokémon they’ve guessed correctly.
- RESTful API:
  - Retrieve all Pokémon.
  - Save guessed Pokémon to the user’s Pokédex.
  - View a user's Pokédex.
  - Fetch all registered users (for administrative purposes).
  - Secure Middleware: Routes are protected to ensure only authenticated users can access sensitive data.

Video Link: [https://youtu.be/pLjrmQYZ2X0]
