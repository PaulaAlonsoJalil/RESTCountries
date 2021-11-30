const btnDarkMode = document.querySelector("header button")
const body = document.querySelector("body")
const header = document.querySelector("header")
const nodoBtnGeneral = document.querySelectorAll('buttom')
const urlCountries = "https://restcountries.com/v3.1/" //the endpoint of the API RESTCountries
const main = document.querySelector('main')
const btnBack = document.querySelector("#back")

/* -------------------------------------------------------------------------- */
/*                   Logic applied to the country site                        */
/* -------------------------------------------------------------------------- */

// in case the dark mode or the light mode were alredy selected  
if (sessionStorage.getItem("darkModeOn") == "true") {
    darkMode()
} else {
    lightMode()
}

window.addEventListener("load", function () {

    //the function uses the nombrePaisBuscado constant the user entered on the index site
    buscaPais(urlCountries, sessionStorage.getItem("nombrePaisBuscado"))

    //logic applied to the dark mode button.
    //it will check if there is a value set in the session storage. 
    //in case there isn't or it's false, it will turn on the dark mode
    btnDarkMode.addEventListener('click', function () {
        if ((sessionStorage.getItem("darkModeOn")) != "true") {
            darkMode()
        } else {
            lightMode()
        }
    })

    btnBack.addEventListener('click', function () {
        location.href = "index.html"
    })
})

//The dark mode and light mode functions paste the basic required information in the <head> tag 
//along with the css for dark mode and light mode respectively.
function darkMode() {
    sessionStorage.setItem("darkModeOn", true)
    document.head.innerHTML = `
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300&display=swap" rel="stylesheet">
    <link href="css/country.css" rel="stylesheet">
    <link href="css/dark-mode.css"  rel="stylesheet">
    <title>Document</title>
    `
}

function lightMode() {
    sessionStorage.setItem("darkModeOn", false)
    document.head.innerHTML = `
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300&display=swap" rel="stylesheet">
    <link href="css/country.css" rel="stylesheet">
    <link href="css/light-mode.css" rel="stylesheet">
    <title>Document</title>
    `
}

//the function fetchs the data of the country from the API and then
//calls the function to render the country on the screen
//After that, calls the function to search for the border countries.
function buscaPais(url, paisBuscado) {
    fetch(`${url}/name/${paisBuscado}?fullText=true`)
        .then(function (respuesta) {
            return respuesta.json()
        })
        .then(function (data) {
            data.reverse()
            renderizarPais(data)
            buscarPaisesLimitrofes(url, data)
        })
}

//This function is used to format the population number to add commas.
Number.prototype.format = function () {
    return this.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(",");
};

//This function renders the country on the screen using a template string
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
                        <li><b>Official Name: </b>${Object.values(pais[0].name.nativeName)[0].official}</li>
                        <li><b>Population: </b>${pais[0].population.format()}</li>
                        <li><b>Region: </b>${pais[0].region}</li>
                        <li><b>Sub Region: </b>${pais[0].subregion}</li>
                        <li><b>Capital: </b>${pais[0].capital[0]}</li>
                    </ul>
                </article>
                <article>
                    <ul type="none">
                        <li><b>Top Level Domain: </b>${pais[0].tld[0]}</li>
                        <li><b>Currencies: </b>${Object.values(pais[0].currencies)[0].name}</li>
                        <li><b>Languages: </b>${Object.values(pais[0].languages)[0]}</li>
                    </ul>
                </article>
            </div>
            <nav>
                <h4>Border Countries: </h4>
            </nav>
        </section>
        `

}

//this function searchs the border countries of the given country. It fetchs the 
//dara from the API
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
    <button>${pais.name.common}</button>
    `
}