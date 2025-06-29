import { test, expect } from '@playwright/test';
import { WebTablePage } from '../pages/webTablePage';
import { testData } from '../resources/testData';

test.describe('WebTables CRUD Operations', () => {
    let webTablesPage: WebTablePage;

    test.beforeEach(async ({ page }) => {
        webTablesPage = new WebTablePage(page);
        await webTablesPage.goto();
    });
    // Run after each test
    test.afterEach(async ({page}, testInfo) => {
        // Capture screenshot on test failure
        if (testInfo.status === 'failed') {
            const screenshotPath = `test-results/screenshots/${testInfo.title}.png`;
            await page.screenshot({ path: screenshotPath, fullPage: true });
            
        }
    });

    test('Validate Create - Add new record', async () => {
        const record = testData.newRecord;
        
        await webTablesPage.createNewRecord(record);
        await webTablesPage.verifyRecordExists(record.email, true);
        
        const createdRecord = await webTablesPage.getRecordByEmail(record.email);
        expect(createdRecord).toEqual({
            firstName: record.firstName,
            lastName: record.lastName,
            age: record.age,
            email: record.email,
            salary: record.salary,
            department: record.department
        });
    });

    test('Validate Read - Search and view record', async () => {
        const record = testData.newRecord;
        
        // First create a record to search for
        await webTablesPage.createNewRecord(record);
        
        // Test search functionality
        await webTablesPage.searchRecord(record.firstName);
        const foundRecords = await webTablesPage.getTableData();
        expect(foundRecords.length).toBeGreaterThan(0);
        expect(foundRecords[0].firstName).toContain(record.firstName);
    });

    test('Validate Update - Edit existing record', async () => {
        const originalRecord = testData.newRecord;
        const updatedRecord = testData.updatedRecord;
        
        //create a new record to edit
        await webTablesPage.createNewRecord(originalRecord);
        
        // Edit the record
        await webTablesPage.editRecord(originalRecord.email, updatedRecord);
        
        // Verify the record was updated
        await webTablesPage.verifyRecordExists(originalRecord.email, false);
        await webTablesPage.verifyRecordExists(updatedRecord.email, true);
        
        const editedRecord = await webTablesPage.getRecordByEmail(updatedRecord.email);
        expect(editedRecord).toEqual({
            firstName: updatedRecord.firstName,
            lastName: updatedRecord.lastName,
            age: updatedRecord.age,
            email: updatedRecord.email,
            salary: updatedRecord.salary,
            department: updatedRecord.department
        });
    });

    test('Validate Delete - Remove existing record', async () => {
        const record = testData.newRecord;
        
        //  create a new record to delete
        await webTablesPage.createNewRecord(record);
        
        // Delete the record
        await webTablesPage.deleteRecord(record.email);
        
        // Verify the record was deleted
        await webTablesPage.verifyRecordExists(record.email, false);
    });

    test('Validate creating invalid record', async () => {
        const invalidRecord = testData.invalidRecord;
        
        await webTablesPage.openRegistrationForm();
        await webTablesPage.fillRegistrationForm(invalidRecord);
         await webTablesPage.submitFormForInvalidCase();
        
        // Verify fields show validation errors
        await webTablesPage.verifyFormValidation();
        
    });

    test('Validate Required fields', async () => {
        await webTablesPage.openRegistrationForm();
        await webTablesPage.submitFormForInvalidCase();
        
        // Verify fields show validation errors
        await webTablesPage.verifyFormValidation();
       
    });
    
    test('Validate Close Button of registration form', async () => {
        await webTablesPage.openRegistrationForm();
        await webTablesPage.registrationFormClose.click();
        
        // Verify fields show validation errors
        await expect(webTablesPage.registrationForm).toBeHidden();
    });


    test('Validate table Pagination', async () => {
        // Add multiple records to test pagination
        for (let i = 1; i <= 11; i++) {
            const record = {
                firstName: `User${i}`,
                lastName: `Last${i}`,
                email: `user${i}@example.com`,
                age: (20 + i).toString(),
                salary: (30000 + (i * 1000)).toString(),
                department: `Dept${i}`
            };
            await webTablesPage.createNewRecord(record);
        }
        
        // Verify all records exist
        for (let i = 1; i <= 11; i++) {
            await webTablesPage.verifyRecordExists(`user${i}@example.com`, true);
        }
    });

    test('Validate delete all records', async () => {
        //First create some records
        for (let i = 1; i <= 3; i++) {
            const record = {
                firstName: `Temp${i}`,
                lastName: `User${i}`,
                email: `temp${i}@example.com`,
                age: '25',
                salary: '40000',
                department: 'Temp'
            };
            await webTablesPage.createNewRecord(record);
        }
        
        // Delete all records
        while (await webTablesPage.deleteButtons.count() > 0) {
        await webTablesPage.deleteButtons.first().click();
        }
        // Verify no records exist
        await webTablesPage.verifyNoDataMessage();
    });
});