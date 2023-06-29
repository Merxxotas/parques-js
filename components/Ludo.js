import { UI } from "./UI.js";
import { STATE } from "./constants.js";

export class Ludo {
  currentPositions = {
    P1: [],
    P2: [],
  };

  _diceValue;
  get diceValue() {
    return this._diceValue;
  }

  set diceValue(value) {
    this._diceValue = value;
    UI.setDiceValue(value);
  }

  _turn;
  get turn() {
    return this._turn;
  }

  set turn(value) {
    this._turn = value;
    UI.setTurn(value);
  }

  _state;
  get state() {
    return this._state;
  }
  set state(value) {
    this._state = value;

    if (value === STATE.DICE_NOT_ROLLED) {
      UI.enableDice();
      // UI.unhighlightPieces();
    } else {
      UI.disableDice();
    }
  }

  constructor() {
    // this.name = 'Ludo';
    console.log("hola desde Ludo");
    // this.diceValue = 5345345;
    // this.turn = 0;
    // this.state = STATE.DICE_ROLLED;
    this.listenDiceClick();
    this.listenResetClick();
  }

  listenDiceClick() {
    UI.listenDiceClick(this.onDiceClick.bind(this));
  }

  onDiceClick() {
    console.log("DADO HA SIDO LANZADO");
  }

  listenResetClick() {
    UI.listenResetClick(this.listenResetGame.bind(this));
  }

  listenResetGame() {
    console.log("juego reiniciado");
  }
}
