import { APIRequestContext, test } from "@playwright/test"
import { Logger } from "./logger"

export class RequestHandler {

    private apiRequestContext: APIRequestContext
    private logger: Logger
    private baseUrl: string | undefined
    private apiPath: string = ""
    private apiHeaders: Record<string, string> = {}
    private apiBody: object = {}

    constructor(apiRequestContext: APIRequestContext, logger: Logger, baseUrl: string) {
        this.apiRequestContext = apiRequestContext
        this.logger = logger
        this.baseUrl = baseUrl
    }

    url(url: string) {
        this.baseUrl = url
        return this
    }

    path(path: string) {
        this.apiPath = path
        return this
    }

    headers(headers: Record<string, string>) {
        this.apiHeaders = headers
        return this
    }

    body(body: object) {
        this.apiBody = body
        return this
    }

    async getRequest(expectedStatus: number) {
        let responseJson: any
        const url = this.getUrl()
        await test.step(`GET request to: ${url}`, async() => {
            this.logger.logRequest("GET", url, this.apiHeaders)
            const response = await this.apiRequestContext.get(url, {
                headers: this.apiHeaders
            })
            //this.cleanupFields()
            responseJson = await response.json()
            this.logger.logResponse(response.status(), responseJson)
            this.validateStatus(response.status(), expectedStatus)
        })
        return responseJson
    }

    async postRequest(expectedStatus: number) {
        let responseJson: any
        const url = this.getUrl()
        await test.step(`POST request to: ${url}`, async() => {
            this.logger.logRequest("POST", url, this.apiHeaders, this.apiBody)
            const response = await this.apiRequestContext.post(url, {
                headers: this.apiHeaders,
                data: this.apiBody
            })
            // this.cleanupFields()
            responseJson = await response.json()
            this.logger.logResponse(response.status(), responseJson)
            this.validateStatus(response.status(), expectedStatus)
        })
        return responseJson
    }

    async deleteRequest(expectedStatus: number) {
        let responseJson: any
        const url = this.getUrl()
        await test.step(`DELETE request to: ${url}`, async() => {
            this.logger.logRequest("DELETE", url, this.apiHeaders)
            const response = await this.apiRequestContext.delete(url, {
                headers: this.apiHeaders
            })
            responseJson = await response.json()
            // this.cleanupFields()
            this.logger.logResponse(response.status())
            this.validateStatus(response.status(), expectedStatus)
        })
        return responseJson
    }

    private getUrl() {
        const url = new URL(`${this.baseUrl}${this.apiPath}`)
        // for (const [key, value] of Object.entries(this.queryParams))
        //     url.searchParams.append(key, value)
        return url.toString()
    }

    private validateStatus(actualStatus: number, expectedStatus: number) {
        if (actualStatus != expectedStatus) {
            const logs = this.logger.getRecentLogs()
            throw new Error(`Expected status: ${expectedStatus} Actual status: ${actualStatus}`)
        }
    }

}