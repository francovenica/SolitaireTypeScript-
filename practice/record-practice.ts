// Practice: Record<K, V>
// Write your answers below each exercise. Ask Claude to check them as you go.

type DayOfTheWeek = "mon"|"tues"|"wed"|"thu"|"fri"|"sat"|"sun";

const isWeekend: Record<DayOfTheWeek, boolean> = {
    mon: false,
    tues: false,
    wed: false,
    thu: false,
    fri: false,
    sat: true,
    sun: true
}

type Suit = "hearts"|"diamonds"|"spades"|"clubs";
const SUIT_COLORS: Record<Suit,string> = {
    hearts:"red",
    diamonds:"red",
    clubs:"black",
    spades:"black"
}

const suits: Suit[] = ["hearts","diamonds","spades","clubs"];

for (let i = 0; i < suits.length; i++) {
    const colors: string = SUIT_COLORS[suits[i]];
    console.log(colors);
}

const nestedRecord: Record<Suit, Record<"symbol", string> | Record<"color", string>> = {
    hearts: {
        symbol: "♥",
        color: "red"
    },
    diamonds: {
        symbol: "♦",
        color: "red"
    },
    clubs: {
        symbol: "♣",
        color: "black"
    },
    spades: {
        symbol: "♠",
        color: "black"
    }
}