// const LAUNCH_DATETIME = "2021/06/13 15:10:30"
var launchDatetime
var interval

window.onload = function () {
    setLaunchTime()
    interval = setInterval(() => { updateTime() }, 1000)
}

//  setcountdown to end 1 hour from load time
function setLaunchTime () {
    launchDatetime = new Date()
    launchDatetime.setTime(launchDatetime.getTime() + (1 * 60 * 60 * 1000))
}

//  update countdown every second
function updateTime (isInit = false) {
    let doClear = false
    let launch = new Date(launchDatetime)
    let now = new Date()

    //  if countdown has not ended
    if (launch > now) {
        let diffInSeconds = Math.floor(Math.abs((now - launch) / 1000
        ))

        let days = Math.floor(diffInSeconds / 86400)
        setCardContent(0, days, "day")

        diffInSeconds -= (days * 86400) //minus days

        let hours = Math.floor(diffInSeconds / 3600) % 24
        setCardContent(1, hours, "hour")

        diffInSeconds -= (hours * 3600) //minus hours

        let minutes = Math.floor(diffInSeconds / 60) % 60
        setCardContent(2, minutes, "minute")

        diffInSeconds -= minutes * 60   //minus seconds

        let seconds = Math.floor(diffInSeconds % 60)
        setCardContent(3, seconds, "second")

        if (isInit)
            setTimerAlert(`${appendSToEnd(days, "day")} ${appendSToEnd(hours, "hour")} ${appendSToEnd(minutes, "minute")} ${appendSToEnd(seconds, "second")}`)
    }
    else
        doClear = true

    if (doClear && interval !== null) {
        let timerCards = document.getElementsByClassName("timer__cards")[0]
        timerCards.classList.add("launched")
        let title = document.getElementsByClassName("title")[0]
        title.textContent = "We're launched!"   //  display launched message
        setTimerAlert("We are launched!")
        clearInterval(interval) //  stop countdown interval when ended
    }
}

//  append zero digit if time value is one digit
//  e.g. add 0 to 9 = 09
function appendZero (value) {
    return (value < 10 ? "0" : "") + value
}

//  add flip animation class
function createAnimatedFlip (flip) {
    let animatedFlip = flip.cloneNode(true) //  clone time value card (to be flipped)
    animatedFlip.classList.add("flip")

    return animatedFlip
}

//  set current time on card
function setCardContent (ind, newValue, type) {
    newValue = appendZero(newValue)
    let timerCard = document.getElementsByClassName("timer__card")[ind]

    let timerValues = timerCard.querySelectorAll(".timer__value")
    let currentValue = timerCard.textContent

    let timePassed = Math.abs(parseInt(newValue) - parseInt(currentValue))

    //  check if current time value is different from prev value
    //  if different value, animate flip
    //  e.g. flip if prev hour value is 09 and current hour value is 10
    //  e.g. no flip if both prev hour value and current value is 09
    if (timePassed > 0) {
        let animatedFlip = createAnimatedFlip(timerCard.children[0])
        animatedFlip.addEventListener("animationend", () => {
            timerValues[1].textContent = newValue
            timerCard.removeChild(animatedFlip) //  remove flipped/cloned card

            //  accessible alert when day/hour/min value updates
            //  no alert when every second updates
            if (type !== "second")
                setTimerAlert(`${appendSToEnd(timePassed, type)} has passed!`)
        })

        timerCard.appendChild(animatedFlip)
        timerValues[0].textContent = newValue
    }
}

//  append s to time value if plural
function appendSToEnd (value, type) {
    return `${value} ${type}${value > 1 ? 's' : ''}`
}

//  accessible alert countdown updates
function setTimerAlert (text) {
    let alert = document.getElementsByClassName("timer__alert")[0]
    alert.textContent = text
}