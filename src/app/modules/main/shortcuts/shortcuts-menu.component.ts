import { Component, Output, EventEmitter, ViewChild } from '@angular/core'
import { MatMenuTrigger } from '@angular/material/menu'
import { ShortcutCategory } from 'pks-common'
import { ShortcutsService } from './shortcuts.service'

@Component({
  selector: 'pk-shortcuts-menu',
  template: `
    <div class="shortcuts-menu" (contextmenu)="onRightClick($event)">
      <div class="menu-trigger" [matMenuTriggerFor]="shortcutMenu"></div>
      <ng-container *ngIf="(loading$ | async) === false">
        <button
          (click)="clickMenu.emit(category.TOP)"
          (mouseenter)="enterMenu.emit(category.TOP)"
          (mouseleave)="mouseLeave.emit()"
        >
          <mat-icon>star</mat-icon>
        </button>
        <button
          (click)="clickMenu.emit(category.CODING)"
          (mouseenter)="enterMenu.emit(category.CODING)"
          (mouseleave)="mouseLeave.emit()"
        >
          <mat-icon>code</mat-icon>
        </button>
        <button
          (click)="clickMenu.emit(category.GOOGLE)"
          (mouseenter)="enterMenu.emit(category.GOOGLE)"
          (mouseleave)="mouseLeave.emit()"
        >
          <mat-icon svgIcon="google" class="google"></mat-icon>
        </button>
        <button
          (click)="clickMenu.emit(category.FUN)"
          (mouseenter)="enterMenu.emit(category.FUN)"
          (mouseleave)="mouseLeave.emit()"
        >
          <mat-icon>mood</mat-icon>
        </button>
        <button
          (click)="clickMenu.emit(category.OTHERS)"
          (mouseenter)="enterMenu.emit(category.OTHERS)"
          (mouseleave)="mouseLeave.emit()"
        >
          <mat-icon>more_horiz</mat-icon>
        </button>
      </ng-container>
      <mat-spinner *ngIf="loading$ | async" diameter="40" color="accent"></mat-spinner>
    </div>
    <mat-menu #shortcutMenu="matMenu" class="add-shortcut-context-menu">
      <button mat-menu-item (click)="addNew.emit()">
        <mat-icon>add</mat-icon>
        <span>Add shortcut</span>
      </button>
    </mat-menu>
  `,
  styles: [
    // language=scss
    `
      .shortcuts-menu {
        width: 318px;
        height: 58px;
        position: absolute;
        bottom: 0;
        left: calc(100vw / 2 - 318px / 2);
        background-color: var(--color-bg-alt);
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        z-index: 2;

        button {
          border: none;
          background: none;
          color: var(--color-text);
          display: flex;
          align-items: center;

          &:hover {
            color: var(--color-primary);
            cursor: pointer;
          }
        }

        mat-icon:not(.google) {
          font-size: 40px;
          width: 40px;
          height: 40px;
        }

        mat-icon.google {
          font-size: 34px;
          width: 34px;
          height: 34px;
        }

        .menu-trigger {
          position: relative;
          top: -30px;
          left: 70px;
        }
      }
    `,
  ],
})
export class ShortcutsMenuComponent {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger

  @Output() public mouseLeave = new EventEmitter<void>()
  @Output() public clickMenu = new EventEmitter<ShortcutCategory>()
  @Output() public enterMenu = new EventEmitter<ShortcutCategory>()
  @Output() public addNew = new EventEmitter<void>()

  public category = ShortcutCategory
  public loading$ = this.shortcutsService.loading$

  constructor(private shortcutsService: ShortcutsService) {}

  public onRightClick(e: MouseEvent): void {
    e.preventDefault()
    this.trigger.openMenu()
  }
}
