const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];

function getAllPosts(){
    fetch('http://127.0.0.1:8000/api/posts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    })
        .then( res => res.json())
        .then( data => {
            if(!data.msg) {
                console.log(data)
                data.forEach( el => {
                    const li = document.createElement("li")
                    const text = document.createTextNode(
                        `id: ${el.id}, data: ${el.data}, user: ${el.userID}, image: ${el.image}, lkes: ${el.likeCount}`
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

document.querySelector('#postSubmitButton').addEventListener('click', (e) => {
    e.preventDefault()
    const data = document.querySelector("#descriptionInput").value
    const imagelink = document.querySelector("#imageLinkInput").value
    let tagsInput = document.querySelector("#tagsInput").value
    tagsInput = tagsInput.split(" ")
    fetch('http://127.0.0.1:8000/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({
            "userID": localStorage.getItem('user'),
            "data": data,
            "image": imagelink,
            "tags": tagsInput
        })
    })
        .then( res => res.json())
        .then( data => {
            if(!data.msg) {
                const li = document.createElement("li")
                const text = document.createTextNode(
                    `id: ${data.id}, data: ${data.data}, user: ${data.userID}, image: ${data.image}, lkes: ${data.likeCount}`
                )
                li.appendChild(text)
                content.appendChild(li)
            } else {
                const p = document.createElement('p')
                const statusContainer = document.querySelector("#status")
                p.innerHTML = `${data.msg}`
                statusContainer.appendChild(p)
            }
        })
})

document.querySelector("#postEditButton").addEventListener('click', (e) => {
    e.preventDefault()
    const postID = document.querySelector("#idInputEdit").value
    const descriptionInputEdit = document.querySelector("#descriptionInputEdit").value
    const imageLinkInputEdit = document.querySelector("#imageLinkInputEdit").value
    let tagsInputEdit = document.querySelector("#tagsInputEdit").value
    tagsInputEdit = tagsInputEdit.split(" ")
    fetch(`http://127.0.0.1:8000/api/posts/${postID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({
            "data": descriptionInputEdit,
            "image": imageLinkInputEdit,
            "tags" : tagsInputEdit
        })
    })
        .then( res => res.json())
        .then( data => {
            if(!data.msg) {
                content.innerHTML = ''
                document.querySelector("#idInputEdit").value = ""
                document.querySelector("#descriptionInputEdit").value = ""
                document.querySelector("#imageLinkInputEdit").value = ""
                document.querySelector("#tagsInputEdit").value = ""
                getAllPosts()
            } else {
                const p = document.createElement('p')
                const statusContainer = document.querySelector("#status")
                p.innerHTML = `${data.msg}`
                statusContainer.appendChild(p)
            }
        })
})

document.querySelector("#deletePostButton").addEventListener('click', e => {
    e.preventDefault()
    const idValue = document.querySelector('#deletePostInput').value;

    fetch(`http://127.0.0.1:8000/api/posts/${idValue}`, {
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
                document.querySelector('#deletePostInput').value = "";
                getAllPosts()
            } else {
                const p = document.createElement('p')
                const statusContainer = document.querySelector("#status")
                p.innerHTML = `${data.msg}`
                statusContainer.appendChild(p)
            }
        })


})
window.addEventListener('load', getAllPosts);


