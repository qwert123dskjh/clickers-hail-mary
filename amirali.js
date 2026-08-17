function saveGame() {
    localStorage.setItem("cookies", cookies);
    localStorage.setItem("totalCookies", cookies); // Added: Updates the index.html planet locker
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
        clickPower = 3;
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
    cookieCounter.innerHTML = formatNumber(cookies); // Added formatNumber for scannability
    saveGame();
});

cursorButton.addEventListener('click', (ev) => {
    if (cookies >= cursorPrice) {
        cookies -= cursorPrice;
        cursors += 1;
        cursorCounter.innerHTML = cursors;
        cookieCounter.innerHTML = formatNumber(cookies);
        cursorPrice = Math.floor(cursorPrice * 1.25);
        cursorPriceText.innerHTML = formatNumber(cursorPrice);
        saveGame();
    }
});

autoBuyCursor.addEventListener('click', autoBuyCursor_funcCheck);

function autoBuyCursor_funcCheck() {
    if (cookies >= autoBuyCursorPrice) {
        cookies -= autoBuyCursorPrice;
        autoBuyCursor_func();
    }
}

let autoBuyCursorInterval = null;
function autoBuyCursor_func() {
    autoBuyCursor.style.display = "none";
    if (autoBuyCursorInterval) clearInterval(autoBuyCursorInterval);
    autoBuyCursorInterval = setInterval(() => {
        if (cookies >= cursorPrice) {
            cookies -= cursorPrice;
            cursors += 1;
            cursorCounter.innerHTML = cursors;
            cookieCounter.innerHTML = formatNumber(cookies);
            cursorPrice = Math.floor(cursorPrice * 1.25);
            cursorPriceText.innerHTML = formatNumber(cursorPrice);
            saveGame();
        }
    }, 100);
    if (autoBuyToggle.value == "On") {
        autoBuyIsTrue = true;
    } else {
        autoBuyIsTrue = false;
    }
}

clickPowerButton.addEventListener('click', (ev) => {
    if (cookies >= clickPowerPrice) {
        cookies -= clickPowerPrice;
        clickPower += 1;
        clickPowerCounter.innerHTML = clickPower;
        cookieCounter.innerHTML = formatNumber(cookies);
        clickPowerPrice = Math.floor(clickPowerPrice * 1.1);
        clickPowerPriceText.innerHTML = formatNumber(clickPowerPrice);
        saveGame();
    }
});

autoBuyClickPower.addEventListener('click', autoBuyClickPower_funcCheck);

function autoBuyClickPower_funcCheck() {
    if (cookies >= autoBuyClickPowerPrice) {
        cookies -= autoBuyClickPowerPrice;
        autoBuyClickPower_func();
    }
}

let autoBuyClickPowerInterval = null;
function autoBuyClickPower_func() {
    autoBuyClickPower.style.display = "none";
    if (autoBuyClickPowerInterval) clearInterval(autoBuyClickPowerInterval);
    autoBuyClickPowerInterval = setInterval(() => {
        if (cookies >= clickPowerPrice) {
            cookies -= clickPowerPrice;
            clickPower += 1;
            clickPowerCounter.innerHTML = clickPower;
            cookieCounter.innerHTML = formatNumber(cookies);
            clickPowerPrice = Math.floor(clickPowerPrice * 1.1);
            clickPowerPriceText.innerHTML = formatNumber(clickPowerPrice);
            saveGame();
        }
    }, 100);
}

rebirth.addEventListener('click', (ev) => {
    if (cookies >= rebirthPrice) {
        cookies -= rebirthPrice;
        cursors = 0;
        clickPower = 1;
        
        cursorPrice = 10;
        clickPowerPrice = 50;
        
        cookieCounter.innerHTML = formatNumber(cookies);
        cursorCounter.innerHTML = cursors;
        clickPowerCounter.innerHTML = clickPower;
        cursorPriceText.innerHTML = formatNumber(cursorPrice);
        clickPowerPriceText.innerHTML = formatNumber(clickPowerPrice);
        
        rebirthPrice = Math.floor(rebirthPrice * 2);
        rebirthPriceText.innerHTML = formatNumber(rebirthPrice);
        
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
});

// Passive generation loop (Saves to storage every single second now!)
setInterval(() => {
    cookies += cursors;
    cookieCounter.innerHTML = formatNumber(cookies);
    saveGame(); 
}, 1000);

// Fixed your cut-off code snippet from the bottom of your prompt
setInterval(() => {
    if (cookies >= cursorPrice) {
        cursorButton.classList.add("affordable");
    } else {
        cursorButton.classList.remove("affordable");
    }
    
    // Optional extension: Add affordable class for click power button
    if (cookies >= clickPowerPrice) {
        clickPowerButton.classList.add("affordable");
    } else {
        clickPowerButton.classList.remove("affordable");
    }
}, 100);
