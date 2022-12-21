export const utilService = {
    saveToStorage,
    loadFromStorage,
    randomLocName,
    getFormattedTime,
    makeId
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

function randomLocName() {
    return gRandomLocNames[parseInt(Math.random() * gRandomLocNames.length)]
}

function getFormattedTime(timeStamp) {
    const createdTime = new Date(timeStamp)
    const year = createdTime.getFullYear()
    const month = (createdTime.getMonth() + 1)
    const date = createdTime.getDate()
    const hours = createdTime.getHours()
    const minutes = createdTime.getMinutes()
    return `Created at: ${year}-${month}-${date} ${hours}:${minutes}`
}


function makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}
