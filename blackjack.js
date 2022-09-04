let dealerSum = 0;
let playerSum = 0;

let dealerAceCount = 0;
let playerAceCount = 0;

let hidden;


let canHit = true;

window.onload = function () {
    let deck = shuffleDeck(buildDeck());
    startGame(deck)
}

function buildDeck() {
    let cardTypes = ["C", "D", "H", "S"];
    let cardValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    let deck = [];

    for (let typeCount = 0; typeCount < cardTypes.length; typeCount++) {
        for (let valueCount = 0; valueCount < cardValues.length; valueCount++) {
            deck.push(cardValues[valueCount] + "-" + cardTypes[typeCount]);
        }
    }

    return deck;
}

function shuffleDeck(deck) {
    for (let deckCount = 0; deckCount < deck.length; deckCount++) {
        let randomCard = Math.floor(Math.random() * deck.length);
        let tempCard = deck[deckCount];
        deck[deckCount] = deck[randomCard];
        deck[randomCard] = tempCard;
    }

    return deck;
}

function checkAce(card) {
    if (card[0] === "A") {
        return 1;
    }
    return 0;
}


function startGame(deck) {


    hidden = deck.pop();
    dealerSum += getCardValue(hidden);
    dealerAceCount += checkAce(hidden);


    while (dealerSum < 17) {
        let cardSprite = document.createElement("img");
        let card = deck.pop();
        cardSprite.src = `./card-sprites/` + card + `.png`;
        dealerSum += getCardValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardSprite);
    }


    for (let playerStartCards = 0; playerStartCards < 2; playerStartCards++) {
        let cardSprite = document.createElement("img");
        let card = deck.pop();
        cardSprite.src = `./card-sprites/` + card + `.png`;
        playerSum += getCardValue(card);
        playerAceCount += checkAce(card);
        document.getElementById("player-cards").append(cardSprite);
    }

    document.getElementById("player-sum").innerText = playerSum;
    document.getElementById("hit").addEventListener("click", hit)
    document.getElementById("stay").addEventListener("click", stay)




    document.getElementById("reset").addEventListener("click", reset)
    function hit() {
        if (!canHit) {
            return;
        }

        let cardSprite = document.createElement("img");
        let card = deck.pop();
        cardSprite.src = `./card-sprites/` + card + `.png`;
        playerSum += getCardValue(card);
        playerAceCount += checkAce(card);
        document.getElementById("player-cards").append(cardSprite);
        document.getElementById("player-sum").innerText = playerSum;

        if (playerSum > 21) {
            checkWinner();
        }

        if (reduceAceCard(playerSum, playerAceCount) > 21) {
            canHit = false;
        }

    }

    function stay() {
        dealerSum = reduceAceCard(dealerSum, dealerAceCount);
        playerSum = reduceAceCard(playerSum, playerAceCount);

        canHit = false;
        checkWinner();

    }

    function reduceAceCard(playerSum, playerAceCount) {
        while (playerSum > 21 && playerAceCount > 0) {
            playerSum -= 10;
            playerAceCount -= 1;
        }
        return playerSum;
    }

    function checkWinner() {
        let resultMessage = "";
        if (playerSum > 21) {
            resultMessage = "THE PLAYER LOSES";
        } else if (dealerSum > 21) {
            resultMessage = "THE PLAYER WINS";
        } else if (playerSum === dealerSum) {
            resultMessage = "THAT'S A TIE"
        } else if (playerSum > dealerSum) {
            resultMessage = "THE PLAYER WINS"
        } else if (playerSum < dealerSum) {
            resultMessage = "THE PLAYER LOSES"
        }
        document.getElementById("hidden").src = "./card-sprites/" + hidden + ".png";
        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("results").innerText = resultMessage;
        document.getElementById('reset').removeAttribute("disabled");
        document.getElementById('hit').setAttribute("disabled","");
        document.getElementById('stay').setAttribute("disabled","");



    }
}

function reset() {
    location.reload();
}

function getCardValue(card) {
    let cardData = card.split("-");
    let cardValue = cardData[0];

    if (isNaN(cardValue)) {
        if (cardValue === "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(cardValue);
}