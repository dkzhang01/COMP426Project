export class GuessrView {
  #model;
  #controller;

  constructor(model, controller) {
    this.#model = model;
    this.#controller = controller;
    this.currentRow = 0;
    this.currentCol = 0;
    this.inputGrid = [];
  }

  render(render_div) {
    this.render_landing_page(render_div);
  }

  render_landing_page(render_div) {
    render_div.innerHTML = "";

    const logo = document.createElement("div");
    logo.className = "logo";

    const logoImg = document.createElement("img");
    logoImg.src = "/img/pokemon_wordle_logo.jpg";
    logoImg.alt = "Game Logo";
    logo.appendChild(logoImg);

    const title = document.createElement("h1");
    title.textContent = "Wordle";

    const subtitle = document.createElement("p");
    subtitle.textContent = "Get 6 chances to guess a 5-letter word.";

    const buttons = document.createElement("div");
    buttons.className = "buttons";

    const play = document.createElement("button");
    play.className = "btn btn-primary";
    play.textContent = "Play";
    play.addEventListener("click", () => {
      this.render_page(render_div);
    });

    buttons.append(play);

    render_div.append(logo, title, subtitle, buttons);
  }

  renderSignup(render_div) {
    render_div.innerHTML = "";

    const title = document.createElement("h1");
    title.textContent = "Sign Up";
    render_div.append(title);

    const form = document.createElement("form");

    const usernameText = document.createElement("p");
    usernameText.textContent = "Username:";
    const username = document.createElement("input");
    username.type = "text";
    username.name = "username";
    username.required = true;

    const passwordText = document.createElement("p");
    passwordText.textContent = "Password:";
    const password = document.createElement("input");
    password.type = "password";
    password.name = "password";
    password.required = true;

    const signupButton = document.createElement("button");
    signupButton.type = "submit";
    signupButton.textContent = "Sign Up";

    form.append(usernameText, username, passwordText, password, signupButton);
    render_div.append(form);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await this.#model.register(username.value, password.value);
      alert("Registration successful! Please log in.");
      this.render_landing_page(render_div);
    });
  }

  renderLogin(render_div) {
    render_div.innerHTML = "";

    const title = document.createElement("h1");
    title.textContent = "Log In";
    render_div.append(title);

    const form = document.createElement("form");

    const usernameText = document.createElement("p");
    usernameText.textContent = "Username:";
    const username = document.createElement("input");
    username.type = "text";
    username.name = "username";
    username.required = true;

    const passwordText = document.createElement("p");
    passwordText.textContent = "Password:";
    const password = document.createElement("input");
    password.type = "password";
    password.name = "password";
    password.required = true;

    const loginButton = document.createElement("button");
    loginButton.type = "submit";
    loginButton.textContent = "Log In";

    form.append(usernameText, username, passwordText, password, loginButton);
    render_div.append(form);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("Login form submitted.");
      console.log("Username:", username.value);
      console.log("Password:", password.value);

      try {
        const userId = await this.#model.login(username.value, password.value);
        if (userId) {
          console.log("Login successful. User ID:", userId);
          this.updateNavbarAfterLogin(username.value);
          this.render_landing_page(render_div);
        } else {
          alert("Invalid username or password.");
        }
      } catch (err) {
        console.error("Error during login:", err);
        alert("An error occurred during login. Please try again.");
      }
    });
  }

  updateNavbarAfterLogin(username) {
    const navbarRight = document.querySelector(".navbar-right");

    document.getElementById("signup-btn").style.display = "none";
    document.getElementById("login-btn").style.display = "none";

    const pokedexImg = document.getElementById("pokedex-img");
    pokedexImg.style.display = "block";

    pokedexImg.addEventListener("click", () => {
      this.render_pokedex(document.getElementById("main"));
    });

    const logoutButton = document.getElementById("logout-btn");
    logoutButton.style.display = "block";

    logoutButton.addEventListener("click", () => {
      this.handleLogout();
    });

    const usernameDisplay = document.createElement("span");
    usernameDisplay.textContent = `Logged in as: ${username}`;
    usernameDisplay.style.color = "#d7dadc";
    usernameDisplay.style.marginRight = "10px";

    navbarRight.prepend(usernameDisplay);
  }

  handleLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("username");

    const navbarRight = document.querySelector(".navbar-right");

    const pokedexImg = document.getElementById("pokedex-img");
    pokedexImg.style.display = "none";

    const usernameDisplay = navbarRight.querySelector("span");
    if (usernameDisplay) {
      usernameDisplay.remove();
    }

    document.getElementById("signup-btn").style.display = "inline-block";
    document.getElementById("login-btn").style.display = "inline-block";

    const logoutButton = document.getElementById("logout-btn");
    logoutButton.style.display = "none";

    location.reload();
    alert("You have been logged out.");
  }

  render_page(render_div) {
    this.#model.start_game().then(() => {
      this.currentRow = 0;
      this.currentCol = 0;
      const pokemonLength = this.#model.get_pokemon_name_length();
      this.inputGrid = Array(6)
        .fill("")
        .map(() => Array(pokemonLength).fill(""));
      render_div.innerHTML = "";
      // Render the Hints Section
      const hintContainer = document.createElement("div");
      hintContainer.className = "hintcontainer";
      let type1hint = document.createElement("div");
      //type1hint.className="cell";
      type1hint.id = "type1hint";
      type1hint.textContent = "Type 1: 2 More Guesses!";
      type1hint.className = "hintrowe";
      let type2hint = document.createElement("div");
      //type2hint.className="cell";
      type2hint.id = "type2hint";
      type2hint.textContent = "Type 2: 3 More Guesses!";
      type2hint.className = "hintrowe";
      let regionhint = document.createElement("div");
      //regionhint.className="cell";
      regionhint.id = "regionhint";
      regionhint.textContent = "Generation: 1 More Guess!";
      regionhint.className = "hintrowe";
      let spritehint = document.createElement("div");
      spritehint.className = "spritehint";
      spritehint.id = "spritehint";
      spritehint.textContent = "Sprite: 4 More Guesses!";
      let hintrow1 = document.createElement("div");
      hintrow1.append(type1hint, type2hint, regionhint);
      hintContainer.append(spritehint, hintrow1);
      hintrow1.className = "hintrow";
      hintContainer.className = "hintContainer";
      render_div.appendChild(hintContainer);

      // Render the Wordle Grid
      const gridContainer = document.createElement("div");
      gridContainer.className = "guess-grid";

      const rows = 6;
      for (let i = 0; i < rows; i++) {
        const row = document.createElement("div");
        row.className = "row";
        for (let j = 0; j < pokemonLength; j++) {
          const cell = document.createElement("div");
          cell.className = "cell";
          cell.dataset.row = i;
          cell.dataset.col = j;
          row.appendChild(cell);
        }
        gridContainer.appendChild(row);
      }
      render_div.appendChild(gridContainer);

      // Render the Keyboard
      this.render_keyboard(render_div);

      // Track User Input
      this.handle_user_input(pokemonLength, render_div);
    });
  }

  render_keyboard(render_div) {
    const keyboardContainer = document.createElement("div");
    keyboardContainer.className = "keyboard";

    const rows = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
    ];

    rows.forEach((row) => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "keyboard-row";

      row.forEach((key) => {
        const keyButton = document.createElement("button");
        keyButton.textContent = key;
        keyButton.id = key;
        keyButton.className = "key";

        if (key === "ENTER") keyButton.id = "enter";
        else if (key === "⌫") keyButton.id = "backspace";

        rowDiv.appendChild(keyButton);

        keyButton.addEventListener("click", () => {
          this.handle_key_press(key);
        });
      });

      keyboardContainer.appendChild(rowDiv);
    });

    render_div.appendChild(keyboardContainer);
  }

  handle_key_press(key) {
    const pokemonLength = this.#model.get_pokemon_name_length();
    const grid = document.querySelector(".guess-grid");
    const rows = grid.querySelectorAll(".row");
    const currentCells = rows[this.currentRow].children;

    if (key === "ENTER") {
      if (this.currentCol < pokemonLength) return;
      const currentGuess = this.inputGrid[this.currentRow].join("");
      this.submit_guess(currentGuess, this.currentRow, grid.parentElement);
      this.update_grid_color(this.inputGrid, this.currentRow);
      this.update_keyboard_color(this.currentRow);

      this.currentRow++;
      this.currentCol = 0;
    } else if (key === "⌫" || key === "BACKSPACE") {
      if (this.currentCol > 0) {
        this.currentCol--;
        this.inputGrid[this.currentRow][this.currentCol] = "";
        currentCells[this.currentCol].textContent = "";
      }
    } else if (/^[A-Z]$/.test(key)) {
      if (this.currentCol < pokemonLength) {
        this.inputGrid[this.currentRow][this.currentCol] = key;
        currentCells[this.currentCol].textContent = key;
        this.currentCol++;
      }
    }
  }

  handle_user_input(pokemonLength, render_div) {
    document.removeEventListener("keydown", this.keydownHandler);

    this.keydownHandler = (event) => {
      const key = event.key.toUpperCase();

      if (key === "ENTER") {
        if (this.currentCol < pokemonLength) return;

        const currentGuess = this.inputGrid[this.currentRow].join("");
        this.submit_guess(currentGuess, this.currentRow, render_div);
        this.update_grid_color(this.inputGrid, this.currentRow);
        this.update_keyboard_color(this.currentRow);

        this.currentRow++;
        this.currentCol = 0;
      } else if (key === "BACKSPACE" || key === "⌫") {
        if (this.currentCol > 0) {
          this.currentCol--;
          this.inputGrid[this.currentRow][this.currentCol] = "";
          this.update_grid(this.inputGrid, this.currentRow);
        }
      } else if (/^[A-Z]$/.test(key) && this.currentCol < pokemonLength) {
        this.inputGrid[this.currentRow][this.currentCol] = key;
        this.currentCol++;
        this.update_grid(this.inputGrid, this.currentRow);
      }
    };

    document.addEventListener("keydown", this.keydownHandler);
  }

  update_grid(inputGrid, currentRow) {
    const rowElements = document.querySelectorAll(
      `.row:nth-child(${currentRow + 1}) .cell`
    );
    inputGrid[currentRow].forEach((letter, index) => {
      rowElements[index].textContent = letter || "";
    });
  }

  update_grid_color(inputGrid, currentRow) {
    const rowElements = document.querySelectorAll(
      `.row:nth-child(${currentRow + 1}) .cell`
    );
    const pokemonName = this.#model.get_pokemon_name().toUpperCase();

    inputGrid[currentRow].forEach((letter, index) => {
      let backgroundColor;

      if (pokemonName[index] === letter) {
        backgroundColor = "#459525"; // Green: Correct letter and position
      } else if (pokemonName.includes(letter)) {
        backgroundColor = "#af9a38"; // Orange: Correct letter, wrong position
      } else {
        backgroundColor = "#3a3a3c"; // Gray: Letter not in the name
      }
      rowElements[index].style.backgroundColor = backgroundColor;
    });
  }

  update_keyboard_color(currentRow) {
    const rowElements = document.querySelectorAll(
      `.row:nth-child(${currentRow + 1}) .cell`
    );

    rowElements.forEach((cell) => {
      const letter = cell.textContent;
      const keyButton = document.getElementById(letter);

      // Get computed background colors in RGB format
      const cellColor = window.getComputedStyle(cell).backgroundColor;
      const keyButtonColor = window.getComputedStyle(keyButton).backgroundColor;

      // Update keyboard color based on guess correctness
      if (cellColor === "rgb(69, 149, 37)") {
        // Green
        keyButton.style.backgroundColor = "rgb(69, 149, 37)";
      } else if (
        cellColor === "rgb(175, 154, 56)" &&
        keyButtonColor !== "rgb(69, 149, 37)"
      ) {
        // Yellow
        keyButton.style.backgroundColor = "rgb(175, 154, 56)";
      } else if (
        cellColor === "rgb(58, 58, 60)" &&
        keyButtonColor === "rgb(129, 131, 132)"
      ) {
        // Gray
        keyButton.style.backgroundColor = "rgb(58, 58, 60)";
      }
    });
  }

  submit_guess(guess, row, render_div) {
    console.log("Submitting Guess:", guess);

    this.#model
      .guess(guess)
      .then((feedback) => {
        if (!feedback) {
          console.error("Invalid feedback structure:", feedback);
          alert("Error: Unable to process guess. Please try again.");
          return;
        }

        console.log("Feedback received:", feedback);

        if (feedback.correct) {
          alert("Congratulations! You guessed the Pokémon!");
          this.#model.update_user_data();
          this.add_restart_button(render_div);
        } else if (row == 0) {
          // Do hint1
          let type1hint = document.getElementById("type1hint");
          type1hint.textContent = "Type1: 1 More Guess!";

          let type2hint = document.getElementById("type2hint");
          type2hint.textContent = "Type2: 2 More Guesses!";

          let regionhint = document.getElementById("regionhint");
          regionhint.textContent =
            "Generation: " + this.#model.get_pokemon_hints()["generation"];

          let spritehint = document.getElementById("spritehint");
          spritehint.textContent = "Sprite: 3 More Guesses!";
        } else if (row == 1) {
          // Do hint1
          let type1hint = document.getElementById("type1hint");
          type1hint.textContent =
            "Type1: " + this.#model.get_pokemon_hints()["type1"];
          let type2hint = document.getElementById("type2hint");
          type2hint.textContent = "Type2: 1 More Guess!";
          let spritehint = document.getElementById("spritehint");
          spritehint.textContent = "Sprite: 2 More Guesses!";
        } else if (row == 2) {
          //Do hint2
          let type2hint = document.getElementById("type2hint");
          type2hint.textContent =
            "Type2: " + this.#model.get_pokemon_hints()["type2"];
          let spritehint = document.getElementById("spritehint");
          spritehint.textContent = "Sprite: 1 More Guesses!";
        } else if (row == 3) {
          //Do hint2
          let spritehint = document.getElementById("spritehint");
          spritehint.textContent = "";
          let img = document.createElement("img");
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.objectFit = "cover";
          img.style.filter = "brightness(0)";
          img.src = this.#model.get_pokemon_sprite();
          img.alt = "Pokemon Image";
          spritehint.append(img);
        } else if (row == 4) {
          //Do hint2
          console.log("row4");
        } else if (row === 5) {
          alert("Game Over! Better luck next time.");
          this.add_restart_button(render_div);
        }
      })
      .catch((error) => {
        console.error("Error in model.guess():", error);
        alert("An error occurred while processing your guess.");
      });
  }

  add_restart_button(render_div) {
    const restartButton = document.createElement("button");
    restartButton.className = "restartButton";
    restartButton.textContent = "Play Again";
    restartButton.addEventListener("click", () => {
      this.render_page(render_div);
    });
    render_div.appendChild(restartButton);
  }

  create_guess_row(details) {
    const [actual, guess] = details;

    const row = document.createElement("tr");
    const createCell = (value, isCorrect) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      cell.className = isCorrect ? "correct" : "incorrect";
      return cell;
    };

    row.append(
      createCell(guess.name, actual.name === guess.name),
      createCell(guess.type1, actual.type1 === guess.type1),
      createCell(guess.type2, actual.type2 === guess.type2),
      this.create_hint_cell(guess.height, actual.height),
      this.create_hint_cell(guess.weight, actual.weight)
    );

    return row;
  }

  create_hint_cell(guessValue, actualValue) {
    const cell = document.createElement("td");
    if (guessValue === actualValue) {
      cell.textContent = guessValue;
      cell.className = "correct";
    } else {
      const hint = guessValue > actualValue ? "Lower" : "Higher";
      cell.textContent = `${guessValue} (${hint})`;
      cell.className = "incorrect";
    }
    return cell;
  }

  check_win_condition(details) {
    const [actual, guess] = details;
    return (
      actual.name === guess.name &&
      actual.type1 === guess.type1 &&
      actual.type2 === guess.type2 &&
      actual.height === guess.height &&
      actual.weight === guess.weight
    );
  }

  render_pokedex(render_div) {
    render_div.innerHTML = "";

    this.#model
      .getPokedex()
      .then((pokedex) => {
        const title = document.createElement("h1");
        title.textContent = "Your Pokedex";
        render_div.appendChild(title);

        if (pokedex.length === 0) {
          render_div.innerHTML = "<p>No Pokémon in your Pokedex yet.</p>";
          return;
        }

        const pokedexList = document.createElement("ul");
        pokedex.forEach((pokemon) => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
                    <img src="${pokemon.image_url}" alt="${pokemon.pokemon_name}" width="50" />
                    <span>${pokemon.pokemon_name} - ${pokemon.type1}/${pokemon.type2}</span>
                `;
          pokedexList.appendChild(listItem);
        });

        render_div.appendChild(pokedexList);
      })
      .catch((err) => {
        console.error("Error rendering Pokedex:", err);
        render_div.innerHTML = "<p>Failed to load Pokedex.</p>";
      });
  }
}
