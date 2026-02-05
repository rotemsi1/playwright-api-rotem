import { APIRequestContext, test } from "@playwright/test";

export class RequestHandler {

    private apiRequestContext: APIRequestContext
    private baseUrl: string | undefined
    private apiPath: string = ""
    private apiBody: object = {}

    constructor(apiRequestContext: APIRequestContext, baseUrl: string) {
        this.apiRequestContext = apiRequestContext
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

    body(body: object) {
        this.apiBody = body
        return this
    }

    async getRequest(expectedStatus: number) {
        let responseJson: any
        const url = this.getUrl()
        await test.step(`GET request to: ${url}`, async() => {
            //this.logger.logRequest("GET", url, this.getHeaders())
            const response = await this.apiRequestContext.get(url, {
                //headers: this.getHeaders()
            })
            //this.cleanupFields()
            const actualStatus = response.status()
            responseJson = await response.json()
            //this.logger.logResponse(actualStatus, responseJson)
            this.validateStatus(actualStatus, expectedStatus)
        })
        return responseJson
    }

    async postRequest(expectedStatus: number) {
        let responseJson: any
        const url = this.getUrl()
        await test.step(`POST request to: ${url}`, async() => {
            const response = await this.apiRequestContext.post(url, {
                // headers: this.getHeaders(),
                data: this.apiBody
            })
            // this.cleanupFields()
            const actualStatus = response.status()
            responseJson = await response.json()
            // this.logger.logResponse(actualStatus, responseJson)
            this.validateStatus(actualStatus, expectedStatus)
            // this.logger.logRequest("POST", url, this.getHeaders(), this.apiBody)
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
            // const logs = this.logger.getRecentLogs()
            throw new Error(`Expected status: ${expectedStatus} Actual status: ${actualStatus}`)
        }
    }

}