import { Component, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../services/api.service';
import { Post } from '../../models/post.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatChipsModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Posts</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="posts()" matSort (matSortChange)="sortData($event)">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Title</th>
            <td mat-cell *matCellDef="let post">{{post.title}}</td>
          </ng-container>

          <ng-container matColumnDef="body">
            <th mat-header-cell *matHeaderCellDef>Content</th>
            <td mat-cell *matCellDef="let post">{{post.body}}</td>
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
            <td mat-cell *matCellDef="let post">{{post.reactions}}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator
          [length]="totalPosts()"
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

    .mat-column-body {
      max-width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class PostsComponent implements OnInit {
  posts = signal<Post[]>([]);
  totalPosts = signal<number>(0);
  displayedColumns: string[] = ['title', 'body', 'tags', 'reactions'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(skip: number = 0): void {
    this.apiService.getPosts(skip).subscribe(response => {
      this.posts.set(response.posts);
      this.totalPosts.set(response.total);
    });
  }

  onPageChange(event: PageEvent): void {
    this.loadPosts(event.pageIndex * event.pageSize);
  }

  sortData(sort: Sort): void {
    const data = this.posts().slice();
    if (!sort.active || sort.direction === '') {
      this.posts.set(data);
      return;
    }

    const sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title':
          return compare(a.title, b.title, isAsc);
        case 'reactions':
          return compare(a.reactions, b.reactions, isAsc);
        default:
          return 0;
      }
    });

    this.posts.set(sortedData);
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
} 