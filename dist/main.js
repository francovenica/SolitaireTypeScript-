"use strict";
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
let stockDeck = [...allCards];
let wasteDeck = [];
const foundations = {
    hearts: [],
    diamonds: [],
    clubs: [],
    spades: [],
};
let droppedCards = [];
let tableau = [];
let draggedCards = [];
let draggedCardOrigin = []; //if the validation fails, the cards dragged should return to where they started
let draggedCardOriginPos = { originX: 0, originY: 0 };
let cardOffsetX = 0;
let cardOffsetY = 0;
let gameWon = false;
let minutes = 0;
let seconds = 0;
for (let i = 0; i < 7; i++)
    tableau.push([]); //es necesario inicializar cada array con uno vacio. Pide las lecciones al agente para mas info
const suffle = function (stockDeck) {
    stockDeck.forEach((card, index) => {
        const randomIndex = index + Math.floor(Math.random() * (stockDeck.length - index));
        stockDeck[index] = stockDeck[randomIndex];
        stockDeck[randomIndex] = card;
    });
};
const fillTableau = function (stockDeck) {
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= i; j++) {
            const card = stockDeck.pop();
            if (card) {
                card.posx = columnPositionsX[i];
                card.posy = positionY.lower_row + j * positionY.lower_row_card_offset;
                tableau[i].push(card);
            }
        }
        tableau[i][tableau[i].length - 1].faceUp = true;
    }
};
const drawfromStock = function () {
    const card = stockDeck.pop();
    if (card) {
        card.faceUp = true;
        wasteDeck.push(card);
    }
};
const recycleWasteDeck = function () {
    wasteDeck.forEach((element) => { element.faceUp = false; });
    stockDeck = wasteDeck.reverse();
    wasteDeck = [];
};
if (context) {
    let startTime = Date.now();
    context.fillStyle = "#2e7d32";
    context.fillRect(0, 0, canvas.width, canvas.height);
    suffle(stockDeck);
    fillTableau(stockDeck);
    renderTableau(context, 0, 0, tableau);
    renderFoundation(context, positionX.foundations.hearts, positionY.upper_row, "hearts");
    renderFoundation(context, positionX.foundations.diamonds, positionY.upper_row, "diamonds");
    renderFoundation(context, positionX.foundations.clubs, positionY.upper_row, "clubs");
    renderFoundation(context, positionX.foundations.spades, positionY.upper_row, "spades");
    if (stockDeck.length > 0) {
        renderSingleCard(context, positionX.stockDeck, positionY.upper_row, stockDeck[stockDeck.length - 1]);
        renderCardsLeftInStock(context, positionX.stockDeck + CARDS_LEFT_IN_STOCK_POSX, positionY.upper_row + CARDS_LEFT_IN_STOCK_POSY);
    }
    if (wasteDeck.length === 0) {
        renderEmptyWaste(context, positionX.wasteDeck, positionY.upper_row);
    }
    function clickInRect(clickx, clicky, rectx, recty, rectWidth, rectHeight) {
        return clickx >= rectx && clickx < rectx + rectWidth && clicky >= recty && clicky < recty + rectHeight;
    }
    function placeCardsInColumn(cards, columnIndex) {
        const column = tableau[columnIndex];
        cards.forEach(card => {
            card.posx = columnPositionsX[columnIndex];
            card.posy = positionY.lower_row + column.length * positionY.lower_row_card_offset;
            column.push(card);
        });
    }
    function clearDraggedCards() {
        draggedCards.forEach(e => e.isBeingDragged = false);
        draggedCards = [];
        draggedCardOrigin = [];
        draggedCardOriginPos = { originX: 0, originY: 0 };
    }
    canvas.addEventListener("mousedown", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (wrapItUp(x, y))
            return;
        if (y > 250) //the click is in the tableau
         {
            for (const column of tableau) {
                for (let index = column.length - 1; index >= 0; index--) {
                    if (column[index].faceUp == true &&
                        clickInRect(x, y, column[index].posx, column[index].posy, CARD_WIDTH, CARD_HEIGHT)) {
                        cardOffsetX = x - column[index].posx;
                        cardOffsetY = y - column[index].posy;
                        draggedCardOriginPos = { originX: column[index].posx, originY: column[index].posy };
                        draggedCards = column.splice(index);
                        draggedCardOrigin = column;
                        break;
                    }
                }
                if (draggedCards.length > 0) {
                    draggedCards.forEach(card => card.isBeingDragged = true);
                    break;
                }
            }
        }
        else { //click upper rows
            if (clickInRect(x, y, positionX.stockDeck, positionY.upper_row, CARD_WIDTH, CARD_HEIGHT)) {
                if (stockDeck.length === 0)
                    recycleWasteDeck();
                else
                    drawfromStock();
            }
            else if (clickInRect(x, y, positionX.wasteDeck, positionY.upper_row, CARD_WIDTH, CARD_HEIGHT)) {
                const auxCard = wasteDeck.pop();
                draggedCardOrigin = wasteDeck;
                cardOffsetX = x - positionX.wasteDeck;
                cardOffsetY = y - positionY.upper_row;
                draggedCardOriginPos = { originX: positionX.wasteDeck, originY: positionY.upper_row };
                if (auxCard) {
                    draggedCards = [auxCard]; // for wasteDeck is only a single card every time
                    auxCard.isBeingDragged = true;
                }
            }
            else {
                const clickedFoundationZone = fixedZones.find(element => clickInRect(x, y, element.x, element.y, CARD_WIDTH, CARD_HEIGHT));
                if (clickedFoundationZone?.suit !== undefined) {
                    const selectedFoundation = foundations[clickedFoundationZone.suit];
                    const auxCard = selectedFoundation.pop();
                    draggedCardOrigin = selectedFoundation;
                    cardOffsetX = x - clickedFoundationZone.x;
                    cardOffsetY = y - positionY.upper_row;
                    draggedCardOriginPos = { originX: clickedFoundationZone.x, originY: positionY.upper_row };
                    if (auxCard) {
                        draggedCards = [auxCard];
                        auxCard.isBeingDragged = true;
                    }
                }
            }
        }
        renderAll(context, x, y);
    });
    canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (wrapItUp(x, y))
            return;
        renderAll(context, x, y);
    });
    canvas.addEventListener("mouseup", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let placed = true;
        if (clickInRect(x, y, START_BUTTON.posx, START_BUTTON.posy, START_BUTTON.width, START_BUTTON.height)) {
            stockDeck = [...allCards];
            allCards.forEach(card => card.faceUp = false);
            wasteDeck = [];
            suits.forEach(suit => foundations[suit] = []);
            tableau.forEach(col => col.length = 0);
            suffle(stockDeck);
            fillTableau(stockDeck);
            gameWon = false;
            renderAll(context, x, y);
            startTime = Date.now();
            return;
        }
        //esto tiene que estar despues del shuffle button
        if (wrapItUp(x, y))
            return;
        if (draggedCards.length > 0) {
            draggedCards.forEach(card => card.isBeingDragged = false);
            if (y > positionY.lower_row) {
                const columnIndex = columnPositionsX.findIndex((element) => {
                    return x > element && x <= element + COLUMN_SPACING;
                });
                //solo estas en la coumna de tableau si tambien coincidis en distancia vertical
                if (columnIndex !== -1) {
                    if (tableau[columnIndex].length === 0 && y < positionY.lower_row + CARD_HEIGHT) {
                        if (draggedCards[0].value === 13) {
                            placeCardsInColumn(draggedCards, columnIndex);
                            if (draggedCardOrigin.length > 0)
                                draggedCardOrigin[draggedCardOrigin.length - 1].faceUp = true;
                            clearDraggedCards();
                        }
                        else {
                            placed = false;
                        }
                    }
                    else if (tableau[columnIndex].length !== 0 &&
                        y < tableau[columnIndex][tableau[columnIndex].length - 1].posy + CARD_HEIGHT &&
                        tableau[columnIndex][tableau[columnIndex].length - 1].color !== draggedCards[0].color &&
                        tableau[columnIndex][tableau[columnIndex].length - 1].value === draggedCards[0].value + 1) { //si se valida color y valor, se agrega a la columna
                        placeCardsInColumn(draggedCards, columnIndex);
                        if (draggedCardOrigin.length > 0)
                            draggedCardOrigin[draggedCardOrigin.length - 1].faceUp = true;
                        clearDraggedCards();
                    }
                    else {
                        placed = false;
                    }
                }
                else { //si no se valida vuelve al origen         
                    placed = false;
                }
            }
            else { // si el mouseup es fuera del tableau
                if (x >= 460 && x <= 820 + CARD_WIDTH && y >= 50 && y <= 50 + CARD_HEIGHT) { //ver si esta sobre los foundations
                    const currentFoundationSuit = fixedZones.find(element => x > element.x && x < element.x + CARD_WIDTH && y > element.y && y < element.y + CARD_HEIGHT)?.suit;
                    //Se usa find en vez de foreach porque find si retorna algo mientras que foreach no esta hecho para retornos
                    //la funcion arrow simplificada (sin los {}) se usa para pasar una expresion que puede dar verdadero o falso.
                    //Si da falso devuelve undefined, si da verdadero te devuelve esa primera ocurrencia, el "element"
                    //luego ese element se le hace el .suit que es el valor que necesito
                    //por eso la variable que se le asigna es del tipo Suit|undefined
                    if (currentFoundationSuit !== undefined && currentFoundationSuit === draggedCards[0].suit) {
                        const suit = draggedCards[0].suit;
                        if (draggedCards.length === 1 &&
                            (foundations[suit].length === 0 ? draggedCards[0].value === 1 :
                                draggedCards[0].value === foundations[suit][foundations[suit].length - 1].value + 1)) {
                            foundations[suit].push(draggedCards[0]);
                            if (draggedCardOrigin.length > 0)
                                draggedCardOrigin[draggedCardOrigin.length - 1].faceUp = true;
                            clearDraggedCards();
                        }
                        else {
                            placed = false;
                        }
                    }
                    else {
                        placed = false;
                    }
                }
                else { //Si no esta en los foundations, tiene que fallar la verificacion
                    placed = false;
                }
            }
            if (!placed) {
                draggedCardOrigin.push(...draggedCards);
                draggedCards.forEach((element, index) => {
                    element.posx = draggedCardOriginPos.originX;
                    element.posy = draggedCardOriginPos.originY + index * positionY.lower_row_card_offset;
                });
                clearDraggedCards();
            }
        }
        renderAll(context, x, y);
    });
    canvas.addEventListener("dblclick", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (clickInRect(x, y, positionX.wasteDeck, positionY.upper_row, CARD_WIDTH, CARD_HEIGHT) && wasteDeck.length > 0) {
            const lastCard = wasteDeck[wasteDeck.length - 1];
            if (lastCard.value === 1) {
                const card = wasteDeck.pop();
                if (card !== undefined)
                    foundations[card.suit].push(card);
            }
            else if (foundations[lastCard.suit].length > 0) {
                const lastFoundCardIndex = foundations[lastCard.suit].length - 1;
                if (lastCard.value === foundations[lastCard.suit][lastFoundCardIndex].value + 1) {
                    const card = wasteDeck.pop();
                    if (card !== undefined)
                        foundations[lastCard.suit].push(card);
                }
            }
        }
        if (y > 260) {
            let ColumnIndex = columnPositionsX.findIndex(element => x > element && x < element + CARD_WIDTH);
            let lastCardValidation = tableau[ColumnIndex].at(-1); //Esto te trae el ultimo elemento del array, un -2 traeria el ante ultimo
            if (lastCardValidation !== undefined &&
                clickInRect(x, y, lastCardValidation?.posx, lastCardValidation?.posy, CARD_WIDTH, CARD_HEIGHT)) {
                const lastFoundationCard = foundations[lastCardValidation.suit].at(-1);
                if (lastCardValidation.value === 1 && foundations[lastCardValidation.suit].length === 0) {
                    const lastCard = tableau[ColumnIndex].pop();
                    if (lastCard !== undefined)
                        foundations[lastCard.suit].push(lastCard);
                }
                else {
                    if (lastFoundationCard !== undefined && lastCardValidation.value === lastFoundationCard.value + 1) {
                        const lastCard = tableau[ColumnIndex].pop();
                        if (lastCard !== undefined)
                            foundations[lastCard.suit].push(lastCard);
                    }
                }
                if (tableau[ColumnIndex].length > 0)
                    tableau[ColumnIndex][tableau[ColumnIndex].length - 1].faceUp = true;
            }
        }
        if (wrapItUp(x, y))
            return;
        renderAll(context, x, y);
    });
    function isGameWon() {
        return foundations.hearts.length === 13 &&
            foundations.diamonds.length === 13 &&
            foundations.clubs.length === 13 &&
            foundations.spades.length === 13;
    }
    const wrapItUp = function (x, y) {
        const wasAlreadyWon = gameWon;
        gameWon = isGameWon();
        if (gameWon && !wasAlreadyWon) {
            const elapsedMs = Date.now() - startTime; // milisegundos transcurridos
            const elapsedSeconds = Math.floor(elapsedMs / 1000);
            minutes = Math.floor(elapsedSeconds / 60);
            seconds = elapsedSeconds % 60;
        }
        if (gameWon) {
            renderAll(context, x, y);
            renderEndGame(context, END_GAME_SIGN);
        }
        return gameWon;
    };
}
// document.addEventListener("keyup", (event) => {
//   if (event.key === "d") {
//     tableau.forEach((element, index1) => {
//       console.log("tableau column = ", index1, '\n')
//       element.forEach((cards, index2) => {
//         console.log("card pos = ", index2, " value is = ", cards.value, "  and posx,y = ", cards.posx, "  ", cards.posy, "  faceup = ", cards.faceUp)
//       })
//     })
//     console.log("done" + '\n')
//   }
//   if (event.key === "s") {
//     console.log("waste deck = \n")
//     wasteDeck.forEach((element, index) => console.log("card number = ", index, " Value = ", element.value))
//     console.log("done" + '\n')
//   }
//   if (event.key === "a") {
//     console.log("Hearts = \n")
//     foundations['hearts'].forEach((element, index) => console.log("card number = ", index, " Value = ", element.value))
//     console.log("diamonds = \n")
//     foundations['diamonds'].forEach((element, index) => console.log("card number = ", index, " Value = ", element.value))
//     console.log("clubs = \n")
//     foundations['clubs'].forEach((element, index) => console.log("card number = ", index, " Value = ", element.value))
//     console.log("spades = \n")
//     foundations['spades'].forEach((element, index) => console.log("card number = ", index, " Value = ", element.value))
//     console.log("done" + '\n')
//   }
// })
//# sourceMappingURL=main.js.map