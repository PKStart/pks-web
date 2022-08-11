import { Shortcut, ShortcutCategory, UUID } from 'pks-common'
import { ShortcutsByCategory } from './shortcuts.types'

export function distributeShortcuts(shortcuts: Shortcut[]): {
  byCategory: ShortcutsByCategory
  byId: Record<UUID, Shortcut>
} {
  const byId: Record<UUID, Shortcut> = {}
  const byCategory: ShortcutsByCategory = {
    [ShortcutCategory.TOP]: [],
    [ShortcutCategory.CODING]: [],
    [ShortcutCategory.GOOGLE]: [],
    [ShortcutCategory.FUN]: [],
    [ShortcutCategory.OTHERS]: [],
  }
  shortcuts.forEach(s => {
    byId[s.id] = s
    byCategory[s.category].push(s)
  })
  Object.values(byCategory).forEach((list: Shortcut[]) => {
    list.sort((a, b) => a.priority - b.priority)
  })
  return { byId, byCategory }
}
