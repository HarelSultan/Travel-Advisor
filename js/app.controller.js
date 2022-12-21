import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { placeService } from './services/place.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onSearch = onSearch
window.onUserLocation = onUserLocation
window.onDeleteLocation = onDeleteLocation

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
            addMapListeners()
        })
        .catch(() => console.log('Error: cannot init map'))
    renderLocations()
    panMapByQueryStringParams()
}

function addMapListeners() {
    const map = mapService.getMap()
    map.addListener("click", (mapsMouseEvent) => onMapClick(map, mapsMouseEvent))
}

function onMapClick(map, mapsMouseEvent) {
    mapService.setMapClickCords(mapsMouseEvent)
}

function renderLocations() {
    placeService.query()
        .then(locations => {
            const strHTMLs = locations.map(location => `
    <tr>
         <td>${location.name}</td>
         <td>${location.createdAt}</td>
         <td>
             <button onclick="onPanTo(${location.lat}, ${location.lng})" class="go-btn">Go</button>
             <button onclick="onDeleteLocation('${location.id}')" class="btn-delete">Delete</button>
         </td>
     </tr>    
    `)
            document.querySelector('.saved-locations-table').innerHTML = strHTMLs.join('')
            return locations
        }).then(locations => locations.map(location => mapService.addMarker({ lat: location.lat, lng: location.lng })))
}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    const latLng = mapService.getCurrClickedCords()
    mapService.addMarker(latLng)
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            onPanTo(pos.coords.latitude, pos.coords.longitude)
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo(lat, lng) {
    console.log('lat, lng:', lat, lng)
    mapService.panTo(lat, lng)
    const queryStringParams = `?lat=${lat}&lng=${lng}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onSearch(ev, elForm) {
    ev.preventDefault()
    const elSearchInput = elForm.querySelector('.search-input')
    mapService.searchLocation(elSearchInput.value)
        .then((res) => res.results)
        .then(data => {

            console.log('data:', data)
            const latLng = {
                lat: data[0].geometry.location.lat(),
                lng: data[0].geometry.location.lng()
            }
            console.log('latLng,:', latLng, elSearchInput.value)
            placeService.save(latLng, elSearchInput.value)
                .then(() => renderLocations())
        })

}


// mapService.searchLocation(elSearchInput.value)



function onUserLocation() {

}

function onDeleteLocation(locationId) {
    placeService.remove(locationId)
        .then(() => renderLocations())
}

function panMapByQueryStringParams() {

}