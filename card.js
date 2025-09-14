class Card {
    // Это масть карты
    suit = null;
    // Это ранк карты
    value = null;

    element = null;

    
    isFaсeUp = false;

    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }

    valuePicture() {
        switch (this.value){
            case 1: return 'A';
            case 11: return 'J';
            case 12: return 'Q';
            case 13: return 'K';
            default: return this.value;
        }
    }

    suitPicture() {
        const suit = {
            'hearts': '♥',
            'clubs': '♣',
            'spades': '♠',
            'diamonds': '♦'
        };
        return suit[this.suit];
    }

    cardColor() {
        if(this.suit == 'hearts' || this.suit == 'diamonds') {
            return 'card-red';
        } else {
            return 'card-black';
        }
    }

    flipCard() {
        if(!this.isFaсeUp) {
            this.isFaсeUp = true;
        } else {
            this.isFaсeUp = false;
        }
        return this
    }

    // flippedCard() {
    //     if(!this.isFaсeUp) {
    //         this.classList.remove('card-back')
    //         this.isFaсeUp = true;
    //     }
    // }

    createElement() {
        this.element = document.createElement('div');
        this.element.id = `card_${this.suit}_${this.valuePicture()}`;
        this.element.dataset.suit = `${this.suit}`
        this.element.dataset.ranc = `${this.value}`
        this.element.className = 'card';
        this.element.classList.add(this.cardColor());   
 
        this.element.innerHTML =
        `<div class="card-front">
            <div class="card-top">
                <div class="card-value">${this.valuePicture()}</div>
                <div class="card-suit">${this.suitPicture()}</div>
            </div>
            <div class="card-center">${this.suitPicture()}</div>
            <div class="card-down">
                <div class="card-suit">${this.suitPicture()}</div>
                <div class="card-value">${this.valuePicture()}</div>
            </div>
        </div>`;
        if(!this.isFaсeUp){
            this.element.classList.add('card-back');
        }
        return this.element
    }
}
