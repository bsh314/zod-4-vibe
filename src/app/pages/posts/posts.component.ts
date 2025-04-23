import { Component, OnInit, signal, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, Sort, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { Post } from '../../models/post.model';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card>
      <mat-card-header class="header">
        <mat-card-title>Posts</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="loading-container" *ngIf="loading()">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <div class="table-container" [class.loading]="loading()">
          <table mat-table [dataSource]="dataSource" matSort>
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Title</th>
              <td mat-cell *matCellDef="let post">{{post.title}}</td>
            </ng-container>

            <ng-container matColumnDef="body">
              <th mat-header-cell *matHeaderCellDef>Content</th>
              <td mat-cell *matCellDef="let post" class="body-cell">{{post.body}}</td>
            </ng-container>

            <ng-container matColumnDef="tags">
              <th mat-header-cell *matHeaderCellDef>Tags</th>
              <td mat-cell *matCellDef="let post">
                <mat-chip-set>
                  <mat-chip *ngFor="let tag of post.tags">{{tag}}</mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <ng-container matColumnDef="reactions">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Reactions</th>
              <td mat-cell *matCellDef="let post">
                <div class="reactions">
                  <span class="reaction">
                    <mat-icon class="like-icon">thumb_up</mat-icon> {{post.reactions.likes || 0}}
                  </span>
                  <span class="reaction">
                    <mat-icon class="dislike-icon">thumb_down</mat-icon> {{post.reactions.dislikes || 0}}
                  </span>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" colspan="4">No posts found</td>
            </tr>
          </table>

          <mat-paginator
            [length]="totalPosts()"
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

    .body-cell {
      max-width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .reactions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .reaction {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .like-icon {
      color: #4CAF50;
    }

    .dislike-icon {
      color: #F44336;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 20px;
    }

    .loading {
      opacity: 0.5;
    }

    .table-container {
      position: relative;
      min-height: 200px;
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
export class PostsComponent implements OnInit, AfterViewInit {
  posts = signal<Post[]>([]);
  totalPosts = signal<number>(0);
  loading = signal<boolean>(false);
  pageSize = signal<number>(10);
  pageIndex = signal<number>(0);
  displayedColumns: string[] = ['title', 'body', 'tags', 'reactions'];
  dataSource = new MatTableDataSource<Post>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  loadPosts(): void {
    this.loading.set(true);
    const skip = this.pageIndex() * this.pageSize();
    const limit = this.pageSize();

    this.apiService.getPosts(skip, limit).subscribe({
      next: (response) => {
        this.posts.set(response.posts);
        this.totalPosts.set(response.total);
        this.dataSource.data = response.posts;
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
    this.loadPosts();
  }
} 