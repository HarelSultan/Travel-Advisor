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

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap)
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
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
        gMap.setCenter(results[0].geometry.location)
        let marker = new google.maps.Marker({
            map: gMap,
            position: results[0].geometry.location
        })
        let cords = {
            lat: marker.position.lat(),
            lng: marker.position.lng()
        }
        // console.log('cords:', cords)
        // console.log('adress:', address)
        // const searchedLocation = placeService.save(cords, address)
        // console.log('searchedLocation:', searchedLocation)
        // return searchedLocation
        // return placeService.save(cords, locationName)
    })
}
