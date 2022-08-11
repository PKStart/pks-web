import { UUID } from 'pks-common'

export interface NoteToggleEvent {
  id: UUID
  newValue: boolean
}
