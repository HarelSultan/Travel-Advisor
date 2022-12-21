import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onSearch = onSearch
window.onUserLocation = onUserLocation

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
            addMapListeners()
        })
        .catch(() => console.log('Error: cannot init map'))
}

function addMapListeners() {
    const map = mapService.getMap()
    map.addListener("click", (mapsMouseEvent) => onMapClick(map, mapsMouseEvent))
}

function onMapClick(map, mapsMouseEvent) {
    let infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
    })
    infoWindow.setContent(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    )
    infoWindow.open(map)
    const clickedCords = {
        lat: mapsMouseEvent.latLng.lat(),
        lng: mapsMouseEvent.latLng.lng()
    }
    mapService.setMapClickCords(clickedCords)
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
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo() {
    console.log('Panning the Map')
    mapService.panTo(35.6895, 139.6917)
}

function onSearch() {

}

function onUserLocation() {

}