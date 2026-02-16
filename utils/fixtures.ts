import { test as base } from '@playwright/test'
import { RequestHandler } from "./request-handler"
import { Logger } from './logger'

export type TestOptions = {
    requestHandler: RequestHandler
}

export const test = base.extend<TestOptions>({
    requestHandler: async({ request }, use) => {
        const logger = new Logger()
        const requestHandler = new RequestHandler(request, logger, "https://advantageonlineshopping.com")
        await use(requestHandler);
    }
})