let cookies = 0;
let cursors = 0;
let cursorPrice = 10;
let clickPowerPrice = 50;
let clickPower = 1;
let rebirthPrice = 5000;
let autoBuyCursorPrice = 500;
let autoBuyClickPowerPrice = 2500;

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

cookieImage.addEventListener('click', (ev) => {
    cookies += clickPower;
    cookieCounter.innerHTML = cookies
})
cursorButton.addEventListener('click', (ev) => {
    if (cookies >= cursorPrice) {
        cookies -= cursorPrice;
        cursors += 1
        cursorCounter.innerHTML = cursors
        cookieCounter.innerHTML = cookies
        cursorPrice = Math.floor(cursorPrice * 1.25)
        cursorPriceText.innerHTML = cursorPrice
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
        }
    }, 100)
}

rebirth.addEventListener('click', (ev) => {
    if (cookies >= rebirthPrice) {
        cookies -= rebirthPrice;
        cursors = 0
        clickPower = 1
        cursorCounter.innerHTML = 0
        clickPowerCounter.innerHTML = 1
        cookieCounter.innerHTML = 0
        rebirthPrice = Math.floor(rebirthPrice * 2)
        rebirthPriceText.innerHTML = rebirthPrice
        cursorPrice = Math.floor(10 / 1.5);
        clickPowerPrice = Math.floor(50 / 1.5);
        autoBuyCursorPrice = Math.floor(autoBuyCursorPrice / 1.5);
        autoBuyClickPowerPrice = Math.floor(autoBuyClickPowerPrice / 1.5);
        clickPowerPriceText.innerHTML = clickPowerPrice
        cursorPriceText.innerHTML = cursorPrice
    }
})

setInterval(() => {
    cookies += cursors
    cookieCounter.innerHTML = cookies
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
