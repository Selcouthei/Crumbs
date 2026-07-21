import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]',
  standalone: true,
})
export class OnlyNumbersDirective {
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'End',
      'Home',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text') ?? '';

    if (!/^\d+$/.test(pastedText)) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  onInput(): void {
    const value = this.el.value;
    this.el.value = value.replace(/[^\d]/g, '');
  }
}
