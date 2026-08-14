import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export default class AuthService {
  private readonly _isAuthenticated = signal(false);
  public readonly isAuthenticated = this._isAuthenticated.asReadonly();
}