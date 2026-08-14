import { Component, inject, signal } from '@angular/core';
import AuthService from '../../core/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { LogoComponent } from '@atoms/logo';

@Component({
  selector: 'jbt-login',
  imports: [ButtonModule, InputTextModule, FloatLabelModule, LogoComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  public loginModel = signal
  public login(): void{
    this.authService.login().subscribe((success) => {
      if(success){
        this.router.navigate(['/grocery-list']);
      }
    });
  }
}
