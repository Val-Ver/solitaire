

class ControllerDragging {
    stock = null;
    waste = null;
    desktops = [];
    homeDesks = [];

    currentCard = null;

    stopkaCard = null;
    stopkaUnderCard = null;

    isDragging = false;

    lastZindex = null
    lastMousePosition = null

    listenerController = new AbortController();
    
    score = 0; 

    moveHistory = [];

    constructor() {
        this.initButtonBack()
    }

    addScore(score) {
        this.score = score;
        this.score.updateScore()
    }

    addStopki(stopka) {
        switch(stopka.element.dataset.type) {
            case 'stock':   this.stock = stopka; 
                            break;

            case 'waste':   this.waste = stopka; 
                            break;

            case 'desktop': this.desktops[stopka.element.dataset.number] = stopka; 
                            break;

            case 'homeDesk':this.homeDesks[stopka.element.dataset.number] = stopka; 
                            break;
        }
    }

    initButtonBack() {
        document.getElementById('back').addEventListener('click', () => {
            if(this.moveHistory.length > 0) {
                const lastMove = this.moveHistory.pop();
                this.backMove(lastMove);
            }
        });
    }

    backMove(move) {
        const cards = move.cards;

        if(move.fromTypeStopka.element.dataset.type == 'desktop') {
            console.log(this.desktops[move.fromTypeStopka.element.dataset.number].cards.length)
            if(this.desktops[move.fromTypeStopka.element.dataset.number].cards.length > 0) {
                if(this.desktops[move.fromTypeStopka.element.dataset.number].lookTopCard().isFaсeUp) { 
                    this.desktops[move.fromTypeStopka.element.dataset.number].lookTopCard().flipCard()
                }
            }
        }

        cards.forEach((card) => {
            switch(move.toTypeStopka.element.dataset.type) {
                case 'desktop': this.desktops[move.toTypeStopka.element.dataset.number].takeCard(card); 
                                break;

                case 'homeDesk':this.homeDesks[move.toTypeStopka.element.dataset.number].takeCard(card); 
                                break;
            }

            switch(move.fromTypeStopka.element.dataset.type) {
                case 'desktop': 
                                this.desktops[move.fromTypeStopka.element.dataset.number].addCard(card); 
                                break;

                case 'homeDesk':this.homeDesks[move.fromTypeStopka.element.dataset.number].addCard(card); 
                                break;

                case 'waste':   this.waste.addCard(card); 
                                break;         
            }
        })
    }


