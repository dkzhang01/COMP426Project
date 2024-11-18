import {GuessrView} from "./view.js";
import {GuessrModel} from "./model.js";
import {GuessrController} from "./controller.js";


let model = new GuessrModel();
let controller = new GuessrController(model);
let view = new GuessrView(model, controller);

view.render(document.getElementById('main'));