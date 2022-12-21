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

function save(loc) {
    return storageService.post(LOC_KEY, _createLoc(loc))
}

function _createLocs() {
    let locations = utilService.loadFromStorage(LOC_KEY)
    if (!locations || !locations.length) {
        _createDemoLocs()
    }
}

function _createDemoLocs() {
    const randomLocNames = ['Haifa', 'Natanya', 'Paris']
    const randomLocCords = [{ lat: 32.3222, lng: 31.23545 }, { lat: 30.3222, lng: 33.23545 }, { lat: 31.3222, lng: 32.235445 }]
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




