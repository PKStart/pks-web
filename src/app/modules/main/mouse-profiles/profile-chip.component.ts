import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'pk-profile-chip',
  template: `<button [class.static]="static" (click)="handleClick()">
    <mat-icon *ngIf="default" class="material-icons-outlined mouse-icon">mouse</mat-icon>
    <mat-icon *ngIf="!default" class="material-icons-outlined">sports_esports</mat-icon>
    <span>{{ name }}</span>
  </button>`,
  styles: [
    // language=scss
    `
      button {
        outline: none;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-weight: 600;
        padding: 2px 12px 2px 8px;
        border-radius: 12px;
        background-color: var(--color-bg-alt);
        color: var(--color-text);
        margin-left: 0.5rem;

        &.static {
          cursor: unset;
        }

        &:not(.static):hover {
          opacity: 0.8;
          color: var(--color-accent);
        }

        mat-icon {
          margin-right: 0.35rem;
          color: var(--color-accent);
        }

        .mouse-icon {
          font-size: 20px;
          position: relative;
          top: 2px;
          margin-right: 0.25rem;
        }
      }
    `,
  ],
})
export class ProfileChipComponent {
  @Input() default!: boolean
  @Input() name!: string
  @Input() abbreviation? = 'default'
  @Input() static? = false

  @Output() clicked: EventEmitter<string> = new EventEmitter<string>()

  public handleClick(): void {
    if (this.static) return
    this.clicked.emit(this.abbreviation)
  }
}
