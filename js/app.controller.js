import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { placeService } from './services/place.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onSearch = onSearch
window.onUserLocation = onUserLocation
window.onDeleteLocation = onDeleteLocation
window.onCopyUrl = onCopyUrl

function onInit() {
    mapService.initMap()
        .then(() => {
            addMapListeners()
            panMapByQueryStringParams()
            renderLocations()
        })
        .catch(() => console.log('Error: cannot init map'))
}

function addMapListeners() {
    const map = mapService.getMap()
    map.addListener("dblclick", (mapsMouseEvent) => onMapClick(map, mapsMouseEvent))
}

function onMapClick(map, mapsMouseEvent) {
    mapService.setMapClickCords(mapsMouseEvent)
    document.querySelector('.add-location-container').style.display = 'flex'
}

function renderLocations() {
    placeService.query()
        .then(locations => {
            const strHTMLs = locations.map(location => `
    <tr>
         <td>${location.name}</td>
         <td>${location.createdAt}</td>
         <td>
             <button onclick="onPanTo(${location.lat}, ${location.lng})" class="go-btn action-btn">Go</button>
             <button onclick="onDeleteLocation('${location.id}')" class="btn-delete action-btn">Delete</button>
         </td>
     </tr>    
    `)
            document.querySelector('.saved-locations-table').innerHTML = strHTMLs.join('')
            return locations
        }).then(locations => locations.map(location => mapService.addMarker({ lat: location.lat, lng: location.lng })))
}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    const latLng = mapService.getCurrClickedCords()
    mapService.addMarker(latLng)
    onPanTo(latLng.lat, latLng.lng)
    const elAddLocationContainer = document.querySelector('.add-location-container')
    const elLocationNameInput = elAddLocationContainer.querySelector('.location-name-input')
    elAddLocationContainer.style.display = 'none'
    placeService.save(latLng, elLocationNameInput.value)
        .then(() => renderLocations())
    elLocationNameInput.value = ''
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}

function onUserLocation() {
    getPosition()
        .then(pos => {
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            onPanTo(pos.coords.latitude, pos.coords.longitude)
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo(lat, lng) {
    mapService.panTo(lat, lng)
    onRenderWeather(lat, lng)
    const queryStringParams = `?lat=${lat}&lng=${lng}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onRenderWeather(lat, lng) {
    placeService.getLocationWeather(lat, lng)
        .then(data => {
            const strHTMLs =
                `
                <h3 class="weather-header">Weather Today</h3>
                 <span class="weather-icon">🌧️</span>
                 <div class="weather-location-container"> 
                 <span class="weather-location">${data.city}, ${data.country}</span>
                 <span class="weather-desc">${data.desc}</span>
                 </div>
                 <span class="curr-temp">${data.temp}</span>
                 <span class="min-max-temp">From: ${data.minTemp}
                  To: ${data.maxTemp}℃, Wind: ${data.wind}ms</span>
                  `
            document.querySelector('.weather-container').innerHTML = strHTMLs
            document.querySelector('.current-location').innerText = `${data.city}, ${data.country}`
        })
}

function onSearch(ev, elForm) {
    ev.preventDefault()
    const elSearchInput = elForm.querySelector('.search-input')
    mapService.searchLocation(elSearchInput.value)
        .then((res) => res.results)
        .then(data => {
            const latLng = {
                lat: data[0].geometry.location.lat(),
                lng: data[0].geometry.location.lng()
            }
            onPanTo(latLng.lat, latLng.lng)
            mapService.addMarker(latLng)
            placeService.save(latLng, elSearchInput.value)
                .then(() => renderLocations())
        })
}

function onDeleteLocation(locationId) {
    placeService.remove(locationId)
        .then(() => renderLocations())
}

function panMapByQueryStringParams() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    })
    const lat = params.lat || 32.794046
    const lng = params.lng || 34.989571
    onPanTo(lat, lng)
}

function onCopyUrl() {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    document.querySelector('.')
}