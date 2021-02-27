import { IFieldsMod, IField } from "../interfaces"
import { isEmpty, isEmail, isLength } from "./snippets"

export async function postEmailValid(fields: IField) {
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

    let { firstname, lastname, email, message } = fieldsMod
    if (isError) {
      return { firstname, lastname, email, message, isError }
    }

    email = isEmail(email, "Електронна адреса неправильна!")
    message = isLength(message, {
      min: 5,
      max: 1500,
      minMsg: "Повідомлення має містити принаймні 5 символів!",
      maxMsg: "Повідомлення має містити не більше 1500 символів!",
    })
    if (email.msg.length || message.msg.length) {
      return { firstname, lastname, email, message, isError: true }
    }

    return { firstname, lastname, email, message, isError: false }
  } catch (error) {
    const errorMsg = `Помилка перевірки полів вводу при надсиланні повідомлення: ${error.message}`

    const setError = (value: string) => {
      return { value, msg: [errorMsg] }
    }
    return {
      firstname: setError(fields.firstname),
      lastname: setError(fields.lastname),
      email: setError(fields.email),
      message: setError(fields.message),
      isError: true,
    }
  }
}
