import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../posts/auth.service';


@Component({
  selector: 'app-signup',
  imports: [MatFormFieldModule, FormsModule, MatCardModule, MatProgressSpinnerModule, MatInputModule, MatButtonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  isLoading = false;
  authService = inject(AuthService)

    onSubmit(form: NgForm) {
      if(form.invalid) {
        return
      }
      this.authService.addUser(form.value.email, form.value.password);
      form.resetForm();
    }
}

