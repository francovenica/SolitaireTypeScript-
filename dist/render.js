"use strict";
const renderSingleCard = function (context, posx, posy, card) {
    if (card.faceUp) {
        context.fillStyle = "white";
        context.fillRect(posx, posy, CARD_WIDTH, CARD_HEIGHT);
        context.strokeStyle = "black";
        context.lineWidth = 3;
        context.strokeRect(posx, posy, CARD_WIDTH, CARD_HEIGHT);
        context.fillStyle = card.color;
        context.font = FONT_STYLE;
        context.fillText(CARD_VALUES[card.value - 1], posx + VALUE_OFFSET_X, posy + VALUE_OFFSET_Y);
        context.fillStyle = card.color;
        context.font = FONT_STYLE;
        context.fillText(SUITS_ICONS[card.suit], posx + SUIT_OFFSET_X, posy + SUIT_OFFSET_Y);
    }
    else {
        context.fillStyle = "blue";
        context.fillRect(posx, posy, CARD_WIDTH, CARD_HEIGHT);
        context.strokeStyle = "red";
        context.lineWidth = 3;
        context.strokeRect(posx + 3, posy + 3, CARD_WIDTH - 6, CARD_HEIGHT - 6);
        context.strokeStyle = "black";
        context.lineWidth = 3;
        context.strokeRect(posx, posy, CARD_WIDTH, CARD_HEIGHT);
    }
};
const renderTableau = function (context, posx, posy, tableau) {
    tableau.forEach((element) => {
        element.forEach((card) => {
            renderSingleCard(context, card.posx, card.posy, card);
        });
    });
};
const renderRecycleIcon = function (context, posx, posy) {
    const arrowPosX = posx + 30;
    const arrowPosY = posy + 50;
    const renderArrowHead = function (context, x, y, offset_x1, offset_y1, offset_x2, offset_y2, linewidth = 4) {
        context.beginPath();
        context.moveTo(x + offset_x1, y + offset_y1);
        context.lineTo(x + offset_x2, y + offset_y2); //Left arrow body
        context.strokeStyle = "green";
        context.lineWidth = linewidth;
        context.stroke();
    };
    //some background to see the arrows
    context.fillStyle = "gray";
    context.fillRect(posx, posy, CARD_WIDTH, CARD_HEIGHT);
    context.strokeStyle = "black";
    context.lineWidth = 3;
    context.strokeRect(posx, posy, CARD_WIDTH, CARD_HEIGHT);
    renderArrowHead(context, arrowPosX, arrowPosY, 0, 0, 0, 40);
    renderArrowHead(context, arrowPosX, arrowPosY, 40, 0, 40, 40);
    renderArrowHead(context, arrowPosX, arrowPosY, 0, 40, -8, 30);
    renderArrowHead(context, arrowPosX, arrowPosY, 0, 40, 8, 30);
    renderArrowHead(context, arrowPosX, arrowPosY, 40, 0, 33, 10);
    renderArrowHead(context, arrowPosX, arrowPosY, 40, 0, 47, 10);
};
const renderCardsLeftInStock = function (context, posx, posy) {
    context.fillStyle = "white";
    context.font = FONT_STYLE;
    if (stockDeck.length > 9)
        context.fillText(stockDeck.length.toString(), posx, posy);
    else
        context.fillText(stockDeck.length.toString(), posx + 10, posy);
    //if the number is single digit, we do an offset
};
const renderEmptyWaste = function (context, posx, posy) {
    context.fillStyle = "#555";
    context.fillRect(posx, posy, CARD_WIDTH, CARD_HEIGHT);
    context.strokeStyle = "black";
    context.lineWidth = 3;
    context.strokeRect(posx, posy, CARD_WIDTH, CARD_HEIGHT);
};
const renderFoundation = function (context, posx, posy, suit) {
    if (foundations[suit].length === 0) {
        const centeredSuitX = 30;
        const centeredSuitY = 50;
        context.fillStyle = "#555";
        context.fillRect(posx, posy, CARD_WIDTH, CARD_HEIGHT);
        context.strokeStyle = "black";
        context.lineWidth = 3;
        context.strokeRect(posx, posy, CARD_WIDTH, CARD_HEIGHT);
        context.fillStyle = "white";
        context.font = FONT_STYLE;
        context.fillText(SUITS_ICONS[suit], posx + centeredSuitX, posy + centeredSuitY);
    }
    else {
        renderSingleCard(context, posx, posy, foundations[suit][foundations[suit].length - 1]);
    }
};
const renderStartButton = function (context, button) {
    context.fillStyle = "#555";
    context.fillRect(button.posx, button.posy, button.width, button.height);
    context.strokeStyle = "black";
    context.lineWidth = 3;
    context.strokeRect(button.posx, button.posy, button.width, button.height);
    context.fillStyle = "white";
    context.font = FONT_STYLE;
    context.fillText(button.text, button.posx + button.textPosx, button.posy + button.textPosy);
};
const renderAll = function (context, x, y) {
    context.fillStyle = "#2e7d32";
    context.fillRect(0, 0, canvas.width, canvas.height);
    renderTableau(context, 0, 0, tableau);
    renderFoundation(context, positionX.foundations.hearts, positionY.upper_row, "hearts");
    renderFoundation(context, positionX.foundations.diamonds, positionY.upper_row, "diamonds");
    renderFoundation(context, positionX.foundations.clubs, positionY.upper_row, "clubs");
    renderFoundation(context, positionX.foundations.spades, positionY.upper_row, "spades");
    if (wasteDeck.length > 0)
        renderSingleCard(context, positionX.wasteDeck, positionY.upper_row, wasteDeck[wasteDeck.length - 1]);
    else
        renderEmptyWaste(context, positionX.wasteDeck, positionY.upper_row);
    if (stockDeck.length > 0) {
        renderSingleCard(context, positionX.stockDeck, positionY.upper_row, stockDeck[stockDeck.length - 1]);
        renderCardsLeftInStock(context, positionX.stockDeck + CARDS_LEFT_IN_STOCK_POSX, positionY.upper_row + CARDS_LEFT_IN_STOCK_POSY);
    }
    else {
        renderRecycleIcon(context, positionX.stockDeck, positionY.upper_row);
    }
    if (draggedCards.length > 0) {
        draggedCards.forEach((card, index) => {
            if (index === 0)
                updateCardPos(card, x - cardOffsetX, y - cardOffsetY);
            else
                updateCardPos(card, x - cardOffsetX, y - cardOffsetY + positionY.lower_row_card_offset * index + 1);
            renderSingleCard(context, card.posx, card.posy, card);
        });
    }
    renderStartButton(context, START_BUTTON);
};
const renderEndGame = function (context, label) {
    context.fillStyle = "#2b95fb";
    context.fillRect(label.posx, label.posy, label.width, label.height);
    context.strokeStyle = "black";
    context.lineWidth = 5;
    context.strokeRect(label.posx, label.posy, label.width, label.height);
    context.fillStyle = "white";
    context.font = "80px sans-serif";
    context.fillText(label.text, label.posx + label.textPosx, label.posy + label.textPosy);
    context.fillStyle = "white";
    context.font = "40px sans-serif";
    context.fillText(label.textTime + minutes + " : " + seconds, label.posx + label.textTimePosx, label.posy + label.textTimePosy);
};
//# sourceMappingURL=render.js.map