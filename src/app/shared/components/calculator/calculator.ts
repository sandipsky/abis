import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Button } from '../button/button';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.html',
  styleUrls: ['./calculator.scss'],
  imports: [CommonModule, FormsModule, Button],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Calculator {
  readonly input = signal<string>('');
  readonly result = signal<string>('0');

  public dialogRef = inject(MatDialogRef<Calculator>);
  public dialog = inject(MatDialog);
  public data = inject(MAT_DIALOG_DATA);

  readonly buttonsArray = [
    { label: 'CE', type: 'action' }, { label: 'C', type: 'action' }, { label: '%', type: 'operator' }, { label: '/', type: 'operator' },
    { label: '7', type: 'number' }, { label: '8', type: 'number' }, { label: '9', type: 'number' }, { label: '*', type: 'operator' },
    { label: '4', type: 'number' }, { label: '5', type: 'number' }, { label: '6', type: 'number' }, { label: '-', type: 'operator' },
    { label: '1', type: 'number' }, { label: '2', type: 'number' }, { label: '3', type: 'number' }, { label: '+', type: 'operator' },
    { label: '', type: 'empty' }, { label: '0', type: 'number' }, { label: '.', type: 'decimal' }, { label: '=', type: 'equal' }
  ];

  addKey(button: string): void {
    const operators = ['+', '-', '*', '/', '.'];
    const currentInput = this.input();

    // 1. Clear Logic
    if (button === 'C' || button === 'CE') {
      this.input.set('');
      this.result.set('0');
      return;
    }

    // 2. Calculation Logic
    if (button === '=') {
      try {
        const calculate = new Function(`return ${currentInput}`);
        const calculated = calculate();
        this.result.set(calculated.toString());
      } catch (e) {
        this.result.set('Error');
      }
      return;
    }

    // 3. Percentage Logic
    if (button === '%') {
      const match = currentInput.match(/(.+?)([+\-*/])(\d+(\.\d+)?)$/);
      if (match) {
        const fullExpr = match[1];
        const operator = match[2];
        const percentValue = parseFloat(match[3]);
        const replacement = percentValue / 100;
        this.input.set(fullExpr + operator + replacement);
      }
      return;
    }

    // 4. Input Validation & Formatting
    const lastChar = currentInput[currentInput.length - 1];

    if (currentInput.length === 0 && (operators.includes(button) || button === '0')) {
      return;
    }

    if (operators.includes(button) && operators.includes(lastChar)) {
      return;
    }

    // Prevent leading zeros like "09"
    if (currentInput === '0' && !operators.includes(button)) {
      return;
    }

    this.input.update(val => val + button);
  }

  onKeyUp(event: KeyboardEvent): void {
    const key = event.key;
    const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '=', 'Enter', 'Backspace', '%', 'C', 'c', '.'];

    if (!validKeys.includes(key)) return;

    if (key === 'Enter' || key === '=') {
      this.addKey('=');
    } else if (key === 'Backspace') {
      this.input.update(val => val.slice(0, -1));
    } else if (key.toUpperCase() === 'C') {
      this.addKey('C');
    } else {
      this.addKey(key);
    }
  }
}
