const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];

function getAllUsers(){
    fetch('http://127.0.0.1:8000/api/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    })
        .then( res => res.json())
        .then( data => {
            if(!data.msg) {
                data.forEach( el => {

                    const li = document.createElement("li")
                    const text = document.createTextNode(
                        `id: ${el.username}, bio: ${el.bio}, profile picture: ${el.profilePicture}, admin: ${el.admin}`
                    )
                    li.appendChild(text)
                    content.appendChild(li)
                })
            } else {
                const p = document.createElement('p')
                const statusContainer = document.querySelector("#status")
                p.innerHTML = `${data.msg}`
                statusContainer.appendChild(p)
            }
        })
}

const content = document.querySelector("#content")

document.querySelector("#userEditButton").addEventListener('click', (e) => {
    e.preventDefault()


    const bioInputEdit = document.querySelector("#bioInputEdit").value
    const profilePictureInputEdit = document.querySelector("#profilePictureInputEdit").value
    fetch(`http://127.0.0.1:8000/api/users/${localStorage.getItem('user')}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({
            "bio": bioInputEdit,
            "profilePicture": profilePictureInputEdit
        })
    })
        .then( res => res.json())
        .then( data => {
            if(!data.msg) {
                content.innerHTML = ''
                document.querySelector("#bioInputEdit").value = ""
                document.querySelector("#profilePictureInputEdit").value = ""
                getAllUsers()
            } else {
                const p = document.createElement('p')
                const statusContainer = document.querySelector("#status")
                p.innerHTML = `${data.msg}`
                statusContainer.appendChild(p)
            }
        })
})

document.querySelector("#deleteUserButton").addEventListener('click', e => {
    e.preventDefault()
    const username = document.querySelector('#username').value;

    fetch(`http://127.0.0.1:8000/api/users/${username}`, {
        method: 'Delete',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    })
        .then( res => res.json())
        .then( data => {
            if(!data.msg) {
                content.innerHTML = ''
                document.querySelector('#username').value = "";
                getAllUsers()
            } else {
                const p = document.createElement('p')
                const statusContainer = document.querySelector("#status")
                p.innerHTML = `${data.msg}`
                statusContainer.appendChild(p)
            }
        })


})
window.addEventListener('load', getAllUsers);


