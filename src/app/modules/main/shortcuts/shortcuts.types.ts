import { Shortcut } from '@kinpeter/pk-common'
import { ShortcutCategory } from '../../../constants/enums'

// export interface ShortcutsByCategory {
//   [ShortcutCategory.TOP]: Shortcut[]
//   [ShortcutCategory.CODING]: Shortcut[]
//   [ShortcutCategory.GOOGLE]: Shortcut[]
//   [ShortcutCategory.CYCLING]: Shortcut[]
//   [ShortcutCategory.FUN]: Shortcut[]
//   [ShortcutCategory.OTHERS]: Shortcut[]
// }

export type ShortcutsByCategory = Record<ShortcutCategory, Shortcut[]>
