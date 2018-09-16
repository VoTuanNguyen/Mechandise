import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { ManageComponent } from "./components/manage/manage.component";
import { ProductsComponent } from "./components/products/products.component";

import { IndexComponent } from './components/index/index.component';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: "full",
		redirectTo: "home"
	},
	{
		path: "home",
		component: HomeComponent,
		children: [
			{
				path: '',
				component: IndexComponent
			},
			{
				path: 'product',
				component: ProductsComponent
			}
		]
	},
	{
		path: "manage",
		component: ManageComponent,
		children: [
			{
				path: '',
				component: AdminComponent
			},
		]
	}

]

export const routing = RouterModule.forRoot(routes);