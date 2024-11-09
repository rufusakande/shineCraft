/**
 * Une animation sur la page catalogue dans la section tendance
 */

const tendance1 = document.getElementById("tendance1")

let bg = ["url(assets/images/bg4.webp)", "url(assets/images/bg5.webp)","url(assets/images/bgHeros3.webp)","url(assets/images/produits1.webp)","url(assets/images/produits2.webp)", "url(assets/images/produits3.webp)", "url(assets/images/produits4.webp)", "url(assets/images/bg1.webp)", "url(assets/images/produits5.webp)", "url(assets/images/bg3.webp)"]

let id = 0
let animation1 = setInterval(() =>{
    setTimeout(() =>{
        tendance1.style.backgroundImage = bg[id]
        tendance1.style.transition = 'all .8s'
        id++
        if (id == bg.length){
            id=0
        }
    }, 2000)
}, 2000)
