import { IField, IFieldsMod } from "../interfaces"
import { isEmpty, isLength } from "./snippets"

export const createEditValid = async (fields: IField) => {
  try {
    let fieldsMod: IFieldsMod = {}
    let isError: boolean = false
    Object.keys(fields).forEach((key: string) => {
      let field = { value: String(fields[key]), msg: [] }
      fieldsMod[key] = isEmpty(field, "Це поле не може бути порожнім!")
      if (fieldsMod[key].msg.length) {
        isError = true
      }
    })

    let { title, content, priority, url } = fieldsMod
    if (isError) {
      return { title, content, priority, url, isError }
    }

    title = isLength(title, {
      min: 3,
      max: 100,
      minMsg: "Заголовок повинен містити принаймні 3 символів!",
      maxMsg: "Заголовок повинен містити не більше 100 символів!",
    })

    if (title.msg.length) {
      return { title, content, priority, url, isError: true }
    }

    return { title, content, priority, url, isError: false }
  } catch (error) {
    const errorMsg = `Помилка перевірки полів вводу при створенні або редагуванні розділу сторінки: ${error.message}`

    const setError = (value: string) => {
      return { value, msg: [errorMsg] }
    }
    return {
      title: setError(fields.title),
      content: setError(fields.title),
      priority: setError(fields.title),
      url: setError(fields.title),
      isError: true,
    }
  }
}
