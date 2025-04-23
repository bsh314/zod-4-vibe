import { Component, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Products</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="products()" matSort (matSortChange)="sortData($event)">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Title</th>
            <td mat-cell *matCellDef="let product">{{product.title}}</td>
          </ng-container>

          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Price</th>
            <td mat-cell *matCellDef="let product">{{product?.price}}</td>
          </ng-container>

          <ng-container matColumnDef="rating">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Rating</th>
            <td mat-cell *matCellDef="let product">{{product.rating}}</td>
          </ng-container>

          <ng-container matColumnDef="brand">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Brand</th>
            <td mat-cell *matCellDef="let product">{{product.brand}}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator
          [length]="totalProducts()"
          [pageSize]="10"
          [pageSizeOptions]="[5, 10, 25, 100]"
          (page)="onPageChange($event)"
          aria-label="Select page">
        </mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    table {
      width: 100%;
    }

    .mat-mdc-row:hover {
      background: whitesmoke;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  totalProducts = signal<number>(0);
  displayedColumns: string[] = ['title', 'price', 'rating', 'brand'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(skip: number = 0): void {
    this.apiService.getProducts(skip).subscribe(response => {
      this.products.set(response.products);
      this.totalProducts.set(response.total);
    });
  }

  onPageChange(event: PageEvent): void {
    this.loadProducts(event.pageIndex * event.pageSize);
  }

  sortData(sort: Sort): void {
    const data = this.products().slice();
    if (!sort.active || sort.direction === '') {
      this.products.set(data);
      return;
    }

    const sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title':
          return compare(a.title, b.title, isAsc);
        case 'price':
          return compare(a.price, b.price, isAsc);
        case 'rating':
          return compare(a.rating, b.rating, isAsc);
        case 'brand':
          return compare(a.brand, b.brand, isAsc);
        default:
          return 0;
      }
    });

    this.products.set(sortedData);
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
} 