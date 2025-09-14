window.addEventListener("load", main);

function main() {
    // const gameContainer = document.getElementById('game-container');
    // let game = new Game(gameContainer);

    let game = new Game('game-container');

}

class Game {
    element = null;

    deck = new Deck();
 
    stock = null;
    waste = null;
    
    desktops = [];
    desktopsCount = 7;
    homeDesks = [];
    homeDesksCount = 4;

    //listenerController = new AbortController();
    controllerDragging = null; 
    movedCount = null;

    constructor(idElement) {
        this.element = document.getElementById(idElement)
        this.createGameBoardElements();
 
        this.controllerDragging = new ControllerDragging();
        this.movedCount = new Score(this.controllerDragging);

        this.deck.shuffleCards();
        this.initStockCards();
        this.desktopCard();
        this.homeDesksCard();
        this.initButtonAgain()
    }

    initButtonAgain() {
        document.getElementById('again').addEventListener('click', () => {
            this.gameAgain();
        })
    }

    gameAgain() {
        // this.deck = [];
        // this.stock = []
        // this.waste = [];
        
        // this.desktops = [];

        // this.homeDesks = [];

        // this.controllerDragging = null; 
        // this.movedCount = null;

        this.element.innerHTML = ''
        this.createGameBoardElements();

        this.deck = new Deck();

        this.controllerDragging = new ControllerDragging();
        this.movedCount = new Score(this.controllerDragging);

        this.deck.shuffleCards();
        this.initStockCards();
        this.desktopCard();
        this.homeDesksCard();
        this.initButtonAgain()
    }

    createGameBoardElements() {
        //const gameContainer = document.getElementById('game-container');
        // this.element.innerHTML =
        this.element.innerHTML =
            `<div class="score-container">
                <h1>Solitaire</h1>
                <p>Count of moves: <span class="score">0</span></p>
                <div class="all-button">
                        <button id="back">back</button>
                        <button id="again">game again</button>
                </div>   
            </div>

            <div class="board-container">
                <div class="deck-container">
                    <div class="deck" data-type="stock" id="stock"></div>
                    <div class="deck" data-type="waste" id="waste"></div>
                </div>

                <div class="deck" id="empty"></div>

                <div class="fundament-container">
                    <div class="fundament" data-type="homeDesk" data-number="0" id="fundament-0"></div>
                    <div class="fundament" data-type="homeDesk" data-number="1" id="fundament-1"></div>
                    <div class="fundament" data-type="homeDesk" data-number="2" id="fundament-2"></div>
                    <div class="fundament" data-type="homeDesk" data-number="3" id="fundament-3"></div>
                </div>
            </div>

            <div class="desktop-container">
                <div class="desktop-column1">
                    <div class="desktop-column" data-type="desktop" data-number="0" id="column-0"></div>
                </div>

                <div class="desktop-column1">
                    <div class="desktop-column" data-type="desktop" data-number="1" id="column-1"></div>
                </div>

                <div class="desktop-column1">               
                    <div class="desktop-column" data-type="desktop" data-number="2" id="column-2"></div>
                </div>

                <div class="desktop-column1">                
                    <div class="desktop-column" data-type="desktop" data-number="3" id="column-3"></div>
                </div>

                <div class="desktop-column1">               
                    <div class="desktop-column" data-type="desktop" data-number="4" id="column-4"></div>
                </div>

                <div class="desktop-column1">                
                    <div class="desktop-column" data-type="desktop" data-number="5" id="column-5"></div>
                </div>

                <div class="desktop-column1">                
                    <div class="desktop-column" data-type="desktop" data-number="6" id="column-6"></div>
                </div>        
            </div>`
    }

    initStockCards() {  
        this.stock = new DeckStopka(document.getElementById('stock'), this.controllerDragging);
        this.waste = new DeckStopka(document.getElementById('waste'), this.controllerDragging);

        while(!this.deck.isEmpty()) {
            this.stock.addCard(this.deck.takeTopCardFromDeck());
        }
        
        document.getElementById('stock').addEventListener('click', () => {
            this.clickOnStock();
        });
    }

    clickOnStock() {
        if(!this.stock.isEmpty()){
            const card = this.stock.takeCard().flipCard();

            this.waste.addCard(card);
        } else {
            this.stock.cards = this.waste.reverseDeck();
            this.waste.clearDeck();
            this.stock.cards.forEach(card => {
                card.flipCard();
            })
            this.stock.update(); // нужен ли здесь update? был render, ИИ сказал нужен))))
        }
    }

    desktopCard() {
        for(let i = 0; i < this.desktopsCount; i++) {
            this.desktops[i] = new DesktopStopka(document.getElementById(`column-${i}`), this.controllerDragging)
            for(let j = 0; j <= i; j++) {
                const card = this.stock.takeCard();

                if (j === i) { 
                    card.flipCard(); 
                }
                this.desktops[i].addCard(card);
            }
        }
    }

    homeDesksCard() {
        for(let i = 0; i < this.homeDesksCount; i++) {
            this.homeDesks[i] = new HomeStopka(document.getElementById(`fundament-${i}`), this.controllerDragging)
            //this.homeDesks[i].render()
        }
    }
}
 