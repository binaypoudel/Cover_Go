import { Page, Locator, expect } from '@playwright/test';

interface TableRecord {
    firstName: string | null;
    lastName: string | null;
    age: string | null;
    email: string | null;
    salary: string | null;
    department: string | null;
}

interface RegistrationFormData {
    firstName: string;
    lastName: string;
    email: string;
    age: string;
    salary: string;
    department: string;
}

export class WebTablePage  {
    private page: Page;
    // Locators
    readonly addNewRecordButton: Locator;
    readonly registrationForm: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly ageInput: Locator;
    readonly salaryInput: Locator;
    readonly departmentInput: Locator;
    readonly submitButton: Locator;
    readonly searchBox: Locator;
    readonly tableRows: Locator;
    readonly editButtons: Locator;
    readonly deleteButtons: Locator;
    readonly noDataMessage: Locator;
    readonly tableCells: Locator;
    readonly registrationFormClose:Locator;

    constructor(page: Page) {
         this.page=page;
        // Initialize locators
        this.addNewRecordButton = page.locator('#addNewRecordButton');
        this.registrationForm = page.locator('.modal-content');
        this.firstNameInput = page.locator('#firstName');
        this.lastNameInput = page.locator('#lastName');
        this.emailInput = page.locator('#userEmail');
        this.ageInput = page.locator('#age');
        this.salaryInput = page.locator('#salary');
        this.departmentInput = page.locator('#department');
        this.submitButton = page.locator('#submit');
        this.searchBox = page.locator('#searchBox');
        this.tableRows = page.locator('.rt-tr-group:not(.-padRow)');
        this.editButtons = page.locator('span[title="Edit"]');
        this.deleteButtons = page.locator('span[title="Delete"]');
        this.noDataMessage = page.locator('.rt-noData');
        this.tableCells = page.locator('.rt-td');
        this.registrationFormClose = page.locator('.sr-only');
    }
    async goto() {
      await this.page.goto('https://demoqa.com/webtables');
      //await this.page.waitForLoadState('networkidle');
      // await this.page.evaluate(() => {
      // document.querySelectorAll('#fixedban, .modal-content, footer').forEach(el => el.remove())
      // })
    }

    // Form Operations
    async openRegistrationForm(): Promise<void> {
        await this.addNewRecordButton.click();
        await expect(this.registrationForm).toBeVisible();
    }

    async fillRegistrationForm(data: RegistrationFormData): Promise<void> {
        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        await this.emailInput.fill(data.email);
        await this.ageInput.fill(data.age);
        await this.salaryInput.fill(data.salary);
        await this.departmentInput.fill(data.department);
    }

    async submitForm(): Promise<void> {
        await this.submitButton.click();
        await expect(this.registrationForm).toBeHidden();
    }
    async submitFormForInvalidCase(): Promise<void> {
        await this.submitButton.click();
        await expect(this.registrationForm).toBeVisible();
    }
    // CRUD Operations
    async createNewRecord(data: RegistrationFormData): Promise<void> {
        await this.openRegistrationForm();
        await this.fillRegistrationForm(data);
        await this.submitForm();
    }

    async searchRecord(searchTerm: string): Promise<void> {
        await this.searchBox.fill(searchTerm);
        await this.page.waitForTimeout(500); // Wait for search to complete
    }

    async getTableData(): Promise<TableRecord[]> {
        const rows = await this.tableRows.all();
        const data: TableRecord[] = [];
        
        for (const row of rows) {
            const cells = await row.locator('.rt-td').all();
            if (cells.length === 7) { // Skip empty rows
                data.push({
                    firstName: await cells[0].textContent(),
                    lastName: await cells[1].textContent(),
                    age: await cells[2].textContent(),
                    email: await cells[3].textContent(),
                    salary: await cells[4].textContent(),
                    department: await cells[5].textContent(),
                });
            }
        }
        
        return data;
    }

    async getRecordByEmail(email: string): Promise<TableRecord | undefined> {
        await this.searchRecord(email);
        const records = await this.getTableData();
        return records.find((record) => record.email === email);
    }

    async editRecord(
        email: string, 
        newData: Partial<RegistrationFormData>
    ): Promise<void> {
        await this.searchRecord(email);
        const editButton = this.editButtons.first();
        await editButton.click();
        await expect(this.registrationForm).toBeVisible();
        
        if (newData.firstName) await this.firstNameInput.fill(newData.firstName);
        if (newData.lastName) await this.lastNameInput.fill(newData.lastName);
        if (newData.email) await this.emailInput.fill(newData.email);
        if (newData.age) await this.ageInput.fill(newData.age);
        if (newData.salary) await this.salaryInput.fill(newData.salary);
        if (newData.department) await this.departmentInput.fill(newData.department);
        
        await this.submitButton.click();
    }

    async deleteRecord(email: string): Promise<void> {
        await this.searchRecord(email);
        const deleteButton = this.deleteButtons.first();
        await deleteButton.click();
    }

    // Verification Methods
    async verifyRecordExists(email: string, shouldExist: boolean): Promise<void> {
        await this.searchRecord(email);
        const records = await this.getTableData();
        
        if (shouldExist) {
            expect(records.some(record => record.email === email)).toBeTruthy();
        } else {
            expect(records.some(record => record.email === email)).toBeFalsy();
        }
    }

    async verifyNoDataMessage(): Promise<void> {
        await expect(this.noDataMessage).toBeVisible();
        await expect(this.noDataMessage).toContainText("No rows found");
    }

    async verifyFormValidation(): Promise<void> {
        await expect(this.firstNameInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(this.lastNameInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(this.emailInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(this.ageInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(this.salaryInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(this.departmentInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    }

    // async getRecordsCount(): Promise<number> {
    //     const rows = await this.tableRows.all();
    //     let count = 0;
        
    //     for (const row of rows) {
    //         const cells = await row.locator('.rt-td').all();
    //         if (cells.length === 7) count++;
    //     }
        
    //     return count;
    // }
}
    

    
