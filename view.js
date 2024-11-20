export class GuessrView {
  #model
  #controller

  constructor (model, controller) {
    this.#model = model
    this.#controller = controller
  }

  render (render_div) {
    this.render_landing_page(render_div)
  }

  render_landing_page (render_div) {
    render_div.innerHTML = ''

    const logo = document.createElement('div')
    logo.className = 'logo'
    const logoImg = document.createElement('img')
    logoImg.src = '/img/pokemon_wordle_logo.jpg'
    logoImg.alt = 'Game Logo'
    logo.appendChild(logoImg)

    const title = document.createElement('h1')
    title.textContent = 'Wordle'

    const subtitle = document.createElement('p')
    subtitle.textContent = 'Get 6 chances to guess a 5-letter word.'

    const buttons = document.createElement('div')
    buttons.className = 'buttons'

    const play = document.createElement('button')
    play.className = 'btn btn-primary'
    play.textContent = 'Play'
    play.addEventListener('click', () => {
      this.render_page(render_div)
    })

    buttons.append(play)

    render_div.append(logo, title, subtitle, buttons)
  }

  renderSignup (render_div) {
    render_div.innerHTML = ''

    const title = document.createElement('h1')
    title.textContent = 'Sign Up'
    render_div.append(title)

    const form = document.createElement('form')

    const usernameText = document.createElement('p')
    usernameText.textContent = 'Username:'
    const username = document.createElement('input')
    username.type = 'text'
    username.name = 'username'
    username.required = true

    const passwordText = document.createElement('p')
    passwordText.textContent = 'Password:'
    const password = document.createElement('input')
    password.type = 'password'
    password.name = 'password'
    password.required = true

    const signupButton = document.createElement('button')
    signupButton.type = 'submit'
    signupButton.textContent = 'Sign Up'

    form.append(usernameText, username, passwordText, password, signupButton)
    render_div.append(form)

    form.addEventListener('submit', async event => {
      event.preventDefault()
      await this.#model.register(username.value, password.value)
      alert('Registration successful! Please log in.')
      this.render_landing_page(render_div)
    })
  }

  renderLogin (render_div) {
    render_div.innerHTML = ''

    const title = document.createElement('h1')
    title.textContent = 'Log In'
    render_div.append(title)

    const form = document.createElement('form')

    const usernameText = document.createElement('p')
    usernameText.textContent = 'Username:'
    const username = document.createElement('input')
    username.type = 'text'
    username.name = 'username'
    username.required = true

    const passwordText = document.createElement('p')
    passwordText.textContent = 'Password:'
    const password = document.createElement('input')
    password.type = 'password'
    password.name = 'password'
    password.required = true

    const loginButton = document.createElement('button')
    loginButton.type = 'submit'
    loginButton.textContent = 'Log In'

    form.append(usernameText, username, passwordText, password, loginButton)
    render_div.append(form)

    form.addEventListener('submit', async event => {
      event.preventDefault()
      console.log('Login form submitted.')
      console.log('Username:', username.value)
      console.log('Password:', password.value)

      try {
        const userId = await this.#model.login(username.value, password.value)
        if (userId) {
          console.log('Login successful. User ID:', userId)
          this.updateNavbarAfterLogin(username.value)
          this.render_landing_page(render_div)
        } else {
          alert('Invalid username or password.')
        }
      } catch (err) {
        console.error('Error during login:', err)
        alert('An error occurred during login. Please try again.')
      }
    })
  }

  updateNavbarAfterLogin (username) {
    const navbarRight = document.querySelector('.navbar-right')

    document.getElementById('signup-btn').style.display = 'none'
    document.getElementById('login-btn').style.display = 'none'

    const pokedexImg = document.getElementById('pokedex-img')
    pokedexImg.style.display = 'block'

    pokedexImg.addEventListener('click', () => {
      this.render_pokedex(document.getElementById('main'))
    })

    const logoutButton = document.getElementById('logout-btn')
    logoutButton.style.display = 'block'

    logoutButton.addEventListener('click', () => {
      this.handleLogout()
    })

    const usernameDisplay = document.createElement('span')
    usernameDisplay.textContent = `Logged in as: ${username}`
    usernameDisplay.style.color = '#d7dadc'
    usernameDisplay.style.marginRight = '10px'

    navbarRight.prepend(usernameDisplay)
  }

  handleLogout () {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('username')

    const navbarRight = document.querySelector('.navbar-right')

    const pokedexImg = document.getElementById('pokedex-img')
    pokedexImg.style.display = 'none'

    const usernameDisplay = navbarRight.querySelector('span')
    if (usernameDisplay) {
      usernameDisplay.remove()
    }

    document.getElementById('signup-btn').style.display = 'inline-block'
    document.getElementById('login-btn').style.display = 'inline-block'

    const logoutButton = document.getElementById('logout-btn')
    logoutButton.style.display = 'none'

    location.reload()
    alert('You have been logged out.')
  }

  render_page (render_div) {
    this.#model.start_game().then(() => {
      render_div.innerHTML = ''

      const pokemonLength = this.#model.get_pokemon_name_length()

      // Render the Wordle Grid
      const gridContainer = document.createElement('div')
      gridContainer.className = 'guess-grid'

      const rows = 6
      for (let i = 0; i < rows; i++) {
        const row = document.createElement('div')
        row.className = 'row'
        for (let j = 0; j < pokemonLength; j++) {
          const cell = document.createElement('div')
          cell.className = 'cell'
          cell.dataset.row = i
          cell.dataset.col = j
          row.appendChild(cell)
        }
        gridContainer.appendChild(row)
      }
      render_div.appendChild(gridContainer)

      // Render the Keyboard
      this.render_keyboard(render_div)

      // Track User Input
      this.handle_user_input(pokemonLength, render_div)
    })
  }

  render_keyboard (render_div) {
    const keyboardContainer = document.createElement('div')
    keyboardContainer.className = 'keyboard'

    const keys = [
      'Q',
      'W',
      'E',
      'R',
      'T',
      'Y',
      'U',
      'I',
      'O',
      'P',
      'A',
      'S',
      'D',
      'F',
      'G',
      'H',
      'J',
      'K',
      'L',
      'ENTER',
      'Z',
      'X',
      'C',
      'V',
      'B',
      'N',
      'M',
      '⌫'
    ]

    keys.forEach(key => {
      const keyButton = document.createElement('button')
      keyButton.textContent = key
      keyButton.className = 'key'
      keyboardContainer.appendChild(keyButton)

      keyButton.addEventListener('click', () => {
        this.handle_key_press(key)
      })
    })

    render_div.appendChild(keyboardContainer)
  }

  handle_user_input (pokemonLength, render_div) {
    let currentRow = 0
    let currentCol = 0
    const inputGrid = Array(6)
      .fill('')
      .map(() => Array(pokemonLength).fill(''))

    document.addEventListener('keydown', event => {
      const key = event.key.toUpperCase()
      if (key === 'ENTER') {
        this.submit_guess(
          inputGrid[currentRow].join(''),
          currentRow,
          render_div
        )
        currentRow++
        currentCol = 0
      } else if (key === 'BACKSPACE' || key === '⌫') {
        if (currentCol > 0) {
          currentCol--
          inputGrid[currentRow][currentCol] = ''
          this.update_grid(inputGrid, currentRow)
        }
      } else if (/^[A-Z]$/.test(key) && currentCol < pokemonLength) {
        inputGrid[currentRow][currentCol] = key
        currentCol++
        this.update_grid(inputGrid, currentRow)
      }
    })
  }

  update_grid (inputGrid, currentRow) {
    const rowElements = document.querySelectorAll(
      `.row:nth-child(${currentRow + 1}) .cell`
    )
    inputGrid[currentRow].forEach((letter, index) => {
      rowElements[index].textContent = letter || ''
    })
  }

  submit_guess (guess, row, render_div) {
    this.#model.guess(guess).then(feedback => {
      this.provide_feedback(feedback, row)

      if (feedback.correct) {
        alert('Congratulations! You guessed the Pokémon!')
        this.#model.update_user_data()
        this.add_restart_button(render_div)
      } else if (row === 5) {
        alert('Game Over! Better luck next time.')
        this.add_restart_button(render_div)
      }
    })
  }

  provide_feedback (feedback, row) {
    if (!feedback || !feedback.letters) {
      console.error('Invalid feedback structure:', feedback)
      return
    }

    const rowElements = document.querySelectorAll(
      `.row:nth-child(${row + 1}) .cell`
    )
    feedback.letters.forEach((letterFeedback, index) => {
      const cell = rowElements[index]
      cell.textContent = letterFeedback.letter
      if (letterFeedback.correct) {
        cell.classList.add('correct')
      } else if (letterFeedback.present) {
        cell.classList.add('present')
      } else {
        cell.classList.add('absent')
      }
    })
  }

  add_restart_button (render_div) {
    const restartButton = document.createElement('button')
    restartButton.textContent = 'Play Again'
    restartButton.addEventListener('click', () => {
      this.render_page(render_div)
    })
    render_div.appendChild(restartButton)
  }

  create_guess_row (details) {
    const [actual, guess] = details

    const row = document.createElement('tr')
    const createCell = (value, isCorrect) => {
      const cell = document.createElement('td')
      cell.textContent = value
      cell.className = isCorrect ? 'correct' : 'incorrect'
      return cell
    }

    row.append(
      createCell(guess.name, actual.name === guess.name),
      createCell(guess.type1, actual.type1 === guess.type1),
      createCell(guess.type2, actual.type2 === guess.type2),
      this.create_hint_cell(guess.height, actual.height),
      this.create_hint_cell(guess.weight, actual.weight)
    )

    return row
  }

  create_hint_cell (guessValue, actualValue) {
    const cell = document.createElement('td')
    if (guessValue === actualValue) {
      cell.textContent = guessValue
      cell.className = 'correct'
    } else {
      const hint = guessValue > actualValue ? 'Lower' : 'Higher'
      cell.textContent = `${guessValue} (${hint})`
      cell.className = 'incorrect'
    }
    return cell
  }

  check_win_condition (details) {
    const [actual, guess] = details
    return (
      actual.name === guess.name &&
      actual.type1 === guess.type1 &&
      actual.type2 === guess.type2 &&
      actual.height === guess.height &&
      actual.weight === guess.weight
    )
  }

  add_restart_button (render_div) {
    const restartButton = document.createElement('button')
    restartButton.type = 'button'
    restartButton.textContent = 'Play Again!'
    render_div.appendChild(restartButton)

    restartButton.addEventListener('click', () => {
      this.render_page(render_div)
    })
  }

  render_pokedex (render_div) {
    render_div.innerHTML = ''

    this.#model
      .getPokedex()
      .then(pokedex => {
        const title = document.createElement('h1')
        title.textContent = 'Your Pokedex'
        render_div.appendChild(title)

        if (pokedex.length === 0) {
          render_div.innerHTML = '<p>No Pokémon in your Pokedex yet.</p>'
          return
        }

        const pokedexList = document.createElement('ul')
        pokedex.forEach(pokemon => {
          const listItem = document.createElement('li')
          listItem.innerHTML = `
                    <img src="${pokemon.image_url}" alt="${pokemon.pokemon_name}" width="50" />
                    <span>${pokemon.pokemon_name} - ${pokemon.type1}/${pokemon.type2}</span>
                `
          pokedexList.appendChild(listItem)
        })

        render_div.appendChild(pokedexList)
      })
      .catch(err => {
        console.error('Error rendering Pokedex:', err)
        render_div.innerHTML = '<p>Failed to load Pokedex.</p>'
      })
  }
}
