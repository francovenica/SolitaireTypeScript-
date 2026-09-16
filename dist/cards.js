"use strict";
const OFFSCREEN_POS = 2000;
const allCards = [];
const suits = ["hearts", "diamonds", "clubs", "spades"];
for (let i = 0; i < 4; i++) {
    for (let j = 1; j <= 13; j++) {
        const card = {
            suit: suits[i],
            value: j,
            color: i < 2 ? "red" : "black",
            faceUp: false,
            isBeingDragged: false,
            posx: OFFSCREEN_POS,
            posy: OFFSCREEN_POS
        };
        allCards.push(card);
    }
}
function updateCardPos(card, x, y) {
    card.posx = x;
    card.posy = y;
}
//# sourceMappingURL=cards.js.map