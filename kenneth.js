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

// 1. Load data variables immediately so they are available globally
let cookies = localStorage.getItem("cookies") ? parseInt(localStorage.getItem("cookies")) : 0;
let cursors = localStorage.getItem("cursors") ? parseInt(localStorage.getItem("cursors")) : 0;
let cursorPrice = localStorage.getItem("cursorPrice") ? parseInt(localStorage.getItem("cursorPrice")) : 10;
let clickPowerPrice = localStorage.getItem("clickPowerPrice") ? parseInt(localStorage.getItem("clickPowerPrice")) : 50;
let clickPower = localStorage.getItem("clickPower") ? parseInt(localStorage.getItem("clickPower")) : 3;
let rebirthPrice = localStorage.getItem("rebirthPrice") ? parseInt(localStorage.getItem("rebirthPrice")) : 5000;
let autoBuyCursorPrice = localStorage.getItem("autoBuyCursorPrice") ? parseInt(localStorage.getItem("autoBuyCursorPrice")) : 500;
let autoBuyClickPowerPrice = localStorage.getItem("autoBuyClickPowerPrice") ? parseInt(localStorage.getItem("autoBuyClickPowerPrice")) : 2500;
let autoBuyIsTrue = false;

let autoBuyCursorInterval = null;
let autoBuyClickPowerInterval = null;

let autoBuyCursorUnlocked = localStorage.getItem("autoBuyCursorUnlocked") === "true";
let autoBuyClickPowerUnlocked = localStorage.getItem("autoBuyClickPowerUnlocked") === "true";


