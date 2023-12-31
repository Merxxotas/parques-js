import { COORDINATES_MAP, PLAYERS, STEP_LENGTH } from "./constants.js";

const diceButtonElement = document.querySelector("#dice-btn");
const playerPiecesElements = {
  Jugador1: document.querySelectorAll('[player-id="Jugador1"].player-piece'),
  Jugador2: document.querySelectorAll('[player-id="Jugador2"].player-piece'),
};
export class UI {
  static listenDiceClick(callback) {
    diceButtonElement.addEventListener("click", callback);
  }

  static listenResetClick(callback) {
    document
      .querySelector("button#reset-btn")
      .addEventListener("click", callback);
  }

  static listenPieceClick(callback) {
    document
      .querySelector(".player-pieces")
      .addEventListener("click", callback);
  }

  static setPiecePosition(player, piece, newPosition) {
    if (!playerPiecesElements[player] || !playerPiecesElements[player][piece]) {
      console.error(
        `El elemento del jugador: ${player} y la pieza: ${piece} NO HAN SIDO ENCONTRADOS`
      );
    }

    const [x, y] = COORDINATES_MAP[newPosition];

    const pieceElement = playerPiecesElements[player][piece];
    pieceElement.style.top = y * STEP_LENGTH + "%";
    pieceElement.style.left = x * STEP_LENGTH + "%";
  }

  static setTurn(index) {
    if (index < 0 || index >= PLAYERS.length) {
      console.error("Index fuera del rango!");
      return;
    }

    const player = PLAYERS[index];

    document.querySelector(".active-player span").innerText = player;

    const activePlayerBase = document.querySelector(".player-base.highlight");

    if (activePlayerBase) {
      activePlayerBase.classList.remove("highlight");
    }

    document
      .querySelector(`[player-id="${player}"].player-base`)
      .classList.add("highlight");
  }

  static enableDice() {
    diceButtonElement.removeAttribute("disabled");
  }

  static disableDice() {
    diceButtonElement.setAttribute("disabled", "");
  }

  static highlightPieces(player, pieces) {
    pieces.forEach((piece) => {
      const pieceElement = playerPiecesElements[player][piece];
      pieceElement.classList.add("highlight");
    });
  }

  static unhighlightPieces() {
    document.querySelectorAll(".player-piece.highlight").forEach((ele) => {
      ele.classList.remove("highlight");
    });
  }

  static setDiceValue(value) {
    document.querySelector(".dice-value").innerText = value;
  }
}

// UI.setPiecePosition("P1", 0, 0);
// UI.setTurn(0);
// UI.setTurn(1);
// UI.disableDice();
// UI.enableDice();
// UI.highlightPieces("P1", [0]);
// UI.unhighlightPieces();
// UI.setDiceValue(454465);
