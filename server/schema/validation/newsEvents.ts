import { IField, IFieldsMod } from "../interfaces"
import { isEmpty, isLength } from "./snippets"

export const createEditValid = async (fields: IField) => {
  try {
    let fieldsMod: IFieldsMod = {}
    let isError: boolean = false
    Object.keys(fields).forEach((key: string) => {
      let field = { value: fields[key], msg: [] }
      fieldsMod[key] = isEmpty(field, "Це поле не може бути порожнім!")
      if (fieldsMod[key].msg.length) {
        isError = true
      }
    })

    let { title, content, dateEvent } = fieldsMod
    if (isError) {
      return { title, content, dateEvent, isError }
    }

    title = isLength(title, {
      min: 5,
      max: 150,
      minMsg: "Заголовок повинен містити принаймні 5 символів!",
      maxMsg: "Заголовок повинен містити не більше 150 символів!",
    })

    if (title.msg.length) {
      return { title, content, dateEvent, isError: true }
    }

    return { title, content, dateEvent, isError: false }
  } catch (error) {
    const errorMsg = `Помилка перевірки полів вводу при створенні або редагуванні новин або подій: ${error.message}`

    const setError = (value: string) => {
      return { value, msg: [errorMsg] }
    }
    return {
      title: setError(fields.title),
      content: setError(fields.title),
      dateEvent: setError(fields.title),
      isError: true,
    }
  }
}
