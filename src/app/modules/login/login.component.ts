import { Component, inject } from '@angular/core';
import AuthService from '../../core/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'jbt-login',
  imports: [ButtonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  public login(): void{
    this.authService.login().subscribe((success) => {
      if(success){
        this.router.navigate(['/grocery-list']);
      }
    });
  }
}
