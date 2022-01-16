const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];

function getAllStories(){
    fetch('http://127.0.0.1:8000/api/stories', {
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
                        `id: ${el.id}, data: ${el.data}, user: ${el.userID}`
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


function createStory(){ }
const content = document.querySelector("#content")
document.querySelector('#storySubmitButton').addEventListener('click', (e) => {
    e.preventDefault()
    console.log("klik")
    const imagelink = document.querySelector("#imageLinkInput").value
    fetch('http://127.0.0.1:8000/api/stories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({
            "username": localStorage.getItem('user'),
            "data": imagelink
        })
    })
        .then( res => res.json())
        .then( data => {
            if(!data.msg) {
                console.log(data)
                const li = document.createElement("li")
                const text = document.createTextNode(
                    `id: ${data.id}, data: ${data.data}, user: ${data.userID}`
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

document.querySelector("#storyEditButton").addEventListener('click', (e) => {
    e.preventDefault()
    const storyID = document.querySelector("#storyIdInputEdit").value
    const imageLink = document.querySelector("#imageLinkInputEdit").value
    fetch(`http://127.0.0.1:8000/api/stories/${storyID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({
            "data": imageLink
        })
    })
        .then( res => res.json())
        .then( data => {
            if(!data.msg) {
                content.innerHTML = ''
                document.querySelector("#storyIdInputEdit").value = ""
                document.querySelector("#imageLinkInputEdit").value = ""
                getAllStories()
            } else {
                const p = document.createElement('p')
                const statusContainer = document.querySelector("#status")
                p.innerHTML = `${data.msg}`
                statusContainer.appendChild(p)
            }
        })
})

document.querySelector("#deleteStoryButton").addEventListener('click', e => {
    e.preventDefault()
    const idValue = document.querySelector('#deleteStoryInput').value;

    fetch(`http://127.0.0.1:8000/api/stories/${idValue}`, {
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
                document.querySelector('#deleteStoryInput').value = "";
                getAllStories()
            } else {
                const p = document.createElement('p')
                const statusContainer = document.querySelector("#status")
                p.innerHTML = `${data.msg}`
                statusContainer.appendChild(p)
            }
        })


})
window.addEventListener('load', getAllStories);


