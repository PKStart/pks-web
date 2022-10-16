import { NgModule } from '@angular/core'
import { ShortcutsComponent } from './shortcuts.component'
import { ShortcutDialogComponent } from './shortcut-dialog.component'
import { ShortcutComponent } from './shortcut.component'
import { ShortcutsMenuComponent } from './shortcuts-menu.component'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [
    ShortcutsComponent,
    ShortcutDialogComponent,
    ShortcutComponent,
    ShortcutsMenuComponent,
  ],
  imports: [SharedModule],
  exports: [ShortcutsComponent],
})
export class ShortcutsModule {}
