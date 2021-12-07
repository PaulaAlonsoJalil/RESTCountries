//This function is used to format the population number to add commas.
export default function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
