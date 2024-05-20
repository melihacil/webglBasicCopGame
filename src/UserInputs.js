export default class UserInputs {
  constructor() {
    this._Init();
    this.keys = this.keyInit;
  }
  keyInit = {
    buttonM: false,
    buttonK: false,
    buttonL: false,
    forward: false,
    backward: false,
    left: false,
    right: false,
    space: false,
    shift: false,
  };
  _Init() {
    document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  }

  _onKeyDown(event) {
    switch (event.keyCode) {
      case 77: //m
        this.keys.buttonM = !this.keys.buttonM;
        break;
      case 75: //k
        this.keys.buttonK = true;
        break;
      case 76: //L
        this.keys.buttonL = true;
        break;
      case 87: // w
        this.keys.forward = true;
        break;
      case 65: // a
        this.keys.left = true;
        break;
      case 83: // s
        this.keys.backward = true;
        break;
      case 68: // d
        this.keys.right = true;
        break;
      case 32: // SPACE
        this.keys.space = true;
        break;
      case 16: // SHIFT
        this.keys.shift = true;
        break;
    }
  }

  _onKeyUp(event) {
    switch (event.keyCode) {
      case 75: //k
        this.keys.buttonK = false;
        break;
      case 76: //L
        this.keys.buttonL = false;
        break;
      case 87: // w
        this.keys.forward = false;
        break;
      case 65: // a
        this.keys.left = false;
        break;
      case 83: // s
        this.keys.backward = false;
        break;
      case 68: // d
        this.keys.right = false;
        break;
      case 32: // SPACE
        this.keys.space = false;
        break;
      case 16: // SHIFT
        this.keys.shift = false;
        break;
    }
  }
}
