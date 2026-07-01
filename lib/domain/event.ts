export interface Event {

  id: string

  type: string

  occurredAt: Date

  source: string

  payload: unknown

}