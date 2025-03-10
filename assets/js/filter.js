/**
 *
 * Ce code permet de faire le filtrage sur la page catalogue dans la section top vendu lorsqu'on clique sur tout, bracelet, ....
 *
 */
// Récuperation du select
const selectFilter = document.getElementById('filtre')
const allFilter =document.querySelector('.allFilter')
const braceletsFilter =document.querySelector('.braceletsFilter')
const colliersFilter =document.querySelector('.colliersFilter')
const baguesFilter =document.querySelector('.baguesFilter')

const allFilterDiv =document.getElementById('allFilterDiv')
const braceletsFilterDiv =document.getElementById('braceletsFilterDiv')
const colliersFilterDiv =document.getElementById('colliersFilterDiv')
const baguesFilterDiv =document.getElementById('baguesFilterDiv')

braceletsFilterDiv.style.display='none'
colliersFilterDiv.style.display='none'
baguesFilterDiv.style.display='none'

braceletsFilter.addEventListener("click", ()=>{
    allFilterDiv.style.display='none'
    braceletsFilterDiv.style.display='flex'
    colliersFilterDiv.style.display='none'
    baguesFilterDiv.style.display='none'
    allFilter.removeAttribute("class", "active")
    colliersFilter.removeAttribute("class", "active")
    baguesFilter.removeAttribute("class", "active")
    braceletsFilter.setAttribute("class", "active")
})

colliersFilter.addEventListener("click", ()=>{
    allFilterDiv.style.display='none'
    braceletsFilterDiv.style.display='none'
    colliersFilterDiv.style.display='flex'
    baguesFilterDiv.style.display='none'
    allFilter.removeAttribute("class", "active")
    colliersFilter.setAttribute("class", "active")
    baguesFilter.removeAttribute("class", "active")
    braceletsFilter.removeAttribute("class", "active")
})

baguesFilter.addEventListener("click", ()=>{
    allFilterDiv.style.display='none'
    braceletsFilterDiv.style.display='none'
    colliersFilterDiv.style.display='none'
    baguesFilterDiv.style.display='flex'
    allFilter.removeAttribute("class", "active")
    colliersFilter.removeAttribute("class", "active")
    baguesFilter.setAttribute("class", "active")
    braceletsFilter.removeAttribute("class", "active")
})

allFilter.addEventListener("click", ()=>{
    allFilterDiv.style.display='flex'
    braceletsFilterDiv.style.display='none'
    colliersFilterDiv.style.display='none'
    baguesFilterDiv.style.display='none'
    allFilter.setAttribute("class", "active")
    colliersFilter.removeAttribute("class", "active")
    baguesFilter.removeAttribute("class", "active")
    braceletsFilter.removeAttribute("class", "active")
})


selectFilter.addEventListener('change', (e) =>{
    if ( e.target.value === "allFilter" ){
        allFilterDiv.style.display='flex'
        braceletsFilterDiv.style.display='none'
        colliersFilterDiv.style.display='none'
        baguesFilterDiv.style.display='none'
    } else{
        if ( e.target.value === "colliersFilter" ){
            allFilterDiv.style.display='none'
            braceletsFilterDiv.style.display='none'
            colliersFilterDiv.style.display='flex'
            baguesFilterDiv.style.display='none'
        } else {
            if ( e.target.value === "braceletsFilter" ){
                allFilterDiv.style.display='none'
                braceletsFilterDiv.style.display='flex'
                colliersFilterDiv.style.display='none'
                baguesFilterDiv.style.display='none'
            } else {
                if ( e.target.value === "baguesFilter" ){
                    allFilterDiv.style.display='none'
                    braceletsFilterDiv.style.display='none'
                    colliersFilterDiv.style.display='none'
                    baguesFilterDiv.style.display='flex'
                } 
            }
        }
    }
})