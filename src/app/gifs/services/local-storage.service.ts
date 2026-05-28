import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorage {
  public setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}
