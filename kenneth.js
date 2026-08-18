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

// 1. UNIQUE STORAGE KEYS FOR KENNETH (Isolated from cookies & vladis)
let kennies = localStorage.getItem("kenneth_kennies") ? parseInt(localStorage.getItem("kenneth_kennies")) : 0;
let cursors = localStorage.getItem("kenneth_cursors") ? parseInt(localStorage.getItem("kenneth_cursors")) : 0;
let cursorPrice = localStorage.getItem("kenneth_cursorPrice") ? parseInt(localStorage.getItem("kenneth_cursorPrice")) : 10;
let clickPowerPrice = localStorage.getItem("kenneth_clickPowerPrice") ? parseInt(localStorage.getItem("kenneth_clickPowerPrice")) : 50;
let clickPower = localStorage.getItem("kenneth_clickPower") ? parseInt(localStorage.getItem("kenneth_clickPower")) : 1;
let rebirthPrice = localStorage.getItem("kenneth_rebirthPrice") ? parseInt(localStorage.getItem("kenneth_rebirthPrice")) : 5000;
let autoBuyCursorPrice = localStorage.getItem("kenneth_autoBuyCursorPrice") ? parseInt(localStorage.getItem("kenneth_autoBuyCursorPrice")) : 500;
let autoBuyClickPowerPrice = localStorage.getItem("kenneth_autoBuyClickPowerPrice") ? parseInt(localStorage.getItem("kenneth_autoBuyClickPowerPrice")) : 2500;
let autoBuyIsTrue = false;

let autoBuyCursorInterval = null;
let autoBuyClickPowerInterval = null;

let autoBuyCursorUnlocked = localStorage.getItem("kenneth_autoBuyCursorUnlocked") === "true";
let autoBuyClickPowerUnlocked = localStorage.getItem("kenneth_autoBuyClickPowerUnlocked") === "true";


function saveGame() {
    localStorage.setItem("kenneth_kennies", kennies);
    localStorage.setItem("kenneth_cursors", cursors);
    localStorage.setItem("kenneth_cursorPrice", cursorPrice);
    localStorage.setItem("kenneth_clickPowerPrice", clickPowerPrice);
    localStorage.setItem("kenneth_clickPower", clickPower);
    localStorage.setItem("kenneth_rebirthPrice", rebirthPrice);
    localStorage.setItem("kenneth_autoBuyCursorPrice", autoBuyCursorPrice);
    localStorage.setItem("kenneth_autoBuyClickPowerPrice", autoBuyClickPowerPrice);
    localStorage.setItem("kenneth_autoBuyCursorUnlocked", autoBuyCursorUnlocked);
    localStorage.setItem("kenneth_autoBuyClickPowerUnlocked", autoBuyClickPowerUnlocked);

    // Sync cumulative score for index.html leaderboard requirements
    const amiraliCookies = parseInt(localStorage.getItem("cookies")) || 0; 
    const vladaVladis = parseInt(localStorage.getItem("vlada_vladis")) || 0;
    localStorage.setItem("totalCookies", amiraliCookies + kennies + vladaVladis);
}


// 2. WAIT for the HTML document structure to map out fully before finding elements
document.addEventListener("DOMContentLoaded", () => {
    
    // Map layout DOM elements safely
    const autoBuyToggle = document.getElementById("autoBuyDropdown");
    const rebirthPriceText = document.getElementById("rebirthPrice");
    const clickPowerPriceText = document.getElementById("clickPowerPrice");
    const clickPowerButton = document.getElementById("clickPowerButton");
    const clickPowerCounter = document.getElementById("clickPowerCounter");
    const autoBuyClickPower = document.getElementById("autoBuyClickPower");
    const cookieCounter = document.getElementById("counter");
    const cookieImage = document.getElementById("mainbutton");
    const cursorPriceText = document.getElementById("cursorPrice");
    const cursorButton = document.getElementById("cursorButton");
    const cursorCounter = document.getElementById("cursorCounter");
    const autoBuyCursor = document.getElementById("autoBuyCursor");
    const resetButton = document.getElementById("resetButton");
    const rebirthButton = document.getElementById("rebirth");

    function updateDisplay() {
        if (cookieCounter) cookieCounter.innerHTML = formatNumber(kennies);
        if (cursorCounter) cursorCounter.innerHTML = formatNumber(cursors);
        if (clickPowerCounter) clickPowerCounter.innerHTML = formatNumber(clickPower);
        if (cursorPriceText) cursorPriceText.innerHTML = formatNumber(cursorPrice);
        if (clickPowerPriceText) clickPowerPriceText.innerHTML = formatNumber(clickPowerPrice);
        if (rebirthPriceText) rebirthPriceText.innerHTML = formatNumber(rebirthPrice);
    }
    updateDisplay();

    // Restore Auto-Buy Cursors Loop on Reload
    if (autoBuyCursorUnlocked) {
        if (autoBuyCursor) autoBuyCursor.style.display = "none";
        if (autoBuyCursorInterval) clearInterval(autoBuyCursorInterval);
        autoBuyCursorInterval = setInterval(() => {
            if (autoBuyToggle && autoBuyToggle.value === "On") {
                if (kennies >= cursorPrice) {
                    kennies -= cursorPrice;
                    cursors += 1;
                    cursorPrice = Math.floor(cursorPrice * 1.25);
                    saveGame();
                    updateDisplay();
                }
            }
        }, 100);
    }

    // Restore Auto-Buy Click Power Loop on Reload
    if (autoBuyClickPowerUnlocked) {
        if (autoBuyClickPower) autoBuyClickPower.style.display = "none";
        if (autoBuyClickPowerInterval) clearInterval(autoBuyClickPowerInterval);
        autoBuyClickPowerInterval = setInterval(() => {
            if (autoBuyToggle && autoBuyToggle.value === "On") {
                if (kennies >= clickPowerPrice) {
                    kennies -= clickPowerPrice;
                    clickPower += 1;
                    clickPowerPrice = Math.floor(clickPowerPrice * 1.1);
                    saveGame();
                    updateDisplay();
                }
            }
        }, 100);
    }

    // Primary Click Button Logic
    if (cookieImage) {
        cookieImage.addEventListener('click', (ev) => {
            kennies += clickPower;
            if (cookieCounter) cookieCounter.innerHTML = formatNumber(kennies);
            saveGame();
        });
    }

    // Upgrade Cursor Shop Button Logic
    if (cursorButton) {
        cursorButton.addEventListener('click', (ev) => {
            if (kennies >= cursorPrice) {
                kennies -= cursorPrice;
                cursors += 1;
                saveGame();
                updateDisplay();
            }
        });
    }

    // Auto-Buy Cursors Setup
    if (autoBuyCursor) {
        autoBuyCursor.addEventListener('click', () => {
            if (kennies >= autoBuyCursorPrice) {
                kennies -= autoBuyCursorPrice;
                autoBuyCursor.style.display = "none"; 
                autoBuyCursorUnlocked = true;
                
                if (autoBuyCursorInterval) clearInterval(autoBuyCursorInterval);
                autoBuyCursorInterval = setInterval(() => {
                    if (autoBuyToggle && autoBuyToggle.value === "On") {
                        if (kennies >= cursorPrice) {
                            kennies -= cursorPrice;
                            cursors += 1;
                            cursorPrice = Math.floor(cursorPrice * 1.25);
                            saveGame();
                            updateDisplay();
                        }
                    }
                }, 100);

                saveGame();
                updateDisplay();
            }
        });
    }

    // Upgrade Click Power Logic
    if (clickPowerButton) {
        clickPowerButton.addEventListener('click', (ev) => {
            if (kennies >= clickPowerPrice) {
                kennies -= clickPowerPrice;
                clickPower += 1;
                clickPowerPrice = Math.floor(clickPowerPrice * 1.1);
                saveGame();
                updateDisplay();
            }
        });
    }

    // Auto-Buy Click Power Setup
    if (autoBuyClickPower) {
        autoBuyClickPower.addEventListener('click', () => {
            if (kennies >= autoBuyClickPowerPrice) {
                kennies -= autoBuyClickPowerPrice;
                autoBuyClickPower.style.display = "none"; 
                autoBuyClickPowerUnlocked = true;
                
                if (autoBuyClickPowerInterval) clearInterval(autoBuyClickPowerInterval);
                autoBuyClickPowerInterval = setInterval(() => {
                    if (autoBuyToggle && autoBuyToggle.value === "On") {
                        if (kennies >= clickPowerPrice) {
                            kennies -= clickPowerPrice;
                            clickPower += 1;
                            clickPowerPrice = Math.floor(clickPowerPrice * 1.1);
                            saveGame();
                            updateDisplay();
                        }
                    }
                }, 100);

                saveGame();
                updateDisplay();
            }
        });
    }

    // Rebirth Processing Logic
    if (rebirthButton) {
        rebirthButton.addEventListener('click', (ev) => {
            if (kennies >= rebirthPrice) {
                kennies = 0;
                cursors = 0;
                clickPower = clickPower * 2;
                cursorPrice = 10;
                clickPowerPrice = 50;
                rebirthPrice = Math.floor(rebirthPrice * 2);
                autoBuyCursorPrice = Math.floor(autoBuyCursorPrice / 1.5);
                autoBuyClickPowerPrice = Math.floor(autoBuyClickPowerPrice / 1.5);
                
                autoBuyCursorUnlocked = false;
                autoBuyClickPowerUnlocked = false;


            if (autoBuyCursorInterval) {clearInterval(autoBuyCursorInterval);autoBuyCursorInterval = null;}if (autoBuyClickPowerInterval) {clearInterval(autoBuyClickPowerInterval);autoBuyClickPowerInterval = null;}if (autoBuyCursor) autoBuyCursor.style.display = "block";if (autoBuyClickPower) autoBuyClickPower.style.display = "block";saveGame();updateDisplay();}});}// Reset Progress Button Logicif (resetButton) {resetButton.addEventListener('click', () => {if (confirm("Are you sure you want to completely reset your Kenneth progress?")) {kennies = 0;cursors = 0;cursorPrice = 10;clickPowerPrice = 50;clickPower = 1;rebirthPrice = 5000;autoBuyCursorPrice = 500;autoBuyClickPowerPrice = 2500;autoBuyCursorUnlocked = false;autoBuyClickPowerUnlocked = false;if (autoBuyCursorInterval) {clearInterval(autoBuyCursorInterval);autoBuyCursorInterval = null;}if (autoBuyClickPowerInterval) {clearInterval(autoBuyClickPowerInterval);autoBuyClickPowerInterval = null;}if (autoBuyCursor) autoBuyCursor.style.display = "block";if (autoBuyClickPower) autoBuyClickPower.style.display = "block";saveGame();updateDisplay();}});}// Passive generation tracking loop (Adds automated cursor clicks every second)
    setInterval(() => {kennies += cursors;saveGame();updateDisplay();}, 1000);// Active button affordable style updating loop
    setInterval(() => {if (cursorButton) {if (kennies >= cursorPrice) {cursorButton.classList.add("affordable");} else {cursorButton.classList.remove("affordable");}}if (clickPowerButton) {if (kennies >= clickPowerPrice) {clickPowerButton.classList.add("affordable");} else {clickPowerButton.classList.remove("affordable");}}}, 100);});
