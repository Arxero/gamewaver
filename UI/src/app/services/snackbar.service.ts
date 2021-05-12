import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  showInfo(message: string, duration?: number) {
    this.snackBar.open(message, 'CLOSE', {
      duration: duration ? duration : 5000,
      panelClass: ['snackbar', 'info'],
    });
  }

  showWarn(message: string, duration?: number) {
    this.snackBar.open(message, 'CLOSE', {
      duration: duration ? duration : 5000,
      panelClass: ['snackbar', 'warn'],
    });
  }
}
