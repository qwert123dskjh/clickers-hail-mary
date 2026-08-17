function formatNumber(num) {
    if (num < 1e3) return num.toString();

    const standardSuffixes = ['K', 'M', 'B', 'T'];
    const tier = Math.floor(Math.log10(num) / 3);
    
    let suffix = '';

    if (tier <= standardSuffixes.length) {
        suffix = standardSuffixes[tier - 1];
    } else {
        const alphabetIndex = tier - (standardSuffixes.length + 1);
        const firstChar = String.fromCharCode(97 + Math.floor(alphabetIndex / 26));
        const secondChar = String.fromCharCode(97 + (alphabetIndex % 26));
        suffix = firstChar + secondChar;
    }

    const scaled = num / Math.pow(10, tier * 3);
    return scaled.toFixed(2).replace(/\.00$/, '') + suffix;
}


let cookies = localStorage.getItem("cookies") ? parseInt(localStorage.getItem("cookies")) : 0;
let cursors = localStorage.getItem("cursors") ? parseInt(localStorage.getItem("cursors")) : 0;
let cursorPrice = localStorage.getItem("cursorPrice") ? parseInt(localStorage.getItem("cursorPrice")) : 10;
let clickPowerPrice = localStorage.getItem("clickPowerPrice") ? parseInt(localStorage.getItem("clickPowerPrice")) : 50;
let clickPower = localStorage.getItem("clickPower") ? parseInt(localStorage.getItem("clickPower")) : 1;
let rebirthPrice = localStorage.getItem("rebirthPrice") ? parseInt(localStorage.getItem("rebirthPrice")) : 5000;
let autoBuyCursorPrice = localStorage.getItem("autoBuyCursorPrice") ? parseInt(localStorage.getItem("autoBuyCursorPrice")) : 500;
let autoBuyClickPowerPrice = localStorage.getItem("autoBuyClickPowerPrice") ? parseInt(localStorage.getItem("autoBuyClickPowerPrice")) : 2500;

let autoBuyToggle = document.getElementById("autoBuyDropdown")
let autoBuyIsTrue = false;

let rebirthPriceText = document.getElementById("rebirthPrice")

let clickPowerPriceText = document.getElementById("clickPowerPrice")
let clickPowerButton = document.getElementById("clickPowerButton")
let clickPowerCounter = document.getElementById("clickPowerCounter")
let autoBuyClickPower = document.getElementById("autoBuyClickPower")

let cookieCounter = document.getElementById("counter")
let cookieImage = document.getElementById("mainbutton")

let cursorPriceText = document.getElementById("cursorPrice");
let cursorButton = document.getElementById("cursorButton")
let cursorCounter = document.getElementById("cursorCounter")
let autoBuyCursor = document.getElementById("autoBuyCursor")

let resetButton = document.getElementById("resetButton");

function updateDisplay() {
    cookieCounter.innerHTML = cookies
    cursorCounter.innerHTML = cursors
    clickPowerCounter.innerHTML = clickPower
    cursorPriceText.innerHTML = cursorPrice
    clickPowerPriceText.innerHTML = clickPowerPrice
    rebirthPriceText.innerHTML = rebirthPrice
}
updateDisplay();

function saveGame() {
    localStorage.setItem("cookies", cookies);
    localStorage.setItem("cursors", cursors);
    localStorage.setItem("cursorPrice", cursorPrice);
    localStorage.setItem("clickPowerPrice", clickPowerPrice);
    localStorage.setItem("clickPower", clickPower);
    localStorage.setItem("rebirthPrice", rebirthPrice);
    localStorage.setItem("autoBuyCursorPrice", autoBuyCursorPrice);
    localStorage.setItem("autoBuyClickPowerPrice", autoBuyClickPowerPrice);
}

resetButton.addEventListener('click', () => {
    if (confirm("Are you sure you want to completely reset your progress?")) {
        localStorage.clear();
        cookies = 0;
        cursors = 0;
        cursorPrice = 10;
        clickPowerPrice = 50;
        clickPower = 1;
        rebirthPrice = 5000;
        autoBuyCursorPrice = 500;
        autoBuyClickPowerPrice = 2500;
        
        if (autoBuyCursorInterval) {
            clearInterval(autoBuyCursorInterval);
            autoBuyCursorInterval = null;
        }
        if (autoBuyClickPowerInterval) {
            clearInterval(autoBuyClickPowerInterval);
            autoBuyClickPowerInterval = null;
        }
        autoBuyCursor.style.display = "block";
        autoBuyClickPower.style.display = "block";
        
        updateDisplay();
        saveGame();
    }
});

cookieImage.addEventListener('click', (ev) => {
    cookies += clickPower;
    cookieCounter.innerHTML = cookies
    saveGame();
})
cursorButton.addEventListener('click', (ev) => {
    if (cookies >= cursorPrice) {
        cookies -= cursorPrice;
        cursors += 1
        cursorCounter.innerHTML = cursors
        cookieCounter.innerHTML = cookies
        cursorPrice = Math.floor(cursorPrice * 1.25)
        cursorPriceText.innerHTML = cursorPrice
        saveGame();
    }
})
autoBuyCursor.addEventListener('click', autoBuyCursor_funcCheck)

