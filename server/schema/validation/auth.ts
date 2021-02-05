import { User } from "../models"
import {
  IFieldsMod,
  IField,
  IValidRegisterResult,
  IValidLoginResult,
} from "../interfaces"
import {
  isEmpty,
  isEmail,
  isUnique,
  isContains,
  isLength,
  comparePassword,
} from "./snippets"

async function register(fields: IField): Promise<IValidRegisterResult> {
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

    let { firstname, lastname, username, email, password } = fieldsMod
    if (isError) {
      return { firstname, lastname, username, email, password, isError }
    }

    email = isEmail(email, "Електронна адреса неправильна!")
    username = isLength(username, {
      min: 3,
      max: 25,
      minMsg: "Ім'я користувача має містити принаймні 4 символи!",
      maxMsg: "Ім'я користувача має містити не більше 25 символів!",
    })
    password = isLength(password, {
      min: 4,
      max: 50,
      minMsg: "Пароль повинен містити щонайменше 4 символи!",
      maxMsg: "Пароль повинен містити не більше 50 символів!",
    })
    if (email.msg.length || username.msg.length || password.msg.length) {
      return { username, email, password, isError: true }
    }

    email = await isUnique(
      fieldsMod.email,
      "Ця електронна адреса вже існує, виберіть іншу!",
      User,
      "email"
    )
    username = await isUnique(
      fieldsMod.username,
      "Це ім’я користувача вже існує, виберіть інше!",
      User,
      "username"
    )
    if (email.msg.length || username.msg.length) {
      return { username, email, password, isError: true }
    }

    return { username, email, password, isError: false }
  } catch (error) {
    const errorMsg = `Помилка перевірки полів вводу при реєстрації: ${error.message}`

    const setError = (value: string) => {
      return { value, msg: [errorMsg] }
    }
    return {
      username: setError(fields.username),
      email: setError(fields.email),
      password: setError(fields.password),
      isError: true,
    }
  }
}

async function login(fields: IField): Promise<IValidLoginResult> {
  try {
    let fieldsMod: IFieldsMod = {}
    let isError = false
    Object.keys(fields).forEach((key) => {
      fieldsMod[key] = isEmpty(
        { value: fields[key], msg: [] },
        "Це поле не може бути порожнім!"
      )
      if (fieldsMod[key].msg.length) {
        isError = true
      }
    })
    let { email, password } = fieldsMod
    if (isError) {
      return { email, password, isError }
    }

    email = isEmail(email, "Електронна адреса неправильна!")
    password = isLength(password, {
      min: 4,
      max: 50,
      minMsg: "Пароль повинен містити щонайменше 4 символи!",
      maxMsg: "Пароль повинен містити не більше 50 символів!",
    })
    if (email.msg.length || password.msg.length) {
      return { email, password, isError: true }
    }

    const { instance, field: emailVerified } = await isContains(
      email,
      "Ця електронна адреса не існує, виберіть іншу!",
      User,
      "email"
    )
    if (instance) {
      let { passwordVerified, isSimilar } = await comparePassword(
        password,
        instance.password,
        "Пароль неправильний. Будь ласка, спробуйте ще раз!"
      )
      const resultVerification = {
        email: emailVerified,
        password: passwordVerified,
      }
      if (!isSimilar) {
        return { isError: true, ...resultVerification }
      }
      return { isError: false, ...resultVerification, instance }
    } else {
      return { email: emailVerified, password, isError: true }
    }
  } catch (error) {
    const errorMsg = `Помилка перевірки полів вводу при авторизації: ${error.message}`

    const setError = (value: string) => {
      return { value, msg: [errorMsg] }
    }
    return {
      email: setError(fields.email),
      password: setError(fields.password),
      isError: true,
    }
  }
}

export const loginValid = login
export const registerValid = register
