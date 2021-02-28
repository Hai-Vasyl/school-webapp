import nodemailer from "nodemailer"
import { IField } from "../interfaces"
import { postEmailValid } from "../validation/email"
import { config } from "dotenv"
config({ path: "../../../.env" })
import { types } from "../../modules/messageTypes"

export const Mutation = {
  async sendEmail(_: any, { firstname, lastname, email, message }: IField) {
    try {
      const {
        firstname: vFirstname,
        lastname: vLastname,
        email: vEmail,
        message: vMessage,
        isError,
      }: any = await postEmailValid({ firstname, lastname, email, message })
      if (isError) {
        throw new Error(
          JSON.stringify({
            firstname: vFirstname,
            lastname: vLastname,
            email: vEmail,
            message: vMessage,
          })
        )
      }

      const output = `
        <h2>У вас нове повідомлення!</h2>
        <h4>Подробиці повідомлення:</h4>
        <ul>
          <li>Повне ім'я: ${firstname} ${lastname}</li>
          <li>Електронна пошта: ${email}</li>
        </ul>
        <h4>Повідомлення:</h4>
        <p>${message}</p>`

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.EMAIL_FROM_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      })

      const response = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: "Нове повідомлення",
        text: "Нове повідомлення",
        html: output,
      })

      if (response.error) {
        return {
          message: "Помилка надсилання повідомлення!",
          type: types.error.keyWord,
        }
      }
      return {
        message: "Повідомлення було успішно надіслано",
        type: types.success.keyWord,
      }
    } catch (error) {
      throw new Error(error.message)
    }
  },
}
