import { AfterViewInit, Component, OnInit, viewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatPaginator,MatSort,
    MatTableModule,MatFormFieldModule,
    MatInputModule,MatMenuModule,NgIf
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [];
  loggedInUser: any;
  dataSource = new MatTableDataSource<any>([]);
  activeData: 'users' | 'news' = 'news';

  readonly paginator = viewChild.required(MatPaginator);
  readonly sort = viewChild.required(MatSort);


  constructor(private userService: UserService, private router: Router) {} // Inyecta Router

  ngOnInit(): void {
    this.loggedInUser = this.userService.getLoggedInUser(); // Recupera el usuario desde localStorage
    if (!this.loggedInUser) {
      this.router.navigate(['/login']); // Redirige al login si no hay usuario logueado
    } else {
      this.loadData(); // Carga los datos si hay un usuario logueado
    }
  }
  
  loadData(): void {
    if (this.activeData === 'users') {
      this.userService.getUsers().subscribe((data) => {
        this.dataSource.data = data;
        this.displayedColumns = ['id', 'name', 'email', 'role'];
      });
    } else {
      this.userService.getNews().subscribe((data) => {
        // Añadir un ID autoincrementable a cada noticia
        const articlesWithId = data.articles.map((article: any, index: number) => ({
          id: index + 1, // Generar un ID autoincrementable
          ...article, // Mantener los datos originales
        }));
        this.dataSource.data = articlesWithId;
        this.displayedColumns = ['id', 'author', 'title', 'imagen', 'info', 'edit', 'delete'];
       });
    }
  }
  
  // Método para manejar acciones de botones
  handleAction(action: string, row: any): void {
    switch (action) {
      case 'info':
        this.showInfoModal(row);
        break;
      case 'edit':
        this.showEditModal(row);
        break;
      case 'delete':
        this.showDeleteModal(row);
        break;
      default:
        break;
    }
  }
  showInfoModal(row: any): void {

    Swal.fire({
      title: 'Más información de la noticia',
      imageUrl:row.urlToImage,
      imageHeight:180,
      imageWidth:250,
      html: `<strong>Autor:</strong> ${row.author || 'N/A'}<br>
             <strong>Título:</strong> ${row.title}<br>
             <strong>Descripción:</strong> ${row.description || 'Sin descripción'}`,

      confirmButtonText: 'Cerrar'
    });
  }

  showInfoUser(): void {
    if (!this.loggedInUser) {
      Swal.fire({
        title: 'Error',
        text: 'No se encontraron datos del usuario logueado.',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
      return;
    }
  
    Swal.fire({
      title: 'Información del Usuario',
      imageUrl: this.loggedInUser.avatar || '', // Si tienes un avatar asociado al usuario
      imageHeight: 100,
      imageWidth: 100,
      html: `
        <strong>Nombre:</strong> ${this.loggedInUser.name || 'N/A'}<br>
        <strong>Rol:</strong> ${this.loggedInUser.role || 'Sin rol'}<br>
        <strong>Correo:</strong> ${this.loggedInUser.email || 'Sin correo'}`,
    
      confirmButtonText: 'Cerrar'
    });
  }
  

  showEditModal(row: any): void {
    Swal.fire({
      title: 'Editar Noticia',
      html: `<label for="edit-title">Título</label><br>
             <input id="edit-title" class="swal2-input" value="${row.title}"><br>
             <label for="edit-author">Autor</label><br>
             <input id="edit-author" class="swal2-input" value="${row.author}">`,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const title = (document.getElementById('edit-title') as HTMLInputElement).value;
        const author = (document.getElementById('edit-author') as HTMLInputElement).value;
        if (!title || !author) {
          Swal.showValidationMessage('Ambos campos son obligatorios');
        }
        return { title, author };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Actualizar solo en la tabla, no en la API
        row.title = result.value?.title;
        row.author = result.value?.author;
        this.dataSource.data = [...this.dataSource.data];
        Swal.fire('Guardado', 'Los cambios han sido aplicados.', 'success');
      }
    });
  }

  showDeleteModal(row: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará la fila seleccionada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Eliminar solo de la tabla
        this.dataSource.data = this.dataSource.data.filter((item) => item !== row);
        Swal.fire('Eliminado', 'La fila ha sido eliminada.', 'success');
      }
    });
  }

  
  switchData(type: 'users' | 'news'): void {
    this.activeData = type;
    this.loadData();
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator();
    this.dataSource.sort = this.sort();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  logout(): void {
    this.userService.clearLoggedInUser(); // Elimina al usuario del almacenamiento
    this.router.navigate(['/login']); // Redirige al login
  }
  
}
