import { storageService } from './async-storage.service.js'
import { utilService } from './utils.service.js'

const LOC_KEY = 'locationDB'
_createLocs()

export const placeService = {
    query,
    remove,
    save,
    getLocationWeather
}

function query() {
    return storageService.query(LOC_KEY)
        .then(locations => locations)
}

function remove(locId) {
    return storageService.remove(LOC_KEY, locId)
}

function save(loc, address) {
    return storageService.post(LOC_KEY, _createLoc(loc, address))
}

function getLocationWeather(lat, lng) {
    const API_KEY = '2bdf8c292393ad6b23f528ec35cf59ef'
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`
    return fetch(url).then((res) => res.json())
        .then(data => {
            return {
                country: data.sys.country,
                city: data.name,
                temp: parseInt(data.main.temp - 273.15),
                minTemp: parseInt(data.main.temp_min - 273.15),
                maxTemp: parseInt(data.main.temp_max - 273.15),
                desc: data.weather[0].description,
                wind: data.wind.speed
            }
        })
}

function _createLocs() {
    let locations = utilService.loadFromStorage(LOC_KEY)
    if (!locations || !locations.length) {
        _createDemoLocs()
    }
}

function _createDemoLocs() {
    const randomLocNames = ['Haifa', 'Natanya', 'Paris']
    const randomLocCords = [{ lat: 32.794046, lng: 34.989571 }, { lat: 32.321458, lng: 34.853196 }, { lat: 48.856614, lng: 2.352222 }]
    const locations = randomLocNames.map((locName, i) => _createLoc(randomLocCords[i], locName))
    utilService.saveToStorage(LOC_KEY, locations)
}

function _createLoc({ lat, lng }, name) {
    const location = {
        id: utilService.makeId(),
        name,
        lat,
        lng,
        createdAt: utilService.getFormattedTime(Date.now())
    }
    return location
}
