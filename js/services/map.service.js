import { placeService } from './place.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getMap,
    setMapClickCords,
    getCurrClickedCords,
    searchLocation
}

// Var that is used throughout this Module (not global)
var gMap
var gCurrClickedCords
let gInfoWindow

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    gInfoWindow.close(gMap)
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyAcjXTTXy043pbUfqVSumxPaJ12ezYQYDw' //DONE: Enter your API Key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function getMap() {
    return gMap
}

function setMapClickCords(mapsMouseEvent) {
    const clickedCords = {
        lat: mapsMouseEvent.latLng.lat(),
        lng: mapsMouseEvent.latLng.lng()
    }

    gInfoWindow = new google.maps.InfoWindow({
        content: `Position: ${clickedCords.lat}, ${clickedCords.lng}`,
        position: { lat: clickedCords.lat, lng: clickedCords.lng }
    })
    gInfoWindow.open(gMap)
    gCurrClickedCords = clickedCords
}

function getCurrClickedCords() {
    return gCurrClickedCords
}

function searchLocation(locationName) {
    var address = locationName
    let geocoder = new google.maps.Geocoder()
    return geocoder.geocode({ 'address': address }, function (results, status) {
        if (status !== 'OK') return
    })
}
