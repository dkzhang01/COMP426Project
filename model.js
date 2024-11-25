export class GuessrModel extends EventTarget {
  #pokemon_id;
  #pokemon_name;
  #pokemon_name_length;
  #baseUrl = "http://localhost:3000";

  constructor() {
    super();
    this.#pokemon_id = 1; //default value
    this.#pokemon_name_length = 0;
    this.#pokemon_name = "";
  }

  get_pokemon_name_length() {
    return this.#pokemon_name_length;
  }

  get_pokemon_name() {
    return this.#pokemon_name;
  }

  // Method to start a new game by selecting a random Pokémon
  async start_game() {
    const randomId = Math.floor(Math.random() * 898) + 1; // Generate a random Pokémon ID
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomId}` // Fetch Pokémon data from the PokeAPI
    );
    const targetPokemon = await response.json();

    // Set the Pokémon data
    this.#pokemon_id = targetPokemon.id;
    this.#pokemon_name = targetPokemon.name.toString();
    this.#pokemon_name_length = targetPokemon.name.toString().length;

    console.log("Target Pokémon:", targetPokemon);
    console.log("Target Length", this.#pokemon_name_length);
  }

  // Method to fetch detailed information about a Pokémon by its ID
  async get_pokemon_info(poke_id) {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${poke_id}`
      );
      const data = await response.json();

      // Structure the Pokémon data into an object
      const pokemon = {
        name: data.name,
        type1: data.types[0]?.type?.name || "None",
        type2: data.types[1]?.type?.name || "None",
        height: data.height,
        weight: data.weight,
        image_url: data.sprites?.front_default || "",
      };

      console.log("Retrieved Pokémon:", pokemon);
      return pokemon;
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
      return null;
    }
  }

  // Method to process a guess and update the Pokédex if correct
  async guess(pokemon_name) {
    try {
      const targetPokemon = await this.get_pokemon_info(this.#pokemon_id);

      if (!targetPokemon) {
        console.error("Failed to retrieve Pokémon data for guessing.");
        return null;
      }

      const targetName = targetPokemon.name.toUpperCase();
      const guessedName = pokemon_name.toUpperCase();

      // Generate feedback
      const feedback = {
        correct: targetName === guessedName,
        letters: [],
      };

      // Letter-by-letter feedback
      for (let i = 0; i < guessedName.length; i++) {
        const letter = guessedName[i];
        const isCorrectPosition = targetName[i] === letter;
        const isPresent = targetName.includes(letter) && !isCorrectPosition;

        feedback.letters.push({
          letter,
          correct: isCorrectPosition,
          present: isPresent,
        });
      }

      if (feedback.correct) {
        console.log("Correct guess! Adding Pokémon to Pokédex.");
        await this.update_user_data(targetPokemon);
      } else {
        console.log("Incorrect guess.");
      }

      return feedback; // Return the feedback object
    } catch (error) {
      console.error("Error during guessing:", error);
      return null;
    }
  }

  // Method to add Pokémon to the user's Pokédex
  async update_user_data(pokemon) {
    if (!pokemon || !pokemon.name) {
      console.error("Invalid Pokémon data:", pokemon);
      return;
    }

    console.log("Updating Pokédex with:", pokemon);

    const token = localStorage.getItem("auth_token"); // Retrieve JWT token
    if (!token) {
      alert("You must be logged in to update the Pokédex.");
      return;
    }

    const decodedToken = this.parseJwt(token); // Decode the JWT
    const userId = decodedToken?.id; // Get user ID from the token

    if (!userId) {
      alert("Invalid token. Please log in again.");
      return;
    }

    try {
      // Send the Pokémon data to the backend
      const response = await fetch("http://localhost:3000/guess/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pokemon_name: pokemon.name,
          type1: pokemon.type1,
          type2: pokemon.type2,
          height: pokemon.height,
          weight: pokemon.weight,
          image_url: pokemon.image_url,
          user_id: userId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Pokédex updated successfully!");
      } else {
        alert(`Failed to update Pokédex: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating Pokédex:", error);
      alert("An error occurred while updating the Pokédex.");
    }
  }

  // Method to register a new user
  async register(username, password) {
    try {
      const response = await fetch(`${this.#baseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful!");
      } else {
        console.error("Registration failed:", result.error);
        alert(`Registration failed: ${result.error}`);
      }
    } catch (err) {
      console.error("Error during registration:", err);
      alert("An error occurred while trying to register. Please try again.");
    }
  }

  // Method to log in a user
  async login(username, password) {
    try {
      const response = await fetch(`${this.#baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("auth_token", result.token); // Save JWT token
        localStorage.setItem("username", username); // Save username
        alert("Login successful!");
        return result.token; // Return the token
      } else {
        console.error("Login failed:", result.error);
        alert(`Login failed: ${result.error}`);
        return null;
      }
    } catch (err) {
      console.error("Error during login request:", err);
      alert("An error occurred while trying to log in. Please try again.");
      return null;
    }
  }

  // Helper method to decode a JWT
  parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error("Failed to parse JWT:", err);
      return null;
    }
  }

  // Method to fetch the user's Pokédex
  async getPokedex() {
    const token = localStorage.getItem("auth_token"); // Retrieve JWT token
    if (!token) {
      console.error("User is not logged in.");
      return [];
    }

    console.log(token);

    try {
      const response = await fetch("http://localhost:3000/pokedex", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token
        },
      });

      if (response.ok) {
        const result = await response.json();
        return result.pokedex; // Return the Pokédex data
      } else {
        console.error("Failed to fetch Pokedex:", response.statusText);
        return [];
      }
    } catch (err) {
      console.error("Error fetching Pokedex:", err);
      return [];
    }
  }
}
