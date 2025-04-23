import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/products/products.component')
      .then(m => m.ProductsComponent)
  },
  {
    path: 'posts',
    loadComponent: () => import('./pages/posts/posts.component')
      .then(m => m.PostsComponent)
  }
]; 