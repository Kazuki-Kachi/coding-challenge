import {AzureFunction, Context, HttpRequest} from '@azure/functions'
import {GeoJsonRequest}                      from '../shared/foodTrucks/requests'
import {GeoJson}                             from '../shared/foodTrucks/geoJson'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const body = req.body ?? {
        location: [parseFloat(req.query.longitude), parseFloat(req.query.latitude)],
        distance: parseInt(req.query.distance ?? ''),
        unit: req.query.unit
    }
    context.log(`${JSON.stringify(req)}
     ${JSON.stringify(body)}`)
    try {
        GeoJsonRequest.validate(body)
        context.res = {
            headers: {'content-type': 'application/json', 'Access-Control-Allow-Origin': ' *'},
            body: await GeoJson.get(body, context)
        }
    } catch (err) {
        if (err instanceof TypeError)
            context.res = {
                statusCode: 400,
                body: err.message
            }
        else
            context.res = {
                statusCode: 500,
                body: err.toString()
            }
    }
}
export default httpTrigger