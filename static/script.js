
const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];

function handleLogout(e){
    console.log("hej")
    document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = '/login.html'
}

const logoutButton = document.querySelector("#logoutButton")
console.log(logoutButton)



logoutButton.addEventListener("click", handleLogout)


