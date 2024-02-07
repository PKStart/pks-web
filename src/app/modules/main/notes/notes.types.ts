import { UUID } from '@kinpeter/pk-common'

export interface NoteToggleEvent {
  id: UUID
  newValue: boolean
}
