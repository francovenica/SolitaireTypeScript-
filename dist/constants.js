"use strict";
const CARD_WIDTH = 100;
const CARD_HEIGHT = 140;
const VALUE_OFFSET_X = 35;
const VALUE_OFFSET_Y = 30;
const SUIT_OFFSET_X = 10;
const SUIT_OFFSET_Y = 30;
//const CARD_POSITION_X = 150;
//const CARD_POSITION_Y = 150;
const CARD_POSITION_OFFSET_X = 30;
const CARD_POSITION_OFFSET_Y = 30;
const CARDS_LEFT_IN_STOCK_POSX = 30;
const CARDS_LEFT_IN_STOCK_POSY = 70;
const SUITS_ICONS = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠"
}; //["♥", "♦", "♣", "♠"];
const CARD_VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const FONT_STYLE = "32px sans-serif";
const COLUMN_ONE_POSITION = 100;
const COLUMN_SPACING = 120;
const START_BUTTON = {
    posx: 0,
    posy: 840,
    width: 180,
    height: 60,
    text: "SHUFFLE",
    textPosx: 15,
    textPosy: 40
};
const END_GAME_SIGN = {
    posx: 100,
    posy: 260,
    width: 820,
    height: 300,
    text: "YOU WON!!",
    textTime: "\nTime: ",
    textPosx: 150,
    textPosy: 100,
    textTimePosx: 200,
    textTimePosy: 200,
};
const positionX = {
    stockDeck: 100,
    wasteDeck: 220,
    foundations: {
        hearts: 460,
        diamonds: 580,
        clubs: 700,
        spades: 820,
    }
};
const positionY = {
    upper_row: 50,
    lower_row: 260,
    lower_row_card_offset: 30
    //The lower row will be a 260 px on posY, and the offset is, when cards gets pilled up, they will be
    //25 px more than the previous one, so is all derived from the lower_row + offset * index of the array
    //that composes that column of cards
};
const columnPositionsX = [];
for (let i = 0; i < 7; i++) {
    columnPositionsX.push(COLUMN_ONE_POSITION + i * COLUMN_SPACING);
}
const fixedZones = [
    { name: "foundation-hearts", x: positionX.foundations.hearts, y: positionY.upper_row, suit: "hearts" },
    { name: "foundation-diamonds", x: positionX.foundations.diamonds, y: positionY.upper_row, suit: "diamonds" },
    { name: "foundation-clubs", x: positionX.foundations.clubs, y: positionY.upper_row, suit: "clubs" },
    { name: "foundation-spades", x: positionX.foundations.spades, y: positionY.upper_row, suit: "spades" },
    { name: "stock", x: positionX.stockDeck, y: positionY.upper_row },
    { name: "waste", x: positionX.wasteDeck, y: positionY.upper_row }
];
//# sourceMappingURL=constants.js.map