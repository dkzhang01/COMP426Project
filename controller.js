export class GuessrController {

    #model;
    #username;
    #password;

    constructor(model) {
        this.#model = model;
    }

    set_login(username, password) {
        this.#model.set_login(username, password);
    }
    start_game() {
        this.#model.set_pokemon()
    }

    
}