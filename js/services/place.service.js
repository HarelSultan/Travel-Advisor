import { storageService } from './async-storage.service.js'
import { utilService } from './utils.service.js'

const LOC_KEY = 'locationDB'
_createLocs()

export const placeService = {
    query,
    remove,
    save
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




