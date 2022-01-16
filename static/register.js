const handleRegister = (e) => {
    e.preventDefault()

    const username = document.querySelector('#usernameInput').value
    const password = document.querySelector('#passwordInput').value
    const password2 = document.querySelector('#passwordInput2').value

    console.log(username);
    console.log(password);

    fetch('http://127.0.0.1:9000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            password: password,
            admin: true,
        })
    })
        .then( res => res.json())
        .then( data => {
            if(!data.msg) {
                document.cookie = `token=${data.token};SameSiite=Lax`
                window.location.href = '/'
            } else { 
                const p = document.createElement('p')
                const statusContainer = document.querySelector("#status")
                console.log(data);
                p.innerHTML = `${data.msg}`
                statusContainer.appendChild(p)
            }
        }) 
}


const loginButton = document.querySelector("#registerButton")
loginButton.addEventListener('click', handleRegister)



