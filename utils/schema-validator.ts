import fs from "fs/promises"
import Ajv from "ajv"
import addFormats from "ajv-formats"

const SCHEMAS_FOLDER = "./response-schemas"
const ajv = new Ajv({allErrors: true})
addFormats(ajv)

export async function validateSchema(path: string, responseBody: object) {
    const schemaPath = SCHEMAS_FOLDER + "/" + path
    //if (createSchemaFlag) await generateNewSchema(responseBody, schemaPath)
    const parsedSchema = await parseSchema(schemaPath)
    // Create a ValidateFunction object from the parsed schema and validate it
    const validateFunction = ajv.compile(parsedSchema)
    const isValid = validateFunction(responseBody)
    if (!isValid) {
        throw new Error(
            `${JSON.stringify(validateFunction.errors, null, 4)}\n\n` +
            `Actual response body: \n`+
            `${JSON.stringify(responseBody, null, 4)}`
        )
    }
    return isValid
}

async function parseSchema(schemaPath: string) {
    // Read the schema content from the schema .json file in UTF-8 encoding
    const schemaContent = await fs.readFile(schemaPath, "utf-8")
    // Returned the parsed JSON object
    return JSON.parse(schemaContent)
}