

class Deck {
    cards = [];    
    
    constructor() {
        this.createCards();
    }

    createCards() {
        const suit = [ 'hearts', 'clubs', 'spades', 'diamonds' ];

        for (let value = 1; value <= 13; value++) {
            suit.forEach(key => {
                this.cards.push(new Card(key, value));
            })
        }
    }

    shuffleCards() {
        for(let i = this.cards.length-1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    takeTopCardFromDeck() {
        return this.cards.pop();
    }

    isEmpty() {
        return this.cards.length == 0;
    }
}
