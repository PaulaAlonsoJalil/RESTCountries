const btnDarkMode = document.querySelector("header button")
const body = document.querySelector("body")
const header = document.querySelector("header")
const nodoBtnGeneral = document.querySelectorAll('buttom')
const urlCountries = "https://restcountries.com/v3.1/" //the endpoint of the API RESTCountries
const main = document.querySelector('main')
const btnBack = document.querySelector("#back")
const qs = new URLSearchParams(location.search)

import * as modes from './modes.js';
import formatNumber from './formatNumber.js';

/* -------------------------------------------------------------------------- */
/*                   Logic applied to the country site                        */
/* -------------------------------------------------------------------------- */

// in case the dark mode or the light mode were alredy selected  
if (localStorage.getItem("darkModeOn") == "true") {
    modes.darkMode()
} else {
    modes.lightMode()
}

window.addEventListener("load", function () {

    //the function uses the nombrePaisBuscado constant the user entered on the index site
    if (qs.get("cca2") == null) {
        buscaPais(sessionStorage.getItem("nombrePaisBuscado"))
    } else {
        buscaPaisPorCca2(urlCountries, qs.get("cca2"))
    }
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

    btnBack.addEventListener('click', function () {
        location.href = "index.html"
    })
})

//the function fetchs the data of the country from the API and then
//calls the function to render the country on the screen
//After that, calls the function to search for the border countries.
function buscaPais(paisBuscado) {
    // fetch(`${url}/name/${paisBuscado}`)
    //     .then(function (respuesta) {
    //         return respuesta.json()
    //     })
    //     .then(function (data) {
    //         renderizarPais(data)
    //         buscarPaisesLimitrofes(url, data)
    //     })

    renderizarPais(JSON.parse(localStorage.allCountries).filter(obj => obj.name.common.includes(paisBuscado)))
    
}

function buscaPaisPorCca2(url, paisBuscado) {
    fetch(`${url}/alpha/${paisBuscado}`)
        .then(function (respuesta) {
            return respuesta.json()
        })
        .then(function (data) {
            renderizarPais(data)
            buscarPaisesLimitrofes(url, data)
        })
}

//This function renders the country on the screen using a template literal
function renderizarPais(pais) {
    main.innerHTML = ""
    main.innerHTML = `
        <section>
            <img src="${pais[0].flags.svg}" />
        </section>
        <section class="description">
            <h2>${pais[0].name.common}</h2>
            <div>
                <article>
                    <ul type="none">
                        <li><b>Official Name: </b>${pais[0].name.nativeName ? Object.values(pais[0].name.nativeName)[0].official : "-"}</li>
                        <li><b>Population: </b>${pais[0].population ? formatNumber(pais[0].population) : "-"}</li>
                        <li><b>Region: </b>${pais[0].region}</li>
                        <li><b>Sub Region: </b>${pais[0].subregion}</li>
                        <li><b>Capital: </b>${pais[0].capital ? pais[0].capital[0] : "-"}</li>
                    </ul>
                </article>
                <article>
                    <ul type="none">
                        <li><b>Top Level Domain: </b>${pais[0].tld[0]}</li>
                        <li><b>Currencies: </b>${pais[0].currencies ? Object.values(pais[0].currencies)[0].name : "-"}</li>
                        <li><b>Languages: </b>${pais[0].languages ? Object.values(pais[0].languages)[0] : "-"}</li>
                    </ul>
                </article>
            </div>
            <nav>
                <h4>Border Countries: </h4>
            </nav>
        </section>
        `
    const imagen = document.querySelector("img")
    imagen.style.backgroundColor = "transparent"
}

//this function searchs the border countries of the given country.
function buscarPaisesLimitrofes(url, pais) {
    let paises = [];
    paises = pais[0].borders;
    let paisesEnString = "";
    for (let i = 0; i < paises.length; i++) {
        if (i == paises.length - 1) {
            paisesEnString += paises[i]
        } else {
            paisesEnString += paises[i] + ","
        }
    }
    fetch(`${url}/alpha?codes=${paisesEnString}`)
        .then(function (respuesta) {
            return respuesta.json()
        })
        .then(function (data) {
            data.forEach(obj => renderizarPaisesLimitrofes(obj))

        })
}
//This function renders the border countries using a template string
function renderizarPaisesLimitrofes(pais) {

    const nav = document.querySelector("nav")

    nav.innerHTML += `
    <a href='country.html?cca2=${pais.cca2}'><button class="border-country">${pais.name.common}</button></a>
    `
}