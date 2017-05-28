const slides = [
    {isCurrent: true,  name: "Pizza with fresh egg", src: "pizza_egg.jpg"},
    {isCurrent: false, name: "Mashroom pizza", src: "pizza_mashroom"},
    {isCurrent: false, name: "Pizza pepperoni", src: "pizza_pepperoni"},
    {isCurrent: false, name: "Pizza with fresh spinach", src: "pizza_spinach"}
]


/* nav */
function getElemY (query) {
    return window.pageYOffset + document.querySelector(query).getBoundingClientRect().top
}
function scrollToElem(elem, duration) {
    let $elem = document.querySelector(elem);
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
    $elem.focus();
    if (document.activeElement !== $elem) {
        $elem.setAttribute("tabindex", -1);
        $elem.focus();
    }
}
function scrollNavItems (e) {
    e.preventDefault();
    scrollToElem(e.target.getAttribute("href"), 1000);
}
function setSubNav (e) {
    /*
    var el = e.target.nextElementSibling;
    console.log(el === null);
    e.target.parentElement.classList.contains("relative") 
    */
    e.target.nextElementSibling === null
    ? subNav.classList.remove("on")
    : subNav.classList.add("on");
}
// navs: first level links only
const navs = document.querySelectorAll(".nav > ul > li > a");
const subNav = document.querySelector(".nav li.relative");
Array.from(navs).forEach((nav) => {
    nav.addEventListener("click", scrollNavItems);
    nav.addEventListener("focus", setSubNav);
});


/* slider */
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
        if(_currentIndex > 0) {
            (_currentIndex - 1) <= 0 ? _transformStyle = "translateX(0)" : _transformStyle = "translateX(-"+ (_currentIndex - 1) * 750 +"px)";
            sInner.style.transform = _transformStyle;
            setCurrentSliderIndex (_currentIndex - 1);
        }
    } 
    //check if current is not the last
    if (elem.id === "__next") {
        if (_currentIndex < (sLen - 1)) {
            sInner.style.transform = "translateX(-"+ (_currentIndex + 1) * 750 +"px)";
            setCurrentSliderIndex (_currentIndex + 1);
        }
    }
}
const prev = document.getElementById("__prev");
prev.addEventListener("click", setSlides);
prev.addEventListener("keyup", (e) => {
    if(e.keyCode === 32 || e.keyCode === 13) {
        setSlides(e);
    }
});
const next = document.getElementById("__next");
next.addEventListener("click", setSlides);
next.addEventListener("keyup", (e) => {
    if(e.keyCode === 32 || e.keyCode === 13) {
        setSlides(e);
    }
});


/* contact form */
const contact = document.getElementById("__contact");
contact.addEventListener("click", toggleDialog);
contact.addEventListener("keyup", (e) => {
    if(e.keyCode === 32 || e.keyCode === 13) {
        toggleDialog(e);
    }
});

function toggleDialog (e) {
    const contentWrapp = document.getElementById("__contntWrapp");
    dialog.classList.toggle("on");
    if (dialog.classList.contains("on")) {
        setTimeout(() => {
            dialog.setAttribute("tabindex", -1);
            dialog.focus();
        }, 800);
    }
}
const dialog = document.getElementById("dialog");
setTimeout(function () {
    dialog.classList.remove("off")
}, 800);
dialog.addEventListener("keyup", (e) => {
    if (e.keyCode === 27) toggleDialog(e);
});

const dialogClose = document.getElementById("__close");
dialogClose.addEventListener("click", toggleDialog);
dialogClose.addEventListener("keyup", (e) => {
    if(e.keyCode === 32 || e.keyCode === 13) {
        toggleDialog(e);
    }
});

const checkbox = document.getElementById("__checkbox");
checkbox.addEventListener("click", () => {
    checkbox.classList.toggle("on");
})

function validateForm (e) {
    e.preventDefault();
    let validationStatus = true;
    let reqs = dialog.querySelectorAll("input.required");
    reqs.forEach((req) => {
        console.log("loopings reqs. req.value:" + req.value);
        console.log(req);
        if (req.value !== "") {
            req.classList.remove("ivalid");
        } else {
            validationStatus = false;
            req.classList.add("invalid"); 
            req.focus();
        }
    });
    if (validationStatus) {
        toggleDialog();
        setTimeout(() => {
            e.target.reset();
            reqs.forEach((req) => req.classList.remove("invalid"));
            contact.focus();
            alert("Thank you")
        }, 600);
    }
}
const form = document.getElementById("__form");
form.addEventListener("submit", validateForm);

