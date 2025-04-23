import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ProductsResponse, ProductsResponseSchema } from '../models/product.model';
import { PostsResponse, PostsResponseSchema } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'https://dummyjson.com';

  constructor(private http: HttpClient) {}

  getProducts(skip: number = 0, limit: number = 10): Observable<ProductsResponse> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());

    return this.http.get<ProductsResponse>(`${this.baseUrl}/products`, { params })
      .pipe(
        map(response => {
          const validatedData = ProductsResponseSchema.parse(response);
          return validatedData;
        })
      );
  }

  getPosts(skip: number = 0, limit: number = 10): Observable<PostsResponse> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());

    return this.http.get<PostsResponse>(`${this.baseUrl}/posts`, { params })
      .pipe(
        map(response => {
          const validatedData = PostsResponseSchema.parse(response);
          return validatedData;
        })
      );
  }
} 