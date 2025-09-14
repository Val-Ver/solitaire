
 class DeckStopka {
    cards = [];
    element = null;

    constructor(element, сontrollerDragging) {
        this.element = element;
        this.controllerDragging = сontrollerDragging;
        this.controllerDragging.addStopki(this);
    }

    addCard(card) {
        this.cards.push(card);
        this.update();
    }

    update(){
        this.render();
        this.giveCardToListener();
    }

    render() {
        this.element.innerHTML = '';
        if(this.cards.length == 0) { return }
        for(let card = 0; card < this.cards.length; card++) {
            if(card == this.cards.length - 1 || card == this.cards.length - 2) {
                let newCard = this.cards[card];
                this.element.appendChild(newCard.createElement());
            }
        }
    }

    giveCardToListener() {
        const topCard = this.lookTopCard();
        if(topCard && topCard.isFaсeUp) {
            this.controllerDragging.startCardListener(topCard, [topCard]);
        }
    }

    reverseDeck() {
        return [...this.cards].reverse();
    }

    clearDeck() {
        this.element.innerHTML = '';
        return this.cards = [];
    }

    takeCard() {
        const card = this.cards.pop();
        this.update();
        return card;
    }

    lookTopCard() {
        if(this.cards.length == 0) { return null }
        return this.cards[this.cards.length - 1];
    }

    isEmpty() {
        return this.cards.length == 0;
    }
}

 class DesktopStopka {
    cards = [];
    element = null;

    constructor(element, сontrollerDragging) {
        this.element = element;
        this.controllerDragging = сontrollerDragging;
        this.controllerDragging.addStopki(this);
    }

    addCard(card) {
        this.cards.push(card);
        this.render();
        this.giveCardToListener();  
    }

    update() {
        if (!this.isEmpty()) {
            const topCard =  this.lookTopCard();
            if (!topCard.isFaсeUp) {
                topCard.flipCard();   //убрала метод  flipCard2
            }
        }
        this.render();
        this.giveCardToListener();
    }

    checkCanPutCard(card) {
        if(this.cards.length == 0) {
            return card.value == 13;
        }

        let topCard = this.lookTopCard(card);
        return card.cardColor() != topCard.cardColor() && Number(card.value) == Number(topCard.value) - 1;
    }

    render() {
        this.element.innerHTML = '';
        this.cards.forEach((card, i) => {
            const element = card.createElement()
            element.style.top = (i * 25) + 'px';
            this.element.appendChild(element);
        });
    }

    giveCardToListener() {
        const facedUpCards = this.cards.filter((card) => {
            return card.isFaсeUp;
        })

        for(let i = 0; i < facedUpCards.length; i++) {
            const cardsToMove = facedUpCards.slice(i, facedUpCards.length);
            this.controllerDragging.startCardListener(facedUpCards[i], cardsToMove);
        }
    }

    takeCard(card) {
        if(this.cards.length == 0) { return null }
        let currentCardIndex = this.cards.findIndex(card1 => card1.element === card.element)
        let currentCards = this.cards.splice(currentCardIndex, 1);
        this.update(); 
    }

    lookTopCard() {
        if(this.cards.length == 0) { return null }
        return this.cards[this.cards.length - 1];
    }

    isEmpty() {
        return this.cards.length == 0;
    }
}

class HomeStopka {
    cards = [];
    element = null;

    constructor(element, сontrollerDragging) {
        this.element = element;
        this.controllerDragging = сontrollerDragging;
        this.controllerDragging.addStopki(this);
    }

    addCard(card) {
        this.cards.push(card);
        this.update();
    }

    update() {
        this.render();
        this.giveCardToListener();            
    }

    checkCanPutCard(card){
        if(this.cards.length == 0) {
            return card.value == 1;
        }
        let topCard = this.lookTopCard();
        return card.suit == topCard.suit && Number(card.value) == Number(topCard.value) + 1;
    }

    render() {
        this.element.innerHTML = '';
        this.cards.forEach((card) => {
            this.element.appendChild(card.createElement());
         });           
    }

    giveCardToListener() {
        const topCard = this.lookTopCard();
        if (topCard) {
            this.controllerDragging.startCardListener(topCard, [topCard]);
        }
    }

    takeCard() { //переименовала была takeTopCard
        if(this.cards.length == 0) { return null }
        this.cards.pop();
        this.update();
    }

    lookTopCard() {
        if(this.cards.length == 0) { return null }
        return this.cards[this.cards.length - 1];
    }

    isEmpty() {
        return this.cards.length == 0;
    }
}