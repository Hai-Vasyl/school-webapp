import { IField } from "../interfaces"
import { isEmpty, isLength, isUnique } from "./snippets"
import { Chat } from "../models"

export const createEditValid = async (fields: IField, id?: string) => {
  try {
    let { title, type } = fields

    title = { value: title, msg: [] }
    type = { value: type, msg: [] }
    title = isEmpty(title, "Це поле не може бути порожнім!")
    type = isEmpty(type, "Це поле не може бути порожнім!")
    if (title.msg.length || type.msg.length) {
      return { title, type, isError: true }
    }

    title = isLength(title, {
      min: 3,
      max: 15,
      minMsg: "Назва чату повинна містити принаймні 3 символи!",
      maxMsg: "Назва чату повинна містити не більше 15 символів!",
    })
    if (title.msg.length) {
      return { title, type, isError: true }
    }

    title = await isUnique(
      title,
      "Ця назва чату вже існує, оберіть іншу!",
      Chat,
      "title",
      id
    )
    if (title.msg.length) {
      return { title, type, isError: true }
    }
    return { title, type, isError: false }
  } catch (error) {
    const errorMsg = `Помилка перевірки полів вводу при створенні або редагуванні чату: ${error.message}`

    const setError = (value: string) => {
      return { value, msg: [errorMsg] }
    }
    return {
      title: setError(fields.title),
      type: setError(fields.type),
      isError: true,
    }
  }
}
