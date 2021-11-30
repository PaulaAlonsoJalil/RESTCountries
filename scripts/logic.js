

const urlCountries = "https://restcountries.com/v3.1/"
const paisesMain = document.querySelector('section')
const formularioBusqueda = document.querySelector('form')
const nombrePais = document.querySelector('input')
const btnDarkMode = document.querySelector('button')
const body = document.querySelector("body")
const header = document.querySelector("header")

/* -------------------------------------------------------------------------- */
/*                   Logic applied to the main site                           */
/* -------------------------------------------------------------------------- */

// in case the dark mode or the light mode were alredy selected  
if (sessionStorage.getItem("darkModeOn") == "true") {
    darkMode()
} else {
    lightMode()
}

window.addEventListener("load", function () {
    mostrarPaisesInicio(urlCountries)


    //Logic applied to the "shearch country" input
    //keeps the country the user entered to the field in the constant nombrePaisBuscado
    //then keeps it in the sessionStorage and redirects to the country site.
    formularioBusqueda.addEventListener('submit', function (e) {
        e.preventDefault()
        const nombrePaisBuscado = nombrePais.value;
        sessionStorage.setItem("nombrePaisBuscado", nombrePaisBuscado)
        location.href = "country.html"
        formularioBusqueda.reset()
    })

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

})

//this function shows 10 countries of my choice in the main site. 
//The function fetch the data from the API and then uses 
//the renderizarPaisesInicio function to show the countries
function mostrarPaisesInicio(url) {
    fetch(`${url}/alpha?codes=de,us,br,is,ar,ax,al,dz,nz,aus`)
        .then(function (respuesta) {
            return respuesta.json()
        })
        .then(function (data) {
            data.reverse()
            console.log(data)
            paisesMain.classList.remove('skeleton')
            renderizarPaisesInicio(data)
        })
}

//This function is used to format the population number to add commas.
Number.prototype.format = function () {
    return this.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(",");
};

// this function renders the 10 countries I previously choose in the mostrarPaisesInicio
//function. It uses a template string.
function renderizarPaisesInicio(paises) {
    paisesMain.innerHTML = ""
    paises.forEach(pais => {
        paisesMain.innerHTML += `
        <article class="cards">
            <img src="${pais.flags.png}"/>
            <h3>${pais.name.common}</h3>
            <p>Population: <span  class="population">${pais.population.format()}</span></p>
            <p>Region: <span>${pais.region}</span></p>
            <p>Capital: <span>${pais.capital[0]}</span></p>
        </article>
        `
    });

}

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
    <link href="css/main.css" rel="stylesheet">
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
    <link href="css/main.css" rel="stylesheet">
    <link href="css/light-mode.css" rel="stylesheet">
    <title>Document</title>
    `
}