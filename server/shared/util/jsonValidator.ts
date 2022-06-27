import Ajv, {Options} from 'ajv/dist/2020'
import ajvKeywords    from 'ajv-keywords'

export class JsonValidator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    static validate(json: unknown, schema: object, options?: Options, useAdditionalKeywords = false): void {
        const opts = options ?? {strict: false, allErrors: true}
        const ajv = useAdditionalKeywords ? ajvKeywords(new Ajv(opts)) : new Ajv(opts)
        const validate = ajv.compile(schema)
        const result = validate(json)
        if (!result) throw TypeError(ajv.errorsText(validate.errors))

    }
}
