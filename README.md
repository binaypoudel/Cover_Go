# Cover_Go_Assignment

Web Form, Web Tables and Api Test Automation with Playwright Typescript


.Node version: v22.16.0

.npm version: 11.4.2

.Playwright version:1.53.1

A. Running the Test

Steps:

1.To run the test Download the Node and npm as the above version mentioned.

2.You can open the folder in the command and run the test , by entering the command as 
    npx playwright test(for running all test) or 
    npx playwright test -enter individual test file here-(eg:npx playwright test form.spec.ts)

3.After installing you are able to execute the project in any IDE, Visual studio(preferred) and you can run it in the command by entering the command as 
    npx playwright test(for running all test) or 
    npx playwright test -enter individual test file here-(eg:npx playwright test form.spec.ts)
    
4.View the report by entering the command as
    npx playwright show-report

B. The Assignment are performed in the POM(Page Object Model) design pattern and also adhering all the task requirements as mentioned in the assignment.

C. The Assignment is in Headed mode where you can view the UI while running the test.

D. The folder Structure is as Below:

CoverGo_assignment/
├── api/

│   ── baseApi.ts

│   ── booksApi.ts

├── pages/

│   ── formPage.ts

│   ── webTable.ts

├── tests/

│   ── books.spec.ts

│   ── form.spec.ts

│   ── webTables.spec.ts

├── resources/

│   |── assets/

│   ── booksApiData.ts

│   ── formVariable.ts

│   ── testData.ts

├── playwright.config.ts

|── package.json

E. I also have captured the screenshot of the failed test for Web Form and Web Tables in the folder :test-results/screenshots.
