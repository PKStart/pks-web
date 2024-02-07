import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { UUID } from '@kinpeter/pk-common'
import { ShortcutCategory } from '../../../constants/enums'
import { filter, switchMap } from 'rxjs/operators'
import { defaultDialogConfig } from '../../../constants/constants'
import { ConfirmationService } from '../../shared/services/confirmation.service'
import { NotificationService } from '../../shared/services/notification.service'
import { ShortcutDialogComponent } from './shortcut-dialog.component'
import { ShortcutsService } from './shortcuts.service'
import { parseError } from '../../../utils/parse-error'

@Component({
  selector: 'pk-shortcuts',
  template: `
    <pk-shortcuts-menu
      (clickMenu)="onClickMenu($event)"
      (enterMenu)="onEnterMenu($event)"
      (mouseLeave)="onMouseLeave()"
      (addNew)="onAddShortcut()"
    ></pk-shortcuts-menu>
    <div *ngIf="showShortcuts" class="shortcuts-backdrop" (click)="onClickBackdrop()"></div>
    <div class="shortcuts" *ngIf="showShortcuts && (shortcuts | async)">
      <pk-shortcut
        *ngFor="let sc of (shortcuts | async)![selectedCategory]"
        [shortcut]="sc"
        (clicked)="onClickBackdrop()"
        (edit)="onClickEdit($event)"
        (delete)="onClickDelete($event)"
      ></pk-shortcut>
    </div>
  `,
  styles: [
    // language=scss
    `
      .shortcuts-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background-color: var(--color-bg-opaque);
        backdrop-filter: blur(2px);
        z-index: 1;
      }

      .shortcuts {
        position: absolute;
        z-index: 2;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        top: calc(100vh / 2 - 300px);
        left: calc(100vw / 2 - 200px);
        max-width: 400px;
        max-height: 600px;
        overflow-y: auto;

        @media (min-width: 800px) {
          top: calc(100vh / 2 - 190px);
          left: calc(100vw / 2 - 385px);
          max-width: 770px;
          max-height: 380px;
        }
      }
    `,
  ],
})
export class ShortcutsComponent {
  public showShortcuts = false
  public mouseHover = false
  public selectedCategory: ShortcutCategory = ShortcutCategory.TOP
  public shortcuts = this.shortcutsService.shortcuts$

  constructor(
    private shortcutsService: ShortcutsService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    private matDialog: MatDialog
  ) {}

  public onClickMenu(category: ShortcutCategory): void {
    this.selectedCategory = category
    this.showShortcuts = true
  }

  public onEnterMenu(category: ShortcutCategory): void {
    this.selectedCategory = category
    this.onMouseEnter()
  }

  public onClickBackdrop(): void {
    this.showShortcuts = false
  }

  public onMouseEnter(): void {
    this.mouseHover = true
    setTimeout(() => {
      if (this.mouseHover) {
        this.showShortcuts = true
      }
    }, 500)
  }

  public onMouseLeave(): void {
    this.mouseHover = false
  }

  public onAddShortcut(): void {
    this.matDialog
      .open(ShortcutDialogComponent, defaultDialogConfig)
      .afterClosed()
      .pipe(
        filter(values => values),
        switchMap(request => this.shortcutsService.createShortcut(request))
      )
      .subscribe({
        next: () => this.shortcutsService.fetchShortcuts(),
        error: e =>
          this.notificationService.showError('Could not create shortcut. ' + parseError(e)),
      })
  }

  public onClickEdit(id: UUID): void {
    const shortcut = this.shortcutsService.getById(id)
    this.matDialog
      .open(ShortcutDialogComponent, { ...defaultDialogConfig, data: shortcut })
      .afterClosed()
      .pipe(
        filter(values => values),
        switchMap(request => this.shortcutsService.updateShortcut({ ...request }, id))
      )
      .subscribe({
        next: () => this.shortcutsService.fetchShortcuts(),
        error: e =>
          this.notificationService.showError('Could not update shortcut. ' + parseError(e)),
      })
  }

  public onClickDelete(id: UUID): void {
    const shortcut = this.shortcutsService.getById(id)
    this.confirmationService
      .question(`Do you really want to delete the shortcut of ${shortcut.name}?`)
      .pipe(
        filter(isConfirmed => isConfirmed),
        switchMap(() => this.shortcutsService.deleteShortcut(id))
      )
      .subscribe({
        next: () => this.shortcutsService.fetchShortcuts(),
        error: e =>
          this.notificationService.showError('Could not delete shortcut. ' + parseError(e)),
      })
  }
}
