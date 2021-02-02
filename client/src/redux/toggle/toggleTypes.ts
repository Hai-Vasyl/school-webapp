export const DROPDOWN_TOGGLE = "DROPDOWN_TOGGLE"
export const AUTHFORM_TOGGLE = "AUTHFORM_TOGGLE"
export const CHAT_TOGGLE = "CHAT_TOGGLE"
export const CHAT_OPEN = "CHAT_OPEN"
export const WARNING_OPEN = "WARNING_OPEN"
export const WARNING_CLOSE = "WARNING_CLOSE"
export const NOTIFICATIONS_TOGGLE = "NOTIFICATIONS_TOGGLE"
export const RESET_TOGGLE = "RESET_TOGGLE"
export const MODIMAGE_OPEN = "MODIMAGE_OPEN"
export const MODIMAGE_CLOSE = "MODIMAGE_CLOSE"

export interface ToggleDropDown {
  type: typeof DROPDOWN_TOGGLE
}
export interface ToggleAuthForm {
  type: typeof AUTHFORM_TOGGLE
}
export interface NotificationsToggle {
  type: typeof NOTIFICATIONS_TOGGLE
}
export interface ChatToggle {
  type: typeof CHAT_TOGGLE
}
export interface ChatOpen {
  type: typeof CHAT_OPEN
}
export interface ResetToggle {
  type: typeof RESET_TOGGLE
}
export interface WarningOpen {
  type: typeof WARNING_OPEN
  payload: {
    action(): any
    title: string
  }
}
export interface ModImageOpen {
  type: typeof MODIMAGE_OPEN
  payload: {
    id: string
    content: string
    type: string
    onCreate?(): any
    onEdit?(): any
    onRemove?(): any
  }
}
export interface WarningClose {
  type: typeof WARNING_CLOSE
}
export interface ModImageClose {
  type: typeof MODIMAGE_CLOSE
}

export type ToggleReducerTypes =
  | ToggleDropDown
  | ResetToggle
  | ToggleAuthForm
  | NotificationsToggle
  | ChatToggle
  | ChatOpen
  | WarningOpen
  | WarningClose
  | ModImageOpen
  | ModImageClose
