class Score {
	 movedCount	= 0;

	 constructor(сontrollerDragging) {
	 	this.controllerDragging = сontrollerDragging;
        this.controllerDragging.addScore(this);
	 }

	 updateScore() {
		document.querySelector('.score').textContent = this.movedCount;
	 }

	 addMoved() {
	 	this.movedCount++;
	 	this.updateScore();
	 }
}

class Move {
	fromTypeStopka = null;
	toTypeStopka = null;
	cards = null;

	constructor(fromTypeStopka, toTypeStopka, cards) {
		this.fromTypeStopka = fromTypeStopka
		this.toTypeStopka = toTypeStopka;
		this.cards = cards;
	}

	
}