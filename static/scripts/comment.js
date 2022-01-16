const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];

function getAllComments(){
    fetch('http://127.0.0.1:8000/api/comments', {
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
                        `id: ${el.id}, data: ${el.data}, user: ${el.userID}, postID: ${el.postID}`
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

document.querySelector('#commentSubmitButton').addEventListener('click', (e) => {
    e.preventDefault()
    const contentInput = document.querySelector("#contentInput").value
    const postIdInput = document.querySelector("#postIdInput").value
    fetch('http://127.0.0.1:8000/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({
            "userID": localStorage.getItem('user'),
            "data": contentInput,
            "postID": postIdInput
        })
    })
        .then( res => res.json())
        .then( data => {
            if(!data.msg) {
                const li = document.createElement("li")
                const text = document.createTextNode(
                    `id: ${data.id}, data: ${data.data}, user: ${data.userID}, postID: ${data.postID}`
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

document.querySelector("#editCommentButton").addEventListener('click', (e) => {
    e.preventDefault()

    const commentIdInput = document.querySelector("#commentIdInput").value
    const bodyInput = document.querySelector("#bodyInput").value
    fetch(`http://127.0.0.1:8000/api/comments/${commentIdInput}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({
            "data": bodyInput,
        })
    })
        .then( res => res.json())
        .then( data => {
            if(!data.msg) {
                content.innerHTML = ''
                document.querySelector("#commentIdInput").value = ""
                document.querySelector("#bodyInput").value = ""
                getAllComments()
            } else {
                const p = document.createElement('p')
                const statusContainer = document.querySelector("#status")
                p.innerHTML = `${data.msg}`
                statusContainer.appendChild(p)
            }
        })
})

document.querySelector("#deleteCommentButton").addEventListener('click', e => {
    e.preventDefault()
    const idValue = document.querySelector('#deleteCommentInput').value;

    fetch(`http://127.0.0.1:8000/api/comments/${idValue}`, {
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
                document.querySelector('#deleteCommentInput').value = "";
                getAllComments()
            } else {
                const p = document.createElement('p')
                const statusContainer = document.querySelector("#status")
                p.innerHTML = `${data.msg}`
                statusContainer.appendChild(p)
            }
        })


})
window.addEventListener('load', getAllComments);


