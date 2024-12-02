import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TablaComponent } from './tabla/tabla.component';
//import { BrowserModule } from '@angular/platform-browser';
import { UserService } from './services/user.service';
import { UserListComponent } from "./components/user-list/user-list.component";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserListComponent, CommonModule],
  providers: [UserService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'APIconsumible';
}