function autoBuyCursor_funcCheck()
{
    if (cookies >= autoBuyCursorPrice) {
        cookies -= autoBuyCursorPrice
        autoBuyCursor_func();
    }
}

let autoBuyCursorInterval = null;
function autoBuyCursor_func() {
    autoBuyCursor.style.display = "none"
    if (autoBuyCursorInterval) clearInterval(autoBuyCursorInterval);
    autoBuyCursorInterval = setInterval(() => {
        if (cookies >= cursorPrice) {
            cookies -= cursorPrice;
            cursors += 1
            cursorCounter.innerHTML = cursors
            cookieCounter.innerHTML = cookies
            cursorPrice = Math.floor(cursorPrice * 1.25)
            cursorPriceText.innerHTML = cursorPrice
            saveGame();
        }
    }, 100)
    if (autoBuyToggle.value == "On") {
        autoBuyIsTrue = true;
    }
    else {
        autoBuyIsTrue = false;
    }
}
clickPowerButton.addEventListener('click', (ev) => {
    if (cookies >= clickPowerPrice) {
        cookies -= clickPowerPrice;
        clickPower += 1
        clickPowerCounter.innerHTML = clickPower
        cookieCounter.innerHTML = cookies
        clickPowerPrice = Math.floor(clickPowerPrice * 1.1)
        clickPowerPriceText.innerHTML = clickPowerPrice
        saveGame();
    }
})
autoBuyClickPower.addEventListener('click', autoBuyClickPower_funcCheck)

function autoBuyClickPower_funcCheck() {
    if (cookies >= autoBuyClickPowerPrice) {
        cookies -= autoBuyClickPowerPrice
        autoBuyClickPower_func();
    }
}
let autoBuyClickPowerInterval = null;
function autoBuyClickPower_func() {
    autoBuyClickPower.style.display = "none"
    if (autoBuyClickPowerInterval) clearInterval(autoBuyClickPowerInterval);
    autoBuyClickPowerInterval = setInterval(() => {
        if (cookies >= clickPowerPrice) {
            cookies -= clickPowerPrice;
            clickPower += 1
            clickPowerCounter.innerHTML = clickPower
            cookieCounter.innerHTML = cookies
            clickPowerPrice = Math.floor(clickPowerPrice * 1.1)
            clickPowerPriceText.innerHTML = clickPowerPrice
            saveGame();
        }
    }, 100)
}

rebirth.addEventListener('click', (ev) => {
    if (cookies >= rebirthPrice) {
        cookies -= rebirthPrice;
        cursors = 0
        clickPower = 1
        
        cursorPrice = 10;
        clickPowerPrice = 50;
        
        cookieCounter.innerHTML = cookies
        cursorCounter.innerHTML = cursors
        clickPowerCounter.innerHTML = clickPower
        cursorPriceText.innerHTML = cursorPrice
        clickPowerPriceText.innerHTML = clickPowerPrice
        
        rebirthPrice = Math.floor(rebirthPrice * 2)
        rebirthPriceText.innerHTML = rebirthPrice
        
        autoBuyCursorPrice = Math.floor(autoBuyCursorPrice / 1.5);
        autoBuyClickPowerPrice = Math.floor(autoBuyClickPowerPrice / 1.5);

        if (autoBuyCursorInterval) {
            clearInterval(autoBuyCursorInterval);
            autoBuyCursorInterval = null;
        }
        if (autoBuyClickPowerInterval) {
            clearInterval(autoBuyClickPowerInterval);
            autoBuyClickPowerInterval = null;
        }
        autoBuyCursor.style.display = "block";
        autoBuyClickPower.style.display = "block";
        saveGame();
    }
})

setInterval(() => {
    cookies += cursors
    cookieCounter.innerHTML = cookies
    saveGame();
}, 1000)

setInterval(() => {
    if (cookies >= cursorPrice) {
        cursorButton.classList.add("affordable");
    } else {
        cursorButton.classList.remove("affordable");
    }
    if (cookies >= clickPowerPrice) {
        clickPowerButton.classList.add("affordable");
    } else {
        clickPowerButton.classList.remove("affordable");
    }
    if (cookies >= rebirthPrice) {
        rebirth.classList.add("affordable");
    } else {
        rebirth.classList.remove("affordable");
    }
    if (autoBuyCursor.style.display !== "none") {
        if (cookies >= autoBuyCursorPrice) {
            autoBuyCursor.classList.add("affordable");
        } else {
            autoBuyCursor.classList.remove("affordable");
        }
    }
    if (autoBuyClickPower.style.display !== "none") {
        if (cookies >= autoBuyClickPowerPrice) {
            autoBuyClickPower.classList.add("affordable");
        } else {
            autoBuyClickPower.classList.remove("affordable");
        }
    }
}, 100)
