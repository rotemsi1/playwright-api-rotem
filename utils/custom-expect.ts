import { expect as base } from "@playwright/test"
import { validateSchema } from './schema-validator';

declare global {
    namespace PlaywrightTest {
        interface Matchers<R, T> {
            isMatchingSchema(path: string): Promise<boolean>
        }
    }
}

export const expect = base

expect.extend({
    async isMatchingSchema(responseBody: any, path: string) {
        console.log(path)
        const isValidSchema = await validateSchema(path, responseBody)
        if (isValidSchema) {
            return { pass: true, message: () => "Valid schema" }
        }
        else {
            return { pass: false, message: () => "Invalid schema" }
        }   
    }
})