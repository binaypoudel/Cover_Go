import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export class BaseApi {
    readonly request: APIRequestContext;
    readonly baseURL: string = 'https://demoqa.com';

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    protected async validateResponse(response: APIResponse, expectedStatus: number | number[]): Promise<any> {
        const statusCodes = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
        const actualStatus = response.status();
        
        // Verify the response status is one of the expected codes
        expect(statusCodes).toContain(actualStatus);
        
        // Handle response body
        try {
            return await response.json();
        } catch {
            return null; // For responses with no body (like 204 No Content)
        }
    }
}