    startCardListener(card, cards) {
        let cardElement = card.element;
        let cardsToMove = cards;

       // this.listenerController.abort(); // с ним нет передвижения, он не работал из-за опечатки

        this.isDragging = false;
        this.lastZindex = 0;

        cardElement.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            cardElement.setPointerCapture(e.pointerId); 
//console.log(cardElement.hasPointerCapture(e.pointerId))
            this.isDragging = true;
            this.lastZindex = cardElement.style.zIndex;
            this.lastMousePosition = { x: e.clientX, y: e.clientY };

            let typeOfStopka = null;
            let numberOfStopka = 0;

            const elementsPoint = document.elementsFromPoint(e.clientX,e.clientY);

            for(let i = 0; i < elementsPoint.length; i++) {
                let element = elementsPoint[i];
                if(element.dataset.type  == 'desktop') {
                    typeOfStopka = 'desktop';
                    numberOfStopka = element.dataset.number;
                    break;
                }

                if(element.dataset.type  == 'homeDesk') {
                    typeOfStopka = 'homeDesk';
                    numberOfStopka = element.dataset.number;
                    break;
                }

                if(element.dataset.type  == 'waste') {
                    typeOfStopka = 'waste';
                    break;
                }
            }

            switch(typeOfStopka) {
                case 'desktop':     this.stopkaCard =  this.desktops[numberOfStopka];
                                    this.currentCard = card;
                                    break;

                case 'homeDesk':    this.stopkaCard =  this.homeDesks[numberOfStopka];
                                    this.currentCard = card;
                                    break;                 
                case 'waste':       this.stopkaCard =  this.waste;
                                    this.currentCard = card;
                                    break;
                //default:                     
            }

            document.addEventListener('pointermove', mouseMoveHandler);
             document.addEventListener('pointerup', mouseUpHandler);
        }, { signal: this.listenerController.signal }) //была опечатка

        let mouseMoveHandler = (e) => {
            if(!this.isDragging) { return }

            const currnetMouseMove = { x: e.clientX, y: e.clientY };

            const deltaX = currnetMouseMove.x - this.lastMousePosition.x;
            const deltaY = currnetMouseMove.y - this.lastMousePosition.y;

            cardsToMove.forEach(card => {
                let cardElementToMove = card.element;
                cardElementToMove.style.position = 'absolute';
                cardElementToMove.style.zIndex = '1000';

                const cardBounds = cardElementToMove.getBoundingClientRect();
                const left = getComputedStyle(cardElementToMove).getPropertyValue('left').split('px')[0];
                const top = getComputedStyle(cardElementToMove).getPropertyValue('top').split('px')[0];

                cardElementToMove.style.left = Number(left) + deltaX + 'px';
                cardElementToMove.style.top = Number(top) + deltaY + 'px';
            })

            this.lastMousePosition = currnetMouseMove;
        }

        let mouseUpHandler = (e) => {

            this.isDragging = false;
            cardElement.style.zIndex = this.lastZindex;

            const elementsUnderPoint = document.elementsFromPoint(e.clientX,e.clientY);

            let typeOfStopka = null;
            let numberOfStopka = 0;

            for(let i = 0; i < elementsUnderPoint.length; i++) {
                let element = elementsUnderPoint[i];

                if(element.dataset.type  == 'desktop') {
                    typeOfStopka = 'desktop';
                    numberOfStopka = element.dataset.number;
                    break;
                }    

                if(element.dataset.type  == 'homeDesk') {
                    typeOfStopka = 'homeDesk';
                    numberOfStopka = element.dataset.number;
                    break;
                }
            }

            switch(typeOfStopka) {
                case 'desktop': {
                    this.stopkaUnderCard =  this.desktops[numberOfStopka];
                    const isCanDropCard = this.stopkaUnderCard.checkCanPutCard(this.currentCard);

                    if (isCanDropCard) {
                        cardsToMove.forEach((card) => {
                            this.stopkaUnderCard.addCard(card);
                            this.stopkaCard.takeCard(card);
                            this.score.addMoved();

                        }) 
                        this.moveHistory.push(new Move(this.stopkaCard, this.stopkaUnderCard, cardsToMove))
                    } else {
                         this.returnCardOnStartPosition();
                    }
                    break;
                }

                case 'homeDesk': {
                    if (cardsToMove.length > 1) {
                        this.returnCardOnStartPosition();
                        break;

                    }

                    this.stopkaUnderCard = this.homeDesks[numberOfStopka];
                    const isCanDropCard = this.stopkaUnderCard.checkCanPutCard(this.currentCard);

                    if (isCanDropCard) {
                        this.stopkaCard.takeCard(cardsToMove[0]);
                        this.stopkaUnderCard.addCard(cardsToMove[0]);
                        this.score.addMoved();
                        this.moveHistory.push(new Move(this.stopkaCard, this.stopkaUnderCard, cardsToMove))
                    } else {
                        this.returnCardOnStartPosition();
                    }
                    break;
                }

                default: {
                    this.returnCardOnStartPosition();
                }
            }

            document.removeEventListener('pointermove', mouseMoveHandler);
            document.removeEventListener('pointerup', mouseUpHandler);
            cardElement.releasePointerCapture(e.pointerId); 
        }
    }   

    returnCardOnStartPosition() {
        this.stopkaCard.update();
    }
}

