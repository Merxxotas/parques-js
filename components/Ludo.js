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
    Jugador1: [],
    Jugador2: [],
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
      UI.unhighlightPieces();
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
    this.resetGame();
    // this.setPiecePosition("Jugador1", 0, 0);
    // this.setPiecePosition("Jugador2", 0, 1);
    // this.setPiecePosition("Jugador1", 2, HOME_POSITIONS.Jugador1);
    // this.setPiecePosition("Jugador1", 3, HOME_POSITIONS.Jugador1);
    // this.diceValue = 6;
    // console.log(this.getEligiblePieces("Jugador1"));
  }

  listenDiceClick() {
    UI.listenDiceClick(this.onDiceClick.bind(this));
  }

  onDiceClick() {
    console.log("DADO HA SIDO LANZADO");
    this.diceValue = 1 + Math.floor(Math.random() * 7);
    this.state = STATE.DICE_ROLLED;
    this.checkForElegiblePieces();
  }

  checkForElegiblePieces() {
    const player = PLAYERS[this.turn];
    const eligiblePieces = this.getEligiblePieces(player);
    if (eligiblePieces.length) {
      UI.highlightPieces(player, eligiblePieces);
    } else {
      this.incrementTurn();
    }
  }

  incrementTurn() {
    this.turn = this.turn === 0 ? 1 : 0;
    this.state = STATE.DICE_NOT_ROLLED;
  }

  getEligiblePieces(player) {
    return [0, 1, 2, 3].filter((piece) => {
      const currentPosition = this.currentPositions[player][piece];

      if (currentPosition === HOME_POSITIONS[player]) {
        return false;
      }

      if (
        BASE_POSITIONS[player].includes(currentPosition) &&
        this.diceValue !== 6
      ) {
        return false;
      }

      if (
        HOME_ENTRANCE[player].includes(currentPosition) &&
        this.diceValue > HOME_POSITIONS[player] - currentPosition
      ) {
        return false;
      }

      return true;
    });
  }

  listenResetClick() {
    UI.listenResetClick(this.resetGame.bind(this));
  }

  resetGame() {
    console.log("juego reiniciado");
    this.currentPositions = structuredClone(BASE_POSITIONS);
    PLAYERS.forEach((player) => {
      [0, 1, 2, 3].forEach((piece) => {
        this.setPiecePosition(
          player,
          piece,
          this.currentPositions[player][piece]
        );
      });
    });

    this.turn = 0;
    this.state = STATE.DICE_NOT_ROLLED;
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
    const currentPosition = this.currentPositions[player][piece];
    if (BASE_POSITIONS[player].includes(currentPosition)) {
      this.setPiecePosition(player, piece, START_POSITIONS[player]);
      this.state = STATE.DICE_NOT_ROLLED;
      return;
    }
    UI.unhighlightPieces();
    this.movePiece(player, piece, this.diceValue);
  }

  setPiecePosition(player, piece, newPosition) {
    this.currentPositions[player][piece] = newPosition;
    UI.setPiecePosition(player, piece, newPosition);
  }

  movePiece(player, piece, moveBy) {
    const interval = setInterval(() => {
      this.incrementPiecePosition(player, piece);
      moveBy--;
      if (moveBy === 0) {
        clearInterval(interval);

        if (this.hasPlayerWon(player)) {
          alert(`El ${player} ha ganado!`);
          this.resetGame();
          return;
        }

        const isKill = this.checkForKill(player, piece);

        if (isKill || this.diceValue === 6) {
          this.state = STATE.DICE_NOT_ROLLED;
          return;
        }

        this.incrementTurn();
      }
    }, 200);
  }

  checkForKill(player, piece) {
    const currentPosition = this.currentPositions[player][piece];
    const opponent = player === "Jugador1" ? "Jugador2" : "Jugador1";

    let kill = false;

    [0, 1, 2, 3].forEach((piece) => {
      const opponentPosition = this.currentPositions[opponent][piece];

      if (
        currentPosition === opponentPosition &&
        !SAFE_POSITIONS.includes(currentPosition)
      ) {
        this.setPiecePosition(opponent, piece, BASE_POSITIONS[opponent][piece]);
        kill = true;
      }
    });

    return kill;
  }

  hasPlayerWon(player) {
    return [0, 1, 2, 3].every(
      (piece) => this.currentPositions[player][piece] === HOME_POSITIONS[player]
    );
  }

  incrementPiecePosition(player, piece) {
    this.setPiecePosition(
      player,
      piece,
      this.getIncrementedPosition(player, piece)
    );
  }

  getIncrementedPosition(player, piece) {
    const currentPosition = this.currentPositions[player][piece];

    if (currentPosition === TURNING_POINTS[player]) {
      return HOME_ENTRANCE[player][0];
    } else if (currentPosition === 51) {
      return 0;
    }
    return currentPosition + 1;
  }
}
