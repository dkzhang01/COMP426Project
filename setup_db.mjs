import { db } from './db.mjs';
import bcrypt from 'bcrypt';

(async () => {
    try {
        const ashPasswordHash = await bcrypt.hash('pikachu123', 10);
        const ashProfile = {
            username: 'ash.ketchum',
            password_hash: ashPasswordHash,
        };

        await db.run(
            'INSERT INTO users (username, password_hash) VALUES (?, ?)',
            [ashProfile.username, ashProfile.password_hash]
        );

        const mistyPasswordHash = await bcrypt.hash('misty123', 10);
        const mistyProfile = {
            username: 'misty',
            password_hash: mistyPasswordHash,
        };

        await db.run(
            'INSERT INTO users (username, password_hash) VALUES (?, ?)',
            [mistyProfile.username, mistyProfile.password_hash]
        );

        const pikachu = {
            pokemon_name: 'Pikachu',
            type1: 'Electric',
            type2: 'None',
            height: 6,
            weight: 60,
            image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        };

        await db.run(
            'INSERT INTO pokemons (pokemon_name, type1, type2, height, weight, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [pikachu.pokemon_name, pikachu.type1, pikachu.type2, pikachu.height, pikachu.weight, pikachu.image_url]
        );

        const charmander = {
            pokemon_name: 'Charmander',
            type1: 'Fire',
            type2: 'None',
            height: 6,
            weight: 85,
            image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
        };

        await db.run(
            'INSERT INTO pokemons (pokemon_name, type1, type2, height, weight, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [charmander.pokemon_name, charmander.type1, charmander.type2, charmander.height, charmander.weight, charmander.image_url]
        );

        await db.run(
            'INSERT INTO pokedex (pokemon_id, user_id) VALUES (?, ?)',
            [1, 1]
        );

        await db.run(
            'INSERT INTO pokedex (pokemon_id, user_id) VALUES (?, ?)',
            [2, 1]
        );

        console.log('Database setup completed successfully!');
    } catch (err) {
        console.error('Error during database setup:', err);
    }
})();
