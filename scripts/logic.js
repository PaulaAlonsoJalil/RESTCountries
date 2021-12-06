const urlCountries = "https://restcountries.com/v3.1/"
const paisesMain = document.querySelector('section')
const formularioBusqueda = document.querySelector('form')
const nombrePais = document.querySelector('input')
const btnDarkMode = document.querySelector('button')
const body = document.querySelector("body")
const header = document.querySelector("header")
const list = document.querySelector("#list")

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

    window.addEventListener("scroll", function () {
        console.log("scroll")
    })

    list.addEventListener("change", function () {
        mostrarPaisesPorRegion(urlCountries, list.options[list.selectedIndex].text)
    })

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
//alpha?codes=de,us,br,is,ar,ax,al,dz,nz,aus
function mostrarPaisesInicio(url) {
    fetch(`${url}/all`)
        .then(function (respuesta) {
            return respuesta.json()
        })
        .then(function (data) {
            paisesMain.classList.remove('skeleton')
            console.log(data);
            renderizarPaisesInicio(data)
        })
}


function mostrarPaisesPorRegion(url, region) {
    fetch(`${url}/region/${region}`)
        .then(function (respuesta) {
            return respuesta.json()
        })
        .then(function (data) {
            paisesMain.classList.remove('skeleton')
            renderizarPaisesInicio(data)
        })
}

//This function is used to format the population number to add commas.
Number.prototype.format = function () {
    return this.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(",")
}

// this function renders the 10 countries I previously choose in the mostrarPaisesInicio
//function. It uses a template string.
function renderizarPaisesInicio(paises) {
    paisesMain.innerHTML = ""
    paises.forEach(pais => {
        paisesMain.innerHTML += `
        <article class="cards post">
            <img src="${pais.flags.png}"/>
            <a href='country.html?cca2=${pais.cca2}'><h3>${pais.name.common}</h3></a>
            <p>Population: <span class="population">${pais.population.format()}</span></p>
            <p>Region: <span>${pais.region}</span></p>
            <p>Capital: <span>${pais.capital ? pais.capital[0] : "-"}</span></p>
        </article>
        `}
    )
}

//The dark mode and light mode functions paste the css for dark mode and light mode respectively.
function darkMode() {
    sessionStorage.setItem("darkModeOn", true)
    document.querySelector("#styles").innerHTML = `
    <link href="css/dark-mode.css"  rel="stylesheet">
    `
}

function lightMode() {
    sessionStorage.setItem("darkModeOn", false)
    document.querySelector("#styles").innerHTML = `
    <link href="css/light-mode.css"  rel="stylesheet">
    `
}

function pagination() {
    let elem = document.querySelector('.container');
    let infScroll = new InfiniteScroll(elem, {
        // options
        path: '.pagination__next',
        append: '.post',
        history: false,
    });
}