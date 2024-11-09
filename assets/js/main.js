/**
 * Code pour le menu déroulant
 */

const menuOuvrant = document.getElementById("menuOuvrant")
const menuFermant = document.getElementById("menuFermant")
const menu = document.getElementById("menu")

function afficherMenu () {
    menuOuvrant.style.display = 'none'
    menuFermant.style.display = 'block'
    menu.style.top = '96px'
    menu.style.zIndex = '1'
    menu.style.transition = 'all 1s'
}

function masquerMenu () {
    menuOuvrant.style.display = 'block'
    menuFermant.style.display = 'none'
    menu.style.top = '-100px'
    menu.style.zIndex = '-2'
    menu.style.transition = 'all 1s'
}

menuOuvrant.addEventListener('click', afficherMenu)
menuFermant.addEventListener('click', masquerMenu)

/**
 * Code pour le back to top
 */

/**
const backToTop = document.getElementsByClassName('backToTop')

let height = 1000

if (window.scrollY > height){
    backToTop.style.display = 'block'
    backToTop.style.transition = 'all .8s'
} else {
    backToTop.style.display = 'none'
    backToTop.style.transition = 'all .8s'
}

*/