import { test as base } from '@playwright/test'
import { RequestHandler } from "./request-handler"

export type TestOptions = {
    requestHandler: RequestHandler
}

export const test = base.extend<TestOptions>({
    requestHandler: async({ request }, use) => {
        const requestHandler = new RequestHandler(request, "https://advantageonlineshopping.com")
        await use(requestHandler);
    }
})