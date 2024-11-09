const menuOuvrant = document.getElementById("menuOuvrant")
const nav = document.querySelector("nav")
const section = document.querySelector("section")
const main = document.querySelector("main")

if(window.screenX < 850) {
    menuOuvrant.addEventListener('click', () =>{
        if (nav.style.left != '-200%') {
            nav.style.left = '-200%'
            section.style.width = '100%'
            main.style.transition = 'all 1s'
        } else{
            nav.style.left = '0%'
            section.style.width = 'calc(100% - 250px)'
            main.style.transition = 'all 1s'
        }
    })
}