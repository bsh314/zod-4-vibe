import { Component, OnInit, signal, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, Sort, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService, SortOrder } from '../../services/api.service';
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
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card>
      <mat-card-header class="header">
        <mat-card-title>Products</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="loading-container" *ngIf="loading()">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <div class="table-container" [class.loading]="loading()">
          <table mat-table [dataSource]="dataSource" matSort [matSortActive]="currentSortField() || ''" 
                 [matSortDirection]="currentSortDirection()" (matSortChange)="sortData($event)">
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef mat-sort-header="title">Title</th>
              <td mat-cell *matCellDef="let product">{{product.title}}</td>
            </ng-container>

            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef mat-sort-header="price">Price</th>
              <td mat-cell *matCellDef="let product">{{product?.price | currency}}</td>
            </ng-container>

            <ng-container matColumnDef="rating">
              <th mat-header-cell *matHeaderCellDef mat-sort-header="rating">Rating</th>
              <td mat-cell *matCellDef="let product">{{product.rating}}</td>
            </ng-container>

            <ng-container matColumnDef="brand">
              <th mat-header-cell *matHeaderCellDef>Brand</th>
              <td mat-cell *matCellDef="let product">{{product.brand || 'N/A'}}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" colspan="4">No products found</td>
            </tr>
          </table>

          <mat-paginator
            [length]="totalProducts()"
            [pageSize]="pageSize()"
            [pageSizeOptions]="[5, 10, 25, 100]"
            (page)="onPageChange($event)"
            aria-label="Select page">
          </mat-paginator>
        </div>
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

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 20px;
    }

    .loading {
      opacity: 0.5;
    }

    .mat-cell {
      padding: 16px;
      text-align: center;
    }

    .table-container {
      position: relative;
      min-height: 200px;
    }

    th.mat-sort-header {
      font-weight: bold;
      color: rgba(0, 0, 0, 0.87);
    }

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }

    mat-card-title {
      margin: 0;
      display: flex;
      align-items: center;
    }
  `]
})
export class ProductsComponent implements OnInit, AfterViewInit {
  products = signal<Product[]>([]);
  totalProducts = signal<number>(0);
  loading = signal<boolean>(false);
  pageSize = signal<number>(10);
  pageIndex = signal<number>(0);
  currentSortField = signal<string | undefined>(undefined);
  currentSortDirection = signal<SortOrder>('asc');
  displayedColumns: string[] = ['title', 'price', 'rating', 'brand'];
  dataSource = new MatTableDataSource<Product>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    // Initialize sorting if needed
    if (this.sort && !this.currentSortField()) {
      this.currentSortField.set('title');
      this.loadProducts();
    }
  }

  loadProducts(): void {
    this.loading.set(true);
    const skip = this.pageIndex() * this.pageSize();
    const limit = this.pageSize();
    const sortBy = this.currentSortField();
    const order = this.currentSortDirection();

    this.apiService.getProducts(skip, limit, sortBy, order).subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.totalProducts.set(response.total);
        this.dataSource.data = response.products;
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.snackBar.open(error.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
    this.loadProducts();
  }

  sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.currentSortField.set(undefined);
      this.currentSortDirection.set('asc');
    } else {
      this.currentSortField.set(sort.active);
      this.currentSortDirection.set(sort.direction as SortOrder);
    }
    
    // Reset to first page when sorting
    this.pageIndex.set(0);
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    
    // Reload data with new sort parameters
    this.loadProducts();
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
} 