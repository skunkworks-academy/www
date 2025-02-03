function setCookie(name, value, daysToLive) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToLive * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

function getCookie(name) {
    const cDecoded = decodeURIComponent(document.cookie);
    const cArray = cDecoded.split("; ");
    for (let cookie of cArray) {
        let [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

// Test the functions
setCookie("firstName", "SpongeBob", 365);
setCookie("lastName", "SquarePants", 365);

console.log(document.cookie); // Logs cookies as a string

console.log(getCookie("firstName")); // Logs "SpongeBob"

deleteCookie("firstName");
console.log(document.cookie); // Check if "firstName" is deleted
