const urlCountries = "https://restcountries.com/v3.1/"
const paisesMain = document.querySelector('section')
const formularioBusqueda = document.querySelector('form')
const nombrePais = document.querySelector('input')
const btnDarkMode = document.querySelector('button')
const btnShowAll = document.querySelector('#show-all')
const list = document.querySelector("#list")

import * as modes from './modes.js'
import formatNumber from './formatNumber.js';

/* -------------------------------------------------------------------------- */
/*                   Logic applied to the main site                           */
/* -------------------------------------------------------------------------- */

// in case the dark mode or the light mode were alredy selected  
if (localStorage.getItem("darkModeOn") == "true") {
    modes.darkMode()
} else {
    modes.lightMode()
}

window.addEventListener("load", function () {
    if (!localStorage.allCountries) {
        guardarPaises(urlCountries)
    } 
    mostrarPaisesInicio(urlCountries)

    list.addEventListener("change", function () {
        if (list.options[list.selectedIndex].text == "Filter by Region") {
            mostrarPaisesInicio(urlCountries)
        } else {
            renderizarPaisesInicio(JSON.parse(localStorage.getItem(`${list.options[list.selectedIndex].text}Region`)))
        }
    })
    

    //Logic applied to the "shearch country" input
    //keeps the country the user entered to the field in the constant nombrePaisBuscado
    //then keeps it in the localStorage and redirects to the country site.
    formularioBusqueda.addEventListener('submit', function (e) {
        e.preventDefault()
        const nombrePaisBuscado = nombrePais.value;
        sessionStorage.setItem("nombrePaisBuscado", nombrePaisBuscado)
        location.href = "country.html"
        formularioBusqueda.reset()
    })

    //logic applied to the dark mode button.
    //it will check if there is a value set in the local storage. 
    //in case there isn't or it's false, it will turn on the dark mode
    btnDarkMode.addEventListener('click', function () {
        if ((localStorage.getItem("darkModeOn")) != "true") {
            modes.darkMode()
        } else {
            modes.lightMode()
        }
    })

})
/* -------------------------------------------------------------------------- */
/*                              functions in use                              */
/* -------------------------------------------------------------------------- */

//this function shows 10 countries of my choice in the main site. 
//The function fetch the data from the API and then uses 
//the renderizarPaisesInicio function to show the countries
//alpha?codes=de,us,br,is,ar,ax,al,dz,nz,aus
function mostrarPaisesInicio(url) {
    fetch(`${url}/alpha?codes=de,us,br,is,ar,ax,al,dz,nz,aus`)
        .then(function (respuesta) {
            return respuesta.json()
        })
        .then(function (data) {
            paisesMain.classList.remove('skeleton')
            renderizarPaisesInicio(data)
        })
}


// this function renders the 10 countries I previously choose in the mostrarPaisesInicio
//function. It uses a template string.
function renderizarPaisesInicio(paises) {
    paisesMain.innerHTML = ""
    paises.forEach(pais => {
        paisesMain.innerHTML += `
        <article class="cards post">
            <a href='country.html?cca2=${pais.cca2}'><img src="${pais.flags.png}"/></a>
            <a href='country.html?cca2=${pais.cca2}'><h3>${pais.name.common}</h3></a>
            <p>Population: <span class="population">${formatNumber(pais.population)}</span></p>
            <p>Region: <span>${pais.region}</span></p>
            <p>Capital: <span>${pais.capital ? pais.capital[0] : "-"}</span></p>
        </article>
        `}
    )
}

async function guardarPaises(url) {
    const respuesta = await fetch(`${url}/all`)
    const data = await respuesta.json()
    const allCountries = data
    localStorage.setItem("allCountries", JSON.stringify(data));
    localStorage.setItem("AmericasRegion", JSON.stringify(allCountries.filter(obj => obj.region == "Americas")))
    localStorage.setItem("EuropeRegion", JSON.stringify(allCountries.filter(obj => obj.region == "Europe")))
    localStorage.setItem("AfricaRegion", JSON.stringify(allCountries.filter(obj => obj.region == "Africa")))
    localStorage.setItem("AsiaRegion", JSON.stringify(allCountries.filter(obj => obj.region == "Asia")))
    localStorage.setItem("OceaniaRegion", JSON.stringify(allCountries.filter(obj => obj.region == "Oceania")))
    localStorage.setItem("AntarcticRegion", JSON.stringify(allCountries.filter(obj => obj.region == "Antarctic")))
}
