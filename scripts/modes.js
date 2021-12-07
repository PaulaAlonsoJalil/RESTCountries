//The dark mode and light mode functions paste the css for dark mode and light mode respectively.
export function darkMode() {
    sessionStorage.setItem("darkModeOn", true)
    document.querySelector("#styles").innerHTML = `
    <link href="css/dark-mode.css"  rel="stylesheet">
    `
}

export function lightMode() {
    sessionStorage.setItem("darkModeOn", false)
    document.querySelector("#styles").innerHTML = `
    <link href="css/light-mode.css"  rel="stylesheet">
    `
}