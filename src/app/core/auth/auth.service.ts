import { Injectable, signal } from "@angular/core";
import { Observable, of, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export default class AuthService {
  private readonly _isAuthenticated = signal(false);
  public readonly URL_LOGIN = '/login';
  public readonly URL_ENTRY_POINT = '/grocery-list';
  public readonly isAuthenticated = this._isAuthenticated.asReadonly();
  public login(): Observable<boolean>{
    return of(true).pipe(tap(() => {
      this._isAuthenticated.set(true);
    }))
  }
}