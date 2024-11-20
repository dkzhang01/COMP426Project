export class GuessrController {
  #model
  #username
  #password
  #currentRow = 0
  #currentGuess = []
  #maxRows = 6
  #maxCols = 0

  constructor (model) {
    this.#model = model
  }

  set_login (username, password) {
    this.#model.set_login(username, password)
  }
  start_game () {
    this.#model.start_game()
  }

  add_letter (letter) {
    if (this.#currentGuess.length < this.#maxCols) {
      this.#currentGuess.push(letter)
      this.update_grid()
    }
  }

  delete_letter () {
    if (this.#currentGuess.length > 0) {
      this.#currentGuess.pop()
      this.update_grid()
    }
  }

  // Submits the current guess and checks if it's correct
  submit_guess () {
    if (this.#currentGuess.length === this.#maxCols) {
      // Ensure the guess has the correct number of letters
      console.log('Submitting Guess:', this.#currentGuess.join(''))

      // Validate the guess by calling the model's guess method
      this.#model.guess(this.#currentGuess.join('')).then(isCorrect => {
        if (isCorrect) {
          alert('Correct!')
        } else if (this.#currentRow + 1 < this.#maxRows) {
          // If the guess is incorrect but there are rows left, move to the next row
          this.#currentRow++
          this.#currentGuess = []
        } else {
          alert('Game Over!')
        }
      })
    } else {
      alert('Not enough letters!')
    }
  }

  // Updates the UI grid to reflect the current guess
  update_grid () {
    const grid = document.querySelector('.guess-grid') 
    const row = grid.children[this.#currentRow] 
    const cells = row.children 

    // Clear all cell contents in the current row
    Array.from(cells).forEach(cell => (cell.textContent = ''))

    // Fill the cells with the current guess
    this.#currentGuess.forEach((letter, index) => {
      cells[index].textContent = letter // Display the letter in the corresponding cell
    })
  }
}
