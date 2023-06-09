import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {HomeComponent} from "./components/pages/home/home.component";
import {LoginComponent} from "./components/pages/login/login.component";
import {RegisterComponent} from "./components/pages/register/register.component";
import {DashboardComponent} from "./components/pages/dashboard/dashboard.component";
import {CreateGameComponent} from "./components/pages/create-game/create-game.component";
import {CreateUsersComponent} from "./components/pages/create-users/create-users.component";
import {EditGameComponent} from "./components/pages/edit-game/edit-game.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home',component: HomeComponent},
  {path: 'login', component: LoginComponent, canActivate: []},
  {path: 'register', component: RegisterComponent, canActivate: []},
  {path: 'dashboard', component: DashboardComponent, canActivate: []},
  {path: 'create-game', component: CreateGameComponent, canActivate: []},
  {path: 'create-users', component: CreateUsersComponent, canActivate: []},
  {path: 'edit-game/:game_name/:idgame', component: EditGameComponent, canActivate: []},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
