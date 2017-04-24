const slides = [
    {isCurrent: true,  name: "Pizza with fresh egg", src: "pizza_egg.jpg"},
    {isCurrent: false, name: "Mashroom pizza", src: "pizza_mashroom"},
    {isCurrent: false, name: "Pizza pepperoni", src: "pizza_pepperoni"},
    {isCurrent: false, name: "Pizza with fresh spinach", src: "pizza_spinach"}
]

function toggleDialog (e) {
    dialog.classList.toggle("on");
}

function setSlides (e) {
    const getCurrentSlidesIndex = function (obj) {
        return obj.isCurrent === true;
    }
    const setCurrentSliderIndex = function (i) {
        slides.forEach((slide, n) => {
            n === i ? slide.isCurrent = true : slide.isCurrent = false; 
        });
    }
    const sLen = slides.length;
    const sInner = document.getElementById("__sInner");
    let elem = e.target,
        _transformStyle,
        _currentIndex = slides.findIndex(getCurrentSlidesIndex),
        _src = slides[_currentIndex].src;

    //check if current is not the first 
    if (elem.id === "__prev") {
        console.log("prev, currentIndex: " + (_currentIndex - 1) + ", slidens length: " + sLen);
        if(_currentIndex > 0) {
            (_currentIndex - 1) <= 0 ? _transformStyle = "translateX(0)" : _transformStyle = "translateX(-"+ (_currentIndex - 1) * 750 +"px)";
            sInner.style.transform = _transformStyle;
            setCurrentSliderIndex (_currentIndex - 1);
        }
    } 
    //check if current is not the last
    if (elem.id === "__next") {
        console.log("next, currentIndex: " + _currentIndex + ", slidens length: " + sLen);
        if (_currentIndex < (sLen - 1)) {
            sInner.style.transform = "translateX(-"+ (_currentIndex + 1) * 750 +"px)";
            setCurrentSliderIndex (_currentIndex + 1);
        }
    }
}

const dialog = document.getElementById("dialog");
setTimeout(function () {
    dialog.classList.remove("off")
}, 800);
dialog.addEventListener("keyup", (e) => {
    if (e.keyCode === 27) toggleDialog(e);
});
const contact = document.getElementById("__contact");
const dialogClose = document.getElementById("__close");
contact.addEventListener("click", toggleDialog);
dialogClose.addEventListener("click", toggleDialog);

const prev = document.getElementById("__prev");
prev.addEventListener("click", setSlides);
const next = document.getElementById("__next");
next.addEventListener("click", setSlides);

const checkbox = document.getElementById("__checkbox");
checkbox.addEventListener("click", () => {
    checkbox.classList.toggle("on");
})

function validateForm (e) {
    e.preventDefault();
    let validationStatus = true;
    dialog.querySelectorAll("input.required").forEach((req) => {
        console.log(req);
        if (req.value === "") {
            req.classList.add("invalid"); 
            validationStatus = false;
        } else {
            req.classList.remove("ivalid");
        }
    });
    if (validationStatus) {
        toggleDialog();
        setTimeout(() => {
            e.target.reset();
            contact.focus();
            alert("Thank you")
        }, 600);
        
    }
}
const form = document.getElementById("__form");
form.addEventListener("submit", validateForm);


function getElemY (query) {
    return window.pageYOffset + document.querySelector(query).getBoundingClientRect().top
}
function doScrolling(elem, duration) {
    console.log(elem);
	let startingY = window.pageYOffset;
    let elemY = getElemY(elem);
    let targetY = document.body.scrollHeight - elemY < window.innerHeight ? document.body.scrollHeight - window.innerHeight : elemY;
	let diff = targetY - startingY;
    let easing = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 };
    let start;
    
    if (!diff) return;
    window.requestAnimationFrame(function step(timestamp) {
        if (!start) start = timestamp;
        let time = timestamp - start;
        let percent = Math.min(time / duration, 1);
        percent = easing(percent);
        window.scrollTo(0, startingY + diff * percent);
        if (time < duration) {
            window.requestAnimationFrame(step)
        }
    });
    history.pushState({}, document.title , elem);
}


function scrollNavItems (e) {
    e.preventDefault();
    doScrolling(e.target.getAttribute("href"), 1000);
}
const navs = document.querySelectorAll(".nav a");
Array.from(navs).forEach((nav) => {
    nav.addEventListener("click", scrollNavItems);
});