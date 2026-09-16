type Suit = "hearts" | "diamonds" | "clubs" | "spades";
const OFFSCREEN_POS = 2000


  interface Card {
  suit: Suit;
  value: number;        // 1-13 (1 = As, 11 = J, 12 = Q, 13 = K)
  color: "red" | "black";
  faceUp: boolean;
  isBeingDragged: boolean;
  posx: number, 
  posy: number
  }

  const allCards: Card[] = [];
  const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
  
  for (let i = 0; i < 4; i++) {
    for (let j = 1; j <= 13; j++) {
      const card: Card = {
        suit: suits[i],
        value: j,
        color: i < 2 ? "red" : "black",
        faceUp: false,
        isBeingDragged: false,
        posx: OFFSCREEN_POS,
        posy: OFFSCREEN_POS
    };
    allCards.push(card)
    }
  }

  function updateCardPos(card:Card, x: number, y: number) {
    card.posx = x
    card.posy = y
  }