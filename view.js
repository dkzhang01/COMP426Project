export class GuessrView {

    #model
    #controller

    constructor(model, controller) {
        this.#model = model;
        this.#controller = controller;
    }

    render(render_div) {
        this.render_login(render_div);
    }

    render_login(render_div) {
        let form = document.createElement('form');
        let username_text = document.createElement('p')
        username_text.textContent = 'Username: '
        let username = document.createElement('input');
        username.type = 'test';
        username.name = 'username';
        let password_text = document.createElement('p')
        password_text.textContent = 'Password: '
        let password = document.createElement('input');
        password.type = 'password';
        password.name = 'password';
        form.append(username_text, username, password_text, password)
        let login = document.createElement('button');
        let register = document.createElement('button');
        login.type = 'submit';
        register.type = 'submit';
        login.textContent = 'login';
        register.textContent ='Register'
        form.append(register, login)
        render_div.append(form);

        login.addEventListener('click', (event) => {
            event.preventDefault();
            // verify log in information
            this.#controller.set_login(username.value, password.value)
            this.render_page(render_div)
        })
        register.addEventListener('click', (event) => {
            event.preventDefault();
            // verify username doesn't already exist and then create new account if not
            this.#controller.set_login(username.value, password.value)
            this.render_page(render_div)
        })
    }

    render_page(render_div) {
        render_div.replaceChildren();
        this.#controller.start_game();
        let table = document.createElement('table');
        table.border = '1';
        let table_head = document.createElement('thead');
        let headers = document.createElement('tr');
        ['name', 'type1', 'type2', 'height', 'weight'].forEach((title) => {
            let th = document.createElement('th');
            th.textContent = title;
            headers.append(th);
        })
        table_head.append(headers)

        table.append(table_head)
        render_div.append(table)

        let guess = document.createElement('input');
        let submit_guess = document.createElement('button');
        submit_guess.type = 'submit';
        submit_guess.textContent = 'Guess'
        render_div.append(guess, submit_guess)

        submit_guess.addEventListener('click', (event) => {
            event.preventDefault();
            this.#model.guess(guess.value)
            
        })
        this.#model.addEventListener('Submission', (event) => {
            console.log(event.detail)
            let new_guess_row = document.createElement('tr');
            let name_entry = document.createElement('td');
            if (event.detail[0]['name'] == event.detail[1]['name']) {
                name_entry.textContent = event.detail[1]['name']
                name_entry.style.color = 'green'
            } else {
                name_entry.textContent = event.detail[1]['name']
                name_entry.style.color = 'red'
            }
            let type1_entry = document.createElement('td');
            if (event.detail[0]['type1'] == event.detail[1]['type1']) {          
                type1_entry.textContent = event.detail[1]['type1']
                type1_entry.style.color = 'green'
            } else {
                type1_entry.textContent = event.detail[1]['type1']
                type1_entry.style.color = 'red'
            }
            let type2_entry = document.createElement('td');
            if (event.detail[0]['type2'] == event.detail[1]['type2']) {              
                type2_entry.textContent = event.detail[1]['type2']
                type2_entry.style.color = 'green'
            } else {
                type2_entry.textContent = event.detail[1]['type2']
                type2_entry.style.color = 'red'
            }
            let height_entry = document.createElement('td');
            if (event.detail[0]['height'] == event.detail[1]['height']) {
                height_entry.textContent = event.detail[1]['height']
                height_entry.style.color = 'green'
            } else {
                if (event.detail[0]['height'] < event.detail[1]['height']) {
                    height_entry.textContent = event.detail[1]['height'] + " Lower"
                    height_entry.style.color = 'red'
                } else {
                    height_entry.textContent = event.detail[1]['height'] + " Higher"
                    height_entry.style.color = 'red'
                }
            }
            let weight_entry = document.createElement('td');
            if (event.detail[0]['weight'] == event.detail[1]['weight']) {
                weight_entry.textContent = event.detail[1]['weight']
                weight_entry.style.color = 'green'
            } else {
                if (event.detail[0]['weight'] < event.detail[1]['weight']) {
                    weight_entry.textContent = event.detail[1]['weight'] + " Lower"
                    weight_entry.style.color = 'red'
                } else {
                    weight_entry.textContent = event.detail[1]['weight'] + " Higher"
                    weight_entry.style.color = 'red'
                }
            }
            new_guess_row.append(name_entry, type1_entry, type2_entry, height_entry, weight_entry)
            table.append(new_guess_row)

            if ((event.detail[0]['name'] == event.detail[1]['name']) && 
                (event.detail[0]['type1'] == event.detail[1]['type1']) && 
                (event.detail[0]['type2'] == event.detail[1]['type2']) && 
                (event.detail[0]['height'] == event.detail[1]['height']) && 
                (event.detail[0]['weight'] == event.detail[1]['weight'])) {
                    let restart_button = document.createElement('button');
                    restart_button.type = 'submit';
                    restart_button.textContent = 'Play Again!'
                    render_div.append(restart_button);

                    restart_button.addEventListener('click', (event) => {
                        event.preventDefault();
                        //restart game
                        this.render_page(render_div);
                        
                    })
                }
        })

    }

}