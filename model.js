export class GuessrModel extends EventTarget {
    #pokemon_id
    #guessed_ids = [];
    #username
    #password
    


    constructor() {
        super();
        this.#pokemon_id = 1 //default value
    }

    set_pokemon() {
        this.#pokemon_id = Math.floor(Math.random() * 10); // To change to random pokemon id selection
    }
    set_login(username, password) {
        this.#username = username;
        this.#password = password;
    }
    async get_pokemon_info(poke_id) {
        let response = await fetch('https://pokeapi.co/api/v2/pokemon/' + poke_id + '/');
        let data = await response.json();
        let type1 = data['types'][0]['type']['name'];
        let type2 = 'None';
        if (data['types'].length > 1) {
            type2 = data['types'][1]['type']['name']
        }
        console.log({
            'name':data['name'],
            'type1':type1,
            'type2':type2,
            'height':data['height'],
            'weight':data['weight']
        })
        return {
            'name':data['name'],
            'type1':type1,
            'type2':type2,
            'height':data['height'],
            'weight':data['weight']
        }
    }

    async guess(pokemon_name) {
        this.get_pokemon_info(this.#pokemon_id).then(result1 => {
            this.get_pokemon_info(pokemon_name).then(result2 => {
                const submission_event = new CustomEvent('Submission', {
                    detail: [result1, result2]
                })
                this.dispatchEvent(submission_event)
                if ((result1['name'] == result2['name']) && 
                (result1['type1'] == result2['type1']) && 
                (result1['type2'] == result2['type2']) && 
                (result1['height'] == result2['height']) && 
                (result1['weight'] == result2['weight'])) {
                    this.dispatchEvent(new Event('Game_Over'))
                    update_user_data()
                }
            }).catch(error => {
                console.error("Error with Pokeapi", error)
            })
        }).catch(error => {
            console.error("Error with Pokeapi", error)
        })
    }
    async update_user_data() {
        //Update user information
        return;
    }
}