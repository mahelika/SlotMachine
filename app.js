const ROWS = 3;
const COLS = 3;

const SYMBOL_COUNT = {
    "🦄": 2,
    "🐳": 4,
    "🦖": 6,
    "🐝": 8
};

const SYMBOL_VALUES = {
    "🦄": 5,
    "🐳": 4,
    "🦖": 3,
    "🐝": 2
};

let balance = 0;
let totalWins = 0;
let totalLosses = 0;

const updateBalance = () => {
    document.getElementById('balance').textContent = `Balance: $${balance}`;
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
};

const handleSpin = () => {
    const depositAmount = parseInt(document.getElementById('deposit').value);
    const lines = parseInt(document.getElementById('lines').value);
    const bet = parseInt(document.getElementById('bet').value);

    if (isNaN(depositAmount) || isNaN(lines) || isNaN(bet) || lines < 1 || lines > 3 || bet < 1) {
        document.getElementById('message').textContent = "Invalid input. Please check your values.";
        return;
    }

    if (balance === 0 && depositAmount > 0) {
        balance = depositAmount;
        updateBalance();
    }

    const totalBet = bet * lines;
    if (totalBet > balance) {
        document.getElementById('message').textContent = "Insufficient balance for this bet.";
        return;
    }

    balance -= totalBet;
    const reels = spin();
    const rows = transpose(reels);


    for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
            document.getElementById(`reel${i + 1}-${j + 1}`).textContent = rows[j][i];
        }
    }

    const winnings = getWinnings(rows, bet, lines);
    balance += winnings;

    if (winnings > 0) {
        totalWins += winnings;
    } else {
        totalLosses += totalBet;
    }

    updateBalance();
    document.getElementById('message').textContent = `You bet $${totalBet} and won $${winnings}!`;

    if (balance <= 0) {
        document.getElementById('message').textContent += " Game over. Please deposit more to continue playing.";
        document.getElementById('spinButton').disabled = true;
        document.getElementById('lever').disabled = true;
    }
};


document.getElementById('spinButton').addEventListener('click', handleSpin);
document.getElementById('lever').addEventListener('click', () => {
    console.log('Lever clicked');
    handleSpin();
});

document.getElementById('exitButton').addEventListener('click', () => {
    document.getElementById('message').textContent = `Thanks for playing! Your final balance is $${balance}. Wins: $${totalWins}, Losses: $${totalLosses}.`;
    document.getElementById('spinButton').disabled = true;
    document.getElementById('lever').disabled = true;
    document.getElementById('exitButton').disabled = true;
    balance = 0;
    updateBalance();
    
    document.getElementById('deposit').value = '';
    document.getElementById('lines').value = '';
    document.getElementById('bet').value = '';
});


updateBalance();
