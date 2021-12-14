if (localStorage.getItem("allCountries")) {
    console.log("true")
} else {
    guardarPaises(urlCountries)
}