import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ExperienciaService } from '../../services/experiencia.service';
import { User } from '../../models/user.model';
import { Experiencia } from '../../models/experiencia.model';
import { FormsModule } from '@angular/forms'; // Importa FormsModule en el componente


@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css'
})
export class BuscadorComponent {
  searchQuery: string = '';
  user: User | null = null;
  experiences: Experiencia[] = [];
  userNotFound: boolean = false;

  constructor(
    private userService: UserService,
    private experienciaService: ExperienciaService
  ) {}

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      return;
    }

    // Buscar usuario
    this.userService.searchUser(this.searchQuery).subscribe(
      (users) => {
        if (users && users.length > 0) {
          this.user = users[0]; // Asumiendo que obtenemos el primer usuario encontrado
          if(this.user && this.user._id) {
            this.loadExperiences(this.user._id!);
          }
        } else {
          this.userNotFound = true;
          this.user = null;
          this.experiences = [];
        }
      },
      (error) => {
        console.error('Error al buscar usuario', error);
        this.userNotFound = true;
        this.user = null;
        this.experiences = [];
      }
    );
  }

  loadExperiences(userId: string): void {
    this.experienciaService.getExperienciasByUserId(userId).subscribe(
      (experiences) => {
        this.experiences = experiences;
        this.userNotFound = false;
      },
      (error) => {
        console.error('Error al cargar experiencias', error);
        this.experiences = [];
      }
    );
  }
}
