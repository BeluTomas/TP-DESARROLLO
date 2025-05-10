import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
    
      {
        path: 'users',
        loadChildren: () =>
          import('../modules/users/users.module').then(
            (m) => m.UsersModule
          ),
      },
      {
        path: 'categorias',
        loadChildren: () =>
          import('../modules/categories/categories.module').then(
            (m) => m.CategoriesModule
          ),
      },
      {
        path: 'productos',
        loadChildren: () =>
          import('../modules/product/product.module').then(
            (m) => m.ProductModule
          ),
      },
      {
        path: 'sliders',
        loadChildren: () =>
          import('../modules/sliders/sliders.module').then(
            (m) => m.SlidersModule
          ),
      },
      {
        path: 'cupones',
        loadChildren: () =>
          import('../modules/cupone/cupone.module').then(
            (m) => m.CuponeModule
          ),
      },
      {
        path: 'descuento',
        loadChildren: () =>
          import('../modules/discount/discount.module').then(
            (m) => m.DiscountModule
          ),
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'error/404',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
