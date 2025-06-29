import { test, expect } from '@playwright/test';
import { BooksApi } from '../api/booksApi';
import { testData } from '../resources/bookApiData';


test.describe('Books API Tests', () => {
    let booksApi: BooksApi;

    test.beforeEach(async ({ request }) => {
        booksApi = new BooksApi(request);
    });
    test.afterEach(async () => {
        // Ensure clean state before each test
        await booksApi.deleteAllBooksFromCollection(
            testData.testUser.userId,
            testData.testUser.token
        );
    });

    test('Validate GET - Get all books with the properties and Schema', async () => {
        const books_res = await booksApi.getAllBooks();
        console.log(books_res);
        
        expect(books_res.books).toBeInstanceOf(Array);
        expect(books_res.books.length).toBeGreaterThan(0);
        
        // Verify book properties
        const firstBook = books_res.books[0];
        expect(firstBook).toHaveProperty('isbn');
        expect(firstBook).toHaveProperty('title');
        expect(firstBook).toHaveProperty('subTitle');
        expect(firstBook).toHaveProperty('author');
        expect(firstBook).toHaveProperty('publish_date');
        expect(firstBook).toHaveProperty('publisher');
        expect(firstBook).toHaveProperty('pages');
        expect(firstBook).toHaveProperty('description');
        expect(firstBook).toHaveProperty('website');

        // Verify response schema
        expect(typeof firstBook.isbn).toBe('string');
        expect(typeof firstBook.title).toBe('string');
        expect(typeof firstBook.subTitle).toBe('string');
        expect(typeof firstBook.author).toBe('string');
        expect(typeof firstBook.publish_date).toBe('string');
        expect(typeof firstBook.publisher).toBe('string');
        expect(typeof firstBook.pages).toBe('number');
        expect(typeof firstBook.description).toBe('string');
        expect(typeof firstBook.website).toBe('string');
    });

    test('Validate GET - Get book by valid ISBN', async () => {
        const bookByIsbn = await booksApi.getBookByISBN(testData.validISBNs.gitPocketGuide);
        console.log(bookByIsbn);
        
        expect(bookByIsbn).toHaveProperty('isbn', testData.validISBNs.gitPocketGuide);
        expect(bookByIsbn).toHaveProperty('title');
        expect(bookByIsbn).toHaveProperty('subTitle');
        expect(bookByIsbn).toHaveProperty('author');
        expect(bookByIsbn).toHaveProperty('publisher');
    });

    test('Validate GET- Get book by invalid ISBN', async () => {
        const invalidResponse = await booksApi.request.get(`${booksApi.baseURL}/BookStore/v1/Book`, {
            params: { ISBN: testData.invalidISBN }
        });
        
        expect(invalidResponse.status()).toBe(400);
        const body = await invalidResponse.json();
        expect(body).toHaveProperty('code', '1205');
        expect(body).toHaveProperty('message', 'ISBN supplied is not available in Books Collection!');
    });

    test('Validate - Add books to collection by Authorized User', async () => {
        const isbns = [
            testData.validISBNs.gitPocketGuide,
            testData.validISBNs.learningJSDesign
        ];
        
        await booksApi.addBooksToCollection(
            testData.testUser.userId,
            isbns,
            testData.testUser.token
        );
        
        // Verify the record is inserted by making  API call to get user's collection
        const response = await booksApi.request.get(`${booksApi.baseURL}/Account/v1/User/${testData.testUser.userId}`, {
            headers: {
                'Authorization': `Bearer ${testData.testUser.token}`
            }
        });
        
        const userData = await response.json();
        expect(userData.books.map((b: any) => b.isbn)).toEqual(expect.arrayContaining(isbns));
    });
    
    test('Validate PUT - Edit  book details in collection with {ISBN}', async () => {
        //Adding records first
        await booksApi.addBooksToCollection(
            testData. testUser.userId,
            [testData.validISBNs.learningJSDesign],
            testData.testUser.token
        );
        await booksApi.replaceBookInCollection(
            testData.testUser.userId,
            testData.validISBNs.learningJSDesign,
            testData.validISBNs.designingEvolvableWeb,
            testData.testUser.token
        );
        
        // Verify  the record is edited by making  API call to get user's collection
        const response = await booksApi.request.get(`${booksApi.baseURL}/Account/v1/User/${testData.testUser.userId}`, {
            headers: {
                'Authorization': `Bearer ${testData.testUser.token}`
            }
        });
        
        const userData = await response.json();
        expect(userData.books.map((b: any) => b.isbn)).toContain(testData.validISBNs.designingEvolvableWeb);
        expect(userData.books.map((b: any) => b.isbn)).not.toContain(testData.validISBNs.learningJSDesign);
    });

    test('Validate DELETE (/BookStore/v1/Book)- delete particular isbn number provided', async () => {
        //Adding records first
        await booksApi.addBooksToCollection(
            testData.testUser.userId,
            [
                testData.validISBNs.gitPocketGuide,
                testData.validISBNs.learningJSDesign,
                testData.validISBNs.designingEvolvableWeb
            ],
            testData.testUser.token
        );
        await booksApi.deleteBookFromCollection(
            testData.testUser.userId,
            testData.validISBNs.gitPocketGuide,
            testData.testUser.token
        );
        
        // Verify by making another API call to get user's collection
        const response = await booksApi.request.get(`${booksApi.baseURL}/Account/v1/User/${testData.testUser.userId}`, {
            headers: {
                'Authorization': `Bearer ${testData.testUser.token}`
            }
        });
        
        const userData = await response.json();
        expect(userData.books.map((b: any) => b.isbn)).not.toContain(testData.validISBNs.gitPocketGuide);
    });
    
    test('Validate DELETE All (/BookStore/v1/Books) - Remove all book from collections', async () => {
        //Adding records first
        await booksApi.addBooksToCollection(
            testData.testUser.userId,
            [
                testData.validISBNs.gitPocketGuide,
                testData.validISBNs.learningJSDesign,
                testData.validISBNs.designingEvolvableWeb
            ],
            testData.testUser.token
        );
        await booksApi.deleteAllBooksFromCollection(
            testData.testUser.userId,
            testData.testUser.token
        );
        
        // Verify by making another API call to get user's collection
        const response = await booksApi.request.get(`${booksApi.baseURL}/Account/v1/User/${testData.testUser.userId}`, {
            headers: {
                'Authorization': `Bearer ${testData.testUser.token}`
            }
        });
        
        const userData = await response.json();
        expect(userData.books).toHaveLength(0);
    
    // Enhanced verification - check specific ISBNs don't exist
        expect(userData.books.map((b: any) => b.isbn)).not.toContain(testData.validISBNs.gitPocketGuide);
        expect(userData.books.map((b: any) => b.isbn)).not.toContain(testData.validISBNs.learningJSDesign);
        expect(userData.books.map((b: any) => b.isbn)).not.toContain(testData.validISBNs.designingEvolvableWeb);
    });

    
});