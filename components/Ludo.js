import { UI } from "./UI.js";
import {
  BASE_POSITIONS,
  HOME_ENTRANCE,
  HOME_POSITIONS,
  PLAYERS,
  SAFE_POSITIONS,
  START_POSITIONS,
  STATE,
  TURNING_POINTS,
} from "./constants.js";

export class Ludo {
  currentPositions = {
    Player1: [],
    PLayer2: [],
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
    this.listenPieceClick();
    this.setPiecePosition("Player1", 0, 0);
  }

  listenDiceClick() {
    UI.listenDiceClick(this.onDiceClick.bind(this));
  }

  onDiceClick() {
    console.log("DADO HA SIDO LANZADO");
  }

  listenResetClick() {
    UI.listenResetClick(this.resetGame.bind(this));
  }

  resetGame() {
    console.log("juego reiniciado");
    this.currentPositions = BASE_POSITIONS;

    PLAYERS.forEach((player) => {
      [0, 1, 2, 3].forEach((piece) => {
        this.setPiecePosition(
          player,
          piece,
          this.currentPositions[player][piece]
        );
      });
    });
  }

  listenPieceClick() {
    UI.listenPieceClick(this.onPieceClick.bind(this));
  }

  onPieceClick(event) {
    const target = event.target;
    if (!target.classList.contains("player-piece")) {
      return;
    }
    console.log("Le diste click a una ficha");

    const player = target.getAttribute("player-id");
    const piece = target.getAttribute("piece");
    this.handlePieceClick(player, piece);
  }

  handlePieceClick(player, piece) {
    console.log(player, piece, "clickeado");
  }

  setPiecePosition(player, piece, newPosition) {
    this.currentPositions[player][piece] = newPosition;
    UI.setPiecePosition(player, piece, newPosition);
  }
}
