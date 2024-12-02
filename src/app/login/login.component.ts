import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common'; 
import { UserService } from '../services/user.service';          // Importar el servicio
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,      
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatSnackBarModule, MatStepperModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  remail: string = '';
  rpassword: string = '';
  rconfirmPassword: string = '';

  constructor(private router: Router, private userService: UserService, private snackBar: MatSnackBar) {}

  iniciarPagina() {
    if (this.email && this.password) {
      this.userService.getUsers().subscribe(
        (users) => {
          const user = users.find(u => u.email === this.email && u.password === this.password);
          if (user) {
            this.userService.setLoggedInUser(user); // Guarda al usuario logueado en localStorage
            this.router.navigate(['/user-list']); // Redirige a la lista de usuarios
          } else {
            this.snackBar.open('Credenciales incorrectas', 'Cerrar', { duration: 3000 });
          }
        },
        (error) => {
          console.error('Error al obtener los usuarios', error);
          this.snackBar.open('Error al obtener los usuarios', 'Cerrar', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Por favor complete los campos', 'Cerrar', { duration: 3000 });
    }
  }
  

}
