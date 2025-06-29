import { test, expect } from '@playwright/test';
import { formVariable, stateCityMap } from '../resources/formVariable';
import { FormPage } from '../pages/formPage';
 
test.describe('Student Registration Form', () => {
    let formpage:  FormPage;
    const user = formVariable.validUser;
    
 
    test.beforeEach(async ({ page }) => {
        formpage = new FormPage(page);
        await formpage.goto();
    
    });
    // Run after each test
    test.afterEach(async ({page}, testInfo) => {
        // Capture screenshot on test failure
        if (testInfo.status === 'failed') {
            const screenshotPath = `test-results/screenshots/${testInfo.title}.png`;
            await page.screenshot({ path: screenshotPath, fullPage: true });
            
        }
    });
    
 
    test('Validate Submit form with valid data', async () => { 
        await formpage.fillFirstName(user.firstName);
        await formpage.fillLastName(user.lastName);
        await formpage.fillEmail(user.email);
        await formpage.selectGender(user.gender);
        await formpage.fillPhoneNumber(user.phone);
        await formpage.setDateOfBirth(user.dateOfBirth);
        
        for (const subject of user.subjects) {
            await formpage.selectSubject(subject);
        }
        
        await formpage.selectHobbies(user.hobbies);
        await formpage.uploadFile(user.file);
        await formpage.fillAddress(user.address);
        await formpage.selectState(0);
        await formpage.selectCity(0);
        await formpage.submitForm();
 
        await formpage.verifySubmissionModalVisible();
        await formpage.verifySubmittedData('Student Name', `${user.firstName} ${user.lastName}`);
        await formpage.verifySubmittedData('Student Email', user.email);
        await formpage.verifySubmittedData('Gender', user.gender);
        await formpage.verifySubmittedData('Mobile', user.phone);
        await formpage.verifySubmittedData('Date of Birth', user.dateOfBirthFull);
        await formpage.verifySubmittedData('Subjects', user.subjects.join(', '));
        await formpage.verifySubmittedData('Hobbies', user.hobbies.join(', '));
        await formpage.verifySubmittedData('Picture', user.file.split('/').pop()!);
        await formpage.verifySubmittedData('Address', user.address);
        await formpage.verifySubmittedData('State and City', `${user.state[0]} ${user.city}`);
    });
 
    test('Validate required fields', async () => {
        await formpage.submitForm();
        
        // Verify required field validations
        await expect(formpage.firstName).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(formpage.lastName).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(formpage.genderMale).toHaveCSS('color', 'rgb(220, 53, 69)');
        await expect(formpage.genderFemale).toHaveCSS('color', 'rgb(220, 53, 69)');
        await expect(formpage.genderOther).toHaveCSS('color', 'rgb(220, 53, 69)');
        await expect(formpage.userNumber).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    });
 
    test('Validate invalid email format', async () => {
        await formpage.fillEmail(formVariable.invalidUser.email);
        await formpage.submitForm();
        await expect(formpage.userEmail).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    });
 
    test('Validate phone number field with less than 10 digit, containing letters and more than 10 digits', async ({page}) => {
        for( const mobile of formVariable.invalidUser.phone ){
        await formpage.fillPhoneNumber(mobile);
        await formpage.submitForm();
        //await page.waitForTimeout(2000); 
        await expect(formpage.userNumber).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        }
    });
 
    test('Validate gender selection and toggle functionality', async () => {
        for( const gender of user.genderList){
            await formpage.selectGender(gender);
            if (gender=="Male"){
            await expect(formpage.genderMale).toBeChecked();
            }
            else if (gender=="Female"){
            await expect(formpage.genderFemale).toBeChecked();
            }
            else {
            await expect(formpage.genderOther).toBeChecked();
        }
        }
    });
    test('Validate subject field with one or more subjects entered', async ({page}) => {
        //await formpage.selectSubject('Maths')
        for (const subject of user.subjects) {
        await formpage.selectSubject(subject); 
        }
        for (let i = 0; i < user.subjects.length; i++) {
         await expect(formpage.subjectsInputLabel.nth(i)).toContainText(user.subjects[i]);
        }       
    });

    test('Validate that invalid subject name(not in the list) which is not selected', async () => {
        const invalidSubject = 'abcdef';
        await formpage.selectSubject(invalidSubject);
        await expect(formpage.subjectsInputLabel).toHaveCount(0);
        //await expect(formpage.subjectsInputLabel).not.toContainText('abcdef');
    });
    
    test('Validate hobbies check and uncheck', async ({page}) => {
       for (const eachHobby of ['1','2','3']) {
       let hobbyClick =await page.locator(`label[for="hobbies-checkbox-${eachHobby}"]`);
       console.log(`${eachHobby}`);
       await hobbyClick.click(); 
       await hobbyClick.uncheck();
       await expect(hobbyClick).not.toBeChecked();
       }
    });
 
    test('Validate different hobbies selection combination', async () => {
        
       for (const eachHobby of user.hobbyCombination) { 
        await formpage.clearAllHobbies(); 
        await formpage.selectHobbies(eachHobby);
        if (eachHobby.includes('Sports')) {
            await expect(formpage.hobbiesSports).toBeChecked();
        } else {
            await expect(formpage.hobbiesSports).not.toBeChecked();
        }

        if (eachHobby.includes('Reading')) {
            await expect(formpage.hobbiesReading).toBeChecked();
        } else {
            await expect(formpage.hobbiesReading).not.toBeChecked();
        }

        if (eachHobby.includes('Music')) {
            await expect(formpage.hobbiesMusic).toBeChecked();
        } else {
            await expect(formpage.hobbiesMusic).not.toBeChecked();
        }
        } 
    });

 
    test('Validate state  selection', async () => {
        const stateCount= user.state.length-1;
        for(let i=0;i<=stateCount;i++){
        await formpage.selectState(i);
        await expect(formpage.stateDropdown).toContainText(user.state[i]);
        console.log(user.state[i]);
        }
    });

    test('Validate state with city selection', async () => {
        const states = Object.keys(stateCityMap);

        for (let i = 0; i < states.length; i++) {
        const state = states[i];
        await formpage.selectState(i);
        await expect(formpage.stateDropdown).toContainText(state);

        const cities = stateCityMap[state];
        for (let j = 0; j < cities.length; j++) {
        const city = cities[j];
        await formpage.selectCity(j);
        await expect(formpage.cityDropdown).toContainText(city);
        }
        }
    });

    test('Validate address field', async () => {
        await formpage.fillAddress(user.address);
        await expect(formpage.currentAddress).toHaveValue(user.address);
    });
    test('Validate image upload', async () => {
        await formpage.uploadFile(user.file);
        const fileName = await formpage.uploadPicture.inputValue();
        expect(fileName).toContain('sampleimage.jpg');
        //await expect(formpage.uploadPicture).toContainText('sampleimage.jpg');
    });

    test('Verify multiple file upload is not supported', async () => {
        const testFiles = [
            'resources/assets/covergo.docx',
            'resources/assets/sampleimage.jpg'
        ];
        let errorThrown = false;
        let errorMessage = '';
        try {
            // Attempt to upload multiple files
            await formpage.uploadPicture.setInputFiles(testFiles);
        } catch (error) {
            errorThrown = true;
            errorMessage = error instanceof Error ? error.message : String(error);
        }
        // Verify that an error was thrown
        expect(errorThrown).toBe(true);
        expect(errorMessage).toContain('Non-multiple file input can only accept single file');
    });


    test('Validate the close button in the modal after complete registration  ',async()=>{
        await formpage.fillFirstName(user.firstName);
        await formpage.fillLastName(user.lastName);
        await formpage.fillEmail(user.email);
        await formpage.selectGender(user.gender);
        await formpage.fillPhoneNumber(user.phone);
        await formpage.setDateOfBirth(user.dateOfBirth);
        
        for (const subject of user.subjects) {
            await formpage.selectSubject(subject);
        }
        
        await formpage.selectHobbies(user.hobbies);
        await formpage.uploadFile(user.file);
        await formpage.fillAddress(user.address);
        await formpage.selectState(0);
        await formpage.selectCity(0);
        await formpage.submitForm();
        await formpage.closeSubmitModalButton.click();
        await expect(formpage.submissionModal).not.toBeVisible();

    });

});