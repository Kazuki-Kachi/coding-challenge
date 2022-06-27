import {DistanceUnits, GeoJsonRequest} from '../../../shared/foodTrucks/requests'

describe('Check requestValidator', () => {

    it.each([
        {location: [37.760628107803335, -122.43226448208054], distance: 10, unit: DistanceUnits.miles},
        {location: [37.760628107803335, -122.43226448208054], distance: 10, unit: DistanceUnits.kilometers},
        {location: [37.760628107803335, -122.43226448208054], distance: 10, unit: DistanceUnits.meters},
        {location: [37.760628107803335, -122.43226448208054], distance: 0}])('Successful', value => {
        expect(GeoJsonRequest.validate(value))
    })

    it.each([
        {location: [37.760628107803335, -122.43226448208054, 1000], distance: 10, unit: DistanceUnits.miles},
        {location: [37.760628107803335], distance: 10, unit: DistanceUnits.miles},
    ])('Not two locations.', value => {
        expect(() => GeoJsonRequest.validate(value)).toThrowError(TypeError)
    })

    it('distance is a negative number.', () => {
        expect(() => GeoJsonRequest.validate({
            location: [37.760628107803335, -122.43226448208054],
            distance: -100,
            unit: DistanceUnits.miles
        })).toThrowError(TypeError)
    })

    it.each([
        {location: [37.760628107803335, -122.43226448208054, 1000], distance: 10, unit: 'aaa'},
    ])('unit is not DistanceUnits.', value => {
        expect(() => GeoJsonRequest.validate(value)).toThrowError(TypeError)
    })
})