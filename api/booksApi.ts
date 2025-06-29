import { APIRequestContext, expect } from '@playwright/test';
import { BaseApi } from './baseApi';

interface Book {
    isbn: string;
    title: string;
    subTitle: string;
    author: string;
    publish_date: string;
    publisher: string;
    pages: number;
    description: string;
    website: string;
}

interface BooksResponse {
    books: Book[];
}

export class BooksApi extends BaseApi {
    constructor(request: APIRequestContext) {
        super(request);
    }

    async getAllBooks(): Promise<BooksResponse> {
        const response = await this.request.get(`${this.baseURL}/BookStore/v1/Books`);
        return this.validateResponse(response, 200);
    }

    async getBookByISBN(isbn: string): Promise<Book> {
        const response = await this.request.get(`${this.baseURL}/BookStore/v1/Book`, {
            params: { ISBN: isbn }
        });
        return this.validateResponse(response, 200);
    }

    async addBooksToCollection(userId: string, isbns: string[], token: string): Promise<void> {
        const response = await this.request.post(`${this.baseURL}/BookStore/v1/Books`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: {
                userId:userId,
                collectionOfIsbns: isbns.map(isbn => ({ isbn }))
            }
        });
        await this.validateResponse(response, 201);
    }
    async replaceBookInCollection(userId: string, currentIsbn: string, newIsbn: string, token: string): Promise<void> {
        const response = await this.request.put(`${this.baseURL}/BookStore/v1/Books/${currentIsbn}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                userId: userId,
                isbn: newIsbn
        }
        });
        await this.validateResponse(response,200);
    }

    async deleteBookFromCollection(userId: string, isbn: string, token: string): Promise<void> {
        const response = await this.request.delete(`${this.baseURL}/BookStore/v1/Book`, {
            // params: { userId: userId }
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            // 'Accept': 'application/json'
            },
            data: JSON.stringify({  // Note: Using JSON.stringify()
                userId: userId,
                isbn: isbn
            })
        });
        await this.validateResponse(response, [204,400]);
    }
    async deleteAllBooksFromCollection(userId: string,token: string): Promise<void> {
        const response = await this.request.delete(`${this.baseURL}/BookStore/v1/Books`, {
            params: { UserId: userId },
            headers: {
            'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json',
            
            },
            
        });
        await this.validateResponse(response,[204,404]);
    }

    
}