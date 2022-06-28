import {GeoJson}       from '../../../shared/foodTrucks/geoJson'
import {DistanceUnits} from '../../../shared/foodTrucks/requests'

jest.spyOn(GeoJson, 'getFoodTracks').mockResolvedValue(
    {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [
                        -122.42730642251331,
                        37.76201920035647
                    ]
                }
            },
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [
                        -122.42516137635808,
                        37.764459521442355
                    ]
                }
            },
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [
                        -122.42711064395493,
                        37.768320249510616
                    ]
                }
            },
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [
                        -122.42951117634738,
                        37.7666247727157
                    ]
                }
            },
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [
                        -122.43346578040662,
                        37.75798419052856
                    ]
                }
            },
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [
                        -122.42182419935827,
                        37.760957168278544
                    ]
                }
            },
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [
                        -122.4220826209929,
                        37.763858081360304
                    ]
                }
            }
        ],
        'crs': {
            'type': 'name',
            'properties': {
                'name': 'urn:ogc:def:crs:OGC:1.3:CRS84'
            }
        }
    }
)
describe('Check getGeoJson', () => {
    it('found all', () => {
        return expect(GeoJson.get({
            location: [-122.43156655769769, 37.76016570672468],
            distance: 100
        }).then(res => ('features' in res) ? res['features'].length : 0)).resolves.toBe(7)
    })

    it('found 0 (no distance)', () => {
        return expect(GeoJson.get({
            location: [-122.43156655769769, 37.76016570672468],
            distance: 0
        }).then(res => ('features' in res) ? res['features'].length : 0)).resolves.toBe(0)
    })

    it('found 0 (distance 10m)', () => {
        return expect(GeoJson.get({
            location: [-122.43156655769769, 37.76016570672468],
            distance: 10,
            unit: DistanceUnits.meters
        }).then(res => ('features' in res) ? res['features'].length : 0)).resolves.toBe(0)
    })

})