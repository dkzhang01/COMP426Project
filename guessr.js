import { GuessrView } from './view.js'
import { GuessrModel } from './model.js'
import { GuessrController } from './controller.js'

let model = new GuessrModel()
let controller = new GuessrController(model)
let view = new GuessrView(model, controller)

view.render(document.getElementById('main'))

document.addEventListener('DOMContentLoaded', () => {
  const signupButton = document.getElementById('signup-btn')
  const mainContainer = document.getElementById('main')

  signupButton.addEventListener('click', () => {
    view.renderSignup(mainContainer)
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login-btn')
  const mainContainer = document.getElementById('main')

  loginButton.addEventListener('click', () => {
    view.renderLogin(mainContainer)
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const backArrow = document.getElementById('back-home')
  const mainContainer = document.getElementById('main')

  backArrow.addEventListener('click', event => {
    view.render_landing_page(mainContainer)
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('auth_token')
  const username = localStorage.getItem('username')

  const mainContainer = document.getElementById('main')

  if (token && username) {
    console.log(`User ${username} is already logged in.`)
    view.updateNavbarAfterLogin(username)
    view.render_page(mainContainer)
  } else {
    console.log('No user logged in. Redirecting to login page.')
    view.renderLogin(mainContainer)
  }
})
