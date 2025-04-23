import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError, tap } from 'rxjs';
import { ProductsResponse, ProductsResponseSchema } from '../models/product.model';
import { PostsResponse, PostsResponseSchema } from '../models/post.model';
import { z } from 'zod';

export type SortOrder = 'asc' | 'desc';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'https://dummyjson.com';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse | z.ZodError) {
    let errorMessage = 'An error occurred';
    
    if (error instanceof z.ZodError) {
      errorMessage = error.errors.map(err => err.message).join(', ');
    } else if (error instanceof HttpErrorResponse) {
      errorMessage = error.error?.message || error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  getProducts(
    skip: number = 0, 
    limit: number = 10, 
    sortBy?: string, 
    order: SortOrder = 'asc'
  ): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());
    
    // Add sorting if specified
    if (sortBy) {
      params = params
        .set('sortBy', sortBy)
        .set('order', order);
    }

    return this.http.get<ProductsResponse>(`${this.baseUrl}/products`, { params })
      .pipe(
        map(response => {
          try {
            return ProductsResponseSchema.parse(response);
          } catch (error) {
            throw error instanceof z.ZodError ? error : new Error('Invalid response format');
          }
        }),
        catchError(error => this.handleError(error))
      );
  }

  getPosts(skip: number = 0, limit: number = 10): Observable<PostsResponse> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());

    return this.http.get<PostsResponse>(`${this.baseUrl}/posts`, { params })
      .pipe(
        map(response => {
          try {
            console.log('Response:', response);
            console.log('Parsed response:', PostsResponseSchema.parse(response));
            return PostsResponseSchema.parse(response);
          } catch (error) {
            throw error instanceof z.ZodError ? error : new Error('Invalid response format');
          }
        }),
        catchError(error => this.handleError(error))
      );
  }
} 