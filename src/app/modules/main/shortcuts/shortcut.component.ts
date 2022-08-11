import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { MatMenuTrigger } from '@angular/material/menu'
import { Shortcut, UUID } from 'pks-common'
import { SettingsStore } from '../../shared/services/settings.store'

@Component({
  selector: 'pk-shortcut',
  template: `
    <button class="shortcut" (click)="onOpen()" (contextmenu)="onRightClick($event)">
      <img [src]="iconUrl" [alt]="shortcut.name" />
      <p>{{ shortcut.name }}</p>
      <div class="menu-trigger" [matMenuTriggerFor]="shortcutMenu"></div>
    </button>
    <mat-menu #shortcutMenu="matMenu" class="shortcut-context-menu">
      <button mat-menu-item (click)="edit.emit(shortcut.id)">
        <mat-icon>edit</mat-icon>
        <span>Edit shortcut</span>
      </button>
      <button mat-menu-item (click)="delete.emit(shortcut.id)">
        <mat-icon>delete</mat-icon>
        <span>Delete shortcut</span>
      </button>
    </mat-menu>
  `,
  styles: [
    // language=scss
    `
      button.shortcut {
        border: none;
        background: none;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 120px;

        &:hover {
          cursor: pointer;
          background-color: var(--color-bg-opaque-lighter);
          border-radius: 8px;
        }

        img {
          width: 48px;
          height: 48px;
        }

        p {
          margin: 0.65rem 0 0;
          color: var(--color-text-on-dark);
          text-align: center;
          max-width: 100%;
          white-space: pre-wrap;
          text-overflow: ellipsis;
          font-size: 1rem;
        }
      }

      .menu-trigger {
        position: relative;
        top: -40px;
      }
    `,
  ],
})
export class ShortcutComponent {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger

  @Input() shortcut!: Shortcut

  @Output() clicked = new EventEmitter<void>()
  @Output() edit = new EventEmitter<UUID>()
  @Output() delete = new EventEmitter<UUID>()

  constructor(private settingsStore: SettingsStore) {}

  public get iconUrl(): string {
    if (this.shortcut.iconUrl.startsWith('http')) {
      return this.shortcut.iconUrl
    }
    return `${this.settingsStore.shortcutIconBaseUrl}${this.shortcut.iconUrl}`
  }

  public onOpen(): void {
    this.clicked.emit()
    setTimeout(() => {
      window.open(this.shortcut.url, '_blank')
    })
  }

  public onRightClick(e: MouseEvent): void {
    e.preventDefault()
    this.trigger.openMenu()
  }
}
