import { User } from "../models"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { config } from "dotenv"
import { AuthenticationError } from "apollo-server"
import { registerValid, loginValid } from "../validation/auth"
import { IField } from "../interfaces"
import { getColor } from "../helpers/randomColor"
config({ path: "../../../.env" })
const { JWT_SECRET }: any = process.env

export const Query = {
  async register(_: any, args: IField) {
    try {
      const validatedFields = await registerValid({
        firstname: args.firstname,
        lastname: args.lastname,
        email: args.email,
        username: args.username,
        password: args.password,
      })
      if (validatedFields.isError) {
        throw new Error(JSON.stringify(validatedFields))
      }

      const { username, email, password, firstname, lastname } = validatedFields

      const salt = bcrypt.genSaltSync(12)
      const hash = bcrypt.hashSync(args.password, salt)

      const user = new User({
        username: username.value,
        email: email.value,
        firstname: args.firstname,
        lastname: args.lastname,
        middlename: args.middlename,
        password: hash,
        role: args.role,
        group: args.group,
        color: getColor(),
        confirmed: !args.isAdmin && true,
        date: new Date(),
      })
      const newUser = await user.save()

      if (args.isAdmin) {
        return { user: newUser }
      }
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET)
      return { user: newUser, token }
    } catch (error) {
      throw new AuthenticationError(error.message)
    }
  },
  async login(_: any, args: IField) {
    try {
      const validatedFields = await loginValid(args)
      if (validatedFields.isError) {
        throw new Error(JSON.stringify(validatedFields))
      }

      const { instance: user } = validatedFields
      const token = jwt.sign({ userId: user?._id }, JWT_SECRET)

      return { user, token }
    } catch (error) {
      throw new AuthenticationError(error.message)
    }
  },
}
