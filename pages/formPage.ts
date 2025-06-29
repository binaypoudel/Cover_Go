import { Page, Locator, expect } from '@playwright/test';

 
export class FormPage{
    private page: Page;
    // Locators
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly userEmail: Locator;
    readonly genderMale: Locator;
    readonly genderFemale: Locator;
    readonly genderOther: Locator;
    readonly userNumber: Locator;
    readonly dateOfBirthInput: Locator;
    readonly subjectsInputLabel: Locator;
    readonly subjectsInput: Locator;
    readonly hobbiesSports: Locator;
    readonly hobbiesReading: Locator;
    readonly hobbiesMusic: Locator;
    readonly uploadPicture: Locator;
    readonly currentAddress: Locator;
    readonly stateDropdown: Locator;
    readonly cityDropdown: Locator;
    readonly submitButton: Locator;
    readonly submissionModal: Locator;
    readonly closeSubmitModalButton: Locator;
 
    constructor(page: Page) {
        this.page=page;
        // Initialize locators
        this.firstName = page.locator('#firstName');
        this.lastName = page.locator('#lastName');
        this.userEmail = page.locator('#userEmail');
        this.genderMale = page.locator('label[for="gender-radio-1"]');
        this.genderFemale = page.locator('label[for="gender-radio-2"]');
        this.genderOther = page.locator('label[for="gender-radio-3"]');
        this.userNumber = page.locator('#userNumber');
        this.dateOfBirthInput = page.locator('#dateOfBirthInput');
        this.subjectsInputLabel=page.locator('.subjects-auto-complete__multi-value__label');
        this.subjectsInput = page.locator('#subjectsInput');
        this.hobbiesSports = page.locator('label[for="hobbies-checkbox-1"]');
        this.hobbiesReading = page.locator('label[for="hobbies-checkbox-2"]');
        this.hobbiesMusic = page.locator('label[for="hobbies-checkbox-3"]');
        this.uploadPicture = page.locator('#uploadPicture');
        this.currentAddress = page.locator('#currentAddress');
        this.stateDropdown = page.locator('#state');
        this.cityDropdown = page.locator('#city');
        this.submitButton = page.locator('#submit');
        this.submissionModal = page.locator('.modal-content');
        this.closeSubmitModalButton = page.locator('#closeLargeModal');
    }
    async goto() {
      await this.page.goto('https://demoqa.com/automation-practice-form')
      // await this.page.evaluate(() => {
      // document.querySelectorAll('#fixedban, .modal-content, footer').forEach(el => el.remove())
      // })
    }
 
    // Form interaction methods
    async fillFirstName(name: string) {
      await this.firstName.fill(name);
    }
 
    async fillLastName(name: string) {
      await this.lastName.fill(name);
    }
 
    async fillEmail(email: string) {
      await this.userEmail.fill(email);
    }
 
    async selectGender(gender: string){     //'Male' | 'Female' | 'Other' 
      switch (gender) {
        case 'Male':
        await this.genderMale.click();
        break;
        case 'Female':
        await this.genderFemale.click();
        break;
        case 'Other':
        await this.genderOther.click();
        break;
      }
    }
 
    async fillPhoneNumber(number: string) {
      await this.userNumber.fill(number);
    }
 
    async setDateOfBirth(date: string) {
      await this.dateOfBirthInput.fill(date);
      await this.page.keyboard.press('Enter');
    }
 
    async selectSubject(subject: string) {
      await this.subjectsInput.click();    //focus              
      await this.subjectsInput.type(subject, { delay: 100 }); // type slowly for React to render suggestions
      await this.page.keyboard.press('Enter');
    }
 
    async selectHobbies(hobbies: string[]) {
      for (const hobby of hobbies) {
        switch (hobby) {
          case 'Sports':
          await this.hobbiesSports.click();
          break;
          case 'Reading':
          await this.hobbiesReading.click();
          break;
          case 'Music':
          await this.hobbiesMusic.click();
          break;
        }
      }
    }
    async clearAllHobbies(): Promise<void> {
    const checkboxes = [this.hobbiesSports, this.hobbiesReading, this.hobbiesMusic];
    for (const checkbox of checkboxes) {
      if (await checkbox.isChecked()) {
        await checkbox.uncheck();
      }
    }
  }
 
    async uploadFile(filePath: string) {
        await this.uploadPicture.setInputFiles(filePath);
    }
 
    async fillAddress(address: string) {
        await this.currentAddress.fill(address);
    }
 
    async selectState(state: number) {
      await this.stateDropdown.click();
      await this.page.locator(`div[id="react-select-3-option-${state}"]`).click();
    }
 
    async selectCity(city: number) {
      await this.cityDropdown.click();

      await this.page.locator(`div[id="react-select-4-option-${city}"]`).click();
      
    }
 
    async submitForm() {
      await this.submitButton.click();
    }
 
    async verifySubmissionModalVisible() {
      await expect(this.submissionModal).toBeVisible();
    }
 
    async verifySubmittedData(label: string, expectedValue: string) {
      const valueLocator = this.submissionModal.locator(`//td[text()="${label}"]/following-sibling::td`);
      await expect(valueLocator).toContainText(expectedValue);
    }
}


