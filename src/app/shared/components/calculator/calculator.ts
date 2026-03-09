import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.html',
  styleUrls: ['./calculator.scss'],
  imports: [CommonModule, FormsModule]
})
export class CalculatorComponent {
  input = '';
  result = '0';
  nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  buttonsArray = [
    { label: 'CE', type: 'action' },
    { label: 'C', type: 'action' },
    { label: '%', type: 'operator' },
    { label: '/', type: 'operator' },

    { label: '7', type: 'number' },
    { label: '8', type: 'number' },
    { label: '9', type: 'number' },
    { label: '*', type: 'operator' },

    { label: '4', type: 'number' },
    { label: '5', type: 'number' },
    { label: '6', type: 'number' },
    { label: '-', type: 'operator' },

    { label: '1', type: 'number' },
    { label: '2', type: 'number' },
    { label: '3', type: 'number' },
    { label: '+', type: 'operator' },

    { label: '', type: 'empty' },
    { label: '0', type: 'number' },
    { label: '.', type: 'decimal' },
    { label: '=', type: 'equal' }
  ];

  constructor(
    public dialogRef: MatDialogRef<CalculatorComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  addKey(button: string): void {
    const operators = ['+', '-', '*', '/', '.'];

    if (button === 'C' || button == 'CE') {
      this.input = '';
      this.result = '0';
      return;
    }

    if (button === '=') {
      try {
        this.result = eval(this.input).toString();
      } catch (e) {
        this.result = 'Error';
      }
      return;
    }

    if (button === '%') {
      const match = this.input.match(/(.+?)([+\-*/])(\d+(\.\d+)?)$/);
      if (match) {
        const fullExpr = match[1];
        const operator = match[2];
        const percentValue = parseFloat(match[3]);

        try {
          const base = eval(fullExpr);
          // const replacement = (base * percentValue) / 100;
          const replacement = (percentValue) / 100;
          this.input = fullExpr + operator + replacement;
        } catch (e) {
          this.result = 'Error';
        }
      }
      return;
    }

    const lastChar = this.input[this.input.length - 1];

    // Prevent starting with an operator
    if (this.input.length === 0 && operators.includes(button)) {
      return;
    }

    // Prevent operator after another operator
    if (operators.includes(button) && operators.includes(lastChar)) {
      return;
    }

    // Prevent starting with 0
    if (this.input.length === 0 && button === '0') {
      return;
    }

    // Prevent number starting with 0 like "09", "04"
    if (
      this.input.length >= 1 &&
      this.input.length <= 2 &&
      this.input[0] === '0' &&
      !operators.includes(button)
    ) {
      return;
    }

    this.input += button;
  }

  onKeyUp(event: KeyboardEvent): void {
    event.preventDefault();
    const key = event.key;

    // Allow digits, operators, Enter, Backspace, and %
    const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '=', 'Enter', 'Backspace', '%', 'C', 'c', '.'];

    if (!validKeys.includes(key)) {
      event.preventDefault();
      return;
    }

    if (key === 'Enter' || key === '=') {
      this.addKey('=');
    } else if (key === 'Backspace') {
      this.input = this.input.slice(0, -1);
    } else if (key.toUpperCase() === 'C') {
      this.addKey('C');
    } else {
      this.addKey(key);
    }
  }

}