function saveGame() {
    localStorage.setItem("cookies", cookies);
    localStorage.setItem("totalCookies", cookies); 
    localStorage.setItem("cursors", cursors);
    localStorage.setItem("cursorPrice", cursorPrice);
    localStorage.setItem("clickPowerPrice", clickPowerPrice);
    localStorage.setItem("clickPower", clickPower);
    localStorage.setItem("rebirthPrice", rebirthPrice);
    localStorage.setItem("autoBuyCursorPrice", autoBuyCursorPrice);
    localStorage.setItem("autoBuyClickPowerPrice", autoBuyClickPowerPrice);
    localStorage.setItem("autoBuyCursorUnlocked", autoBuyCursorUnlocked);
    localStorage.setItem("autoBuyClickPowerUnlocked", autoBuyClickPowerUnlocked);
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
        if (cookieCounter) cookieCounter.innerHTML = formatNumber(cookies);
        if (cursorCounter) cursorCounter.innerHTML = formatNumber(cursors);
        if (clickPowerCounter) clickPowerCounter.innerHTML = formatNumber(clickPower);
        if (cursorPriceText) cursorPriceText.innerHTML = formatNumber(cursorPrice);
        if (clickPowerPriceText) clickPowerPriceText.innerHTML = formatNumber(clickPowerPrice);
        if (rebirthPriceText) rebirthPriceText.innerHTML = formatNumber(rebirthPrice);
    }
    updateDisplay();

    // Primary Click Button Logic
    if (cookieImage) {
        cookieImage.addEventListener('click', (ev) => {
            cookies += clickPower;
            if (cookieCounter) cookieCounter.innerHTML = formatNumber(cookies);
            saveGame();
        });
    }

    // Upgrade Cursor Shop Button Logic
    if (cursorButton) {
        cursorButton.addEventListener('click', (ev) => {
            if (cookies >= cursorPrice) {
                cookies -= cursorPrice;
                cursors += 1;
                saveGame();
                updateDisplay();
            }
        });
    }

          // Auto-Buy Cursors Setup
    if (autoBuyCursor) {
        autoBuyCursor.addEventListener('click', () => {
            if (cookies >= autoBuyCursorPrice) {
                cookies -= autoBuyCursorPrice;
                autoBuyCursor.style.display = "none"; 
                autoBuyCursorUnlocked = true;
                
                if (autoBuyCursorInterval) clearInterval(autoBuyCursorInterval);
                autoBuyCursorInterval = setInterval(() => {
                    if (autoBuyToggle && autoBuyToggle.value === "On") {
                        if (cookies >= cursorPrice) {
                            cookies -= cursorPrice;
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
            if (cookies >= clickPowerPrice) {
                cookies -= clickPowerPrice;
                clickPower += 1;
                clickPowerPrice = Math.floor(clickPowerPrice * 1.1);
                saveGame();
                updateDisplay();
            }
        });
    }

    // Auto-Buy Click Power Setup
        // Auto-Buy Click Power Setup
    if (autoBuyClickPower) {
        autoBuyClickPower.addEventListener('click', () => {
            // Check if player can afford the UNLOCK itself
            if (cookies >= autoBuyClickPowerPrice) {
                cookies -= autoBuyClickPowerPrice;
                autoBuyClickPower.style.display = "none"; // Hide the buy button forever
                autoBuyClickPowerUnlocked = true;
                // Clear any old intervals just in case
                if (autoBuyClickPowerInterval) clearInterval(autoBuyClickPowerInterval);
                
                // Start the background interval loop (runs every 100ms)
                autoBuyClickPowerInterval = setInterval(() => {
                    // CRUCIAL FIX: Look at the dropdown value dynamically right now!
                    if (autoBuyToggle && autoBuyToggle.value === "On") {
                        if (cookies >= clickPowerPrice) {
                            cookies -= clickPowerPrice;
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
            if (cookies >= rebirthPrice) {
                cookies = 0;
                cursors = 0;
                clickPower = clickPower * 2;
                cursorPrice = 10;
                clickPowerPrice = 50;
                rebirthPrice = Math.floor(rebirthPrice * 2);
                autoBuyCursorPrice = Math.floor(autoBuyCursorPrice / 1.5);
                autoBuyClickPowerPrice = Math.floor(autoBuyClickPowerPrice / 1.5);
                autoBuyCursorUnlocked = false;
                autoBuyClickPowerUnlocked = false;

                if (autoBuyCursorInterval) {
                    clearInterval(autoBuyCursorInterval);
                    autoBuyCursorInterval = null;
                }
                if (autoBuyClickPowerInterval) {
                    clearInterval(autoBuyClickPowerInterval);
                    autoBuyClickPowerInterval = null;
                }
                if (autoBuyCursor) autoBuyCursor.style.display = "block";
                if (autoBuyClickPower) autoBuyClickPower.style.display = "block";
                
                saveGame();
                updateDisplay();
            }
        });
    }


    // Reset Progress Button Logic
    if (resetButton) {
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
                autoBuyCursorUnlocked = false;
                autoBuyClickPowerUnlocked = false;
                if (autoBuyCursorInterval) {
                    clearInterval(autoBuyCursorInterval);
                    autoBuyCursorInterval = null;
                }
                if (autoBuyClickPowerInterval) {
                    clearInterval(autoBuyClickPowerInterval);
                    autoBuyClickPowerInterval = null;
                }
                if (autoBuyCursor) autoBuyCursor.style.display = "block";
                if (autoBuyClickPower) autoBuyClickPower.style.display = "block";
                
                saveGame();
                updateDisplay();
            }
        });
    }

    // Passive generation tracking loop (Adds automated cursor clicks every second)
    setInterval(() => {
        cookies += cursors;
        saveGame();
        updateDisplay();
    }, 1000);

    // Active button affordable style updating loop
    setInterval(() => {
        if (cursorButton) {
            if (cookies >= cursorPrice) {
                cursorButton.classList.add("affordable");
            } else {
                cursorButton.classList.remove("affordable");
            }
        }
        if (clickPowerButton) {
            if (cookies >= clickPowerPrice) {
clickPowerButton.classList.add("affordable");} else {clickPowerButton.classList.remove("affordable");}}}, 100);});
    // --- RESTORE AUTO-BUY LOOPS ON PAGE LOAD ---
    if (autoBuyCursorUnlocked) {
        if (autoBuyCursor) autoBuyCursor.style.display = "none";
        autoBuyCursorInterval = setInterval(() => {
            if (autoBuyToggle && autoBuyToggle.value === "On") {
                if (cookies >= cursorPrice) {
                    cookies -= cursorPrice;
                    cursors += 1;
                    cursorPrice = Math.floor(cursorPrice * 1.25);
                    saveGame();
                    updateDisplay();
                }
            }
        }, 100);
    }

     // --- RESTORE AUTO-BUY LOOPS ON PAGE LOAD ---
    // Added safety check: Only run loops if the variables are true AND the buttons are hidden
    if (autoBuyCursorUnlocked) {
        if (autoBuyCursor) autoBuyCursor.style.display = "none";
        
        if (autoBuyCursorInterval) clearInterval(autoBuyCursorInterval);
        autoBuyCursorInterval = setInterval(() => {
            if (autoBuyToggle && autoBuyToggle.value === "On") {
                if (cookies >= cursorPrice) {
                    cookies -= cursorPrice;
                    cursors += 1;
                    cursorPrice = Math.floor(cursorPrice * 1.25);
                    saveGame();
                    updateDisplay();
                }
            }
        }, 100);
    }

    if (autoBuyClickPowerUnlocked) {
        if (autoBuyClickPower) autoBuyClickPower.style.display = "none";
        
        if (autoBuyClickPowerInterval) clearInterval(autoBuyClickPowerInterval);
        autoBuyClickPowerInterval = setInterval(() => {
            if (autoBuyToggle && autoBuyToggle.value === "On") {
                if (cookies >= clickPowerPrice) {
                    cookies -= clickPowerPrice;
                    clickPower += 1;
                    clickPowerPrice = Math.floor(clickPowerPrice * 1.1);
                    saveGame();
                    updateDisplay();
                }
            }
        }, 100);
    }
