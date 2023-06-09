import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {HomeComponent} from "./components/pages/home/home.component";
import {LoginComponent} from "./components/pages/login/login.component";
import {RegisterComponent} from "./components/pages/register/register.component";
import {DashboardComponent} from "./components/pages/dashboard/dashboard.component";
import {CreateGameComponent} from "./components/pages/create-game/create-game.component";
import {EditGameComponent} from "./components/pages/edit-game/edit-game.component";
import {ConnectedGuard} from "./guards/connected-guard";
import {DisconnectedGuard} from "./guards/disconnected-guard";
import {MessageComponent} from "./components/pages/message/message.component";
import {GameDetailsComponent} from "./components/pages/game-details/game-details.component";
import {ImportCsvComponent} from "./components/pages/import-csv/import-csv.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home',component: HomeComponent},
  {path: 'login', component: LoginComponent, canActivate: [ConnectedGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [ConnectedGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [DisconnectedGuard]},
  {path: 'create-game', component: CreateGameComponent, canActivate: [DisconnectedGuard]},
  {path: 'import-csv/:gameId', component: ImportCsvComponent, canActivate: [DisconnectedGuard]},
  {path: 'edit-game/:gameName/:gameId', component: EditGameComponent, canActivate: [DisconnectedGuard]},
  {path: 'game/:gameId', component: GameDetailsComponent, canActivate: [DisconnectedGuard]},
  {path: 'message/:gameId', component: MessageComponent, canActivate: [DisconnectedGuard]},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
