import { User } from "../models"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { config } from "dotenv"
import { AuthenticationError } from "apollo-server"
import { registerValid, loginValid } from "../validation/auth"
import { IField, IIsAuth } from "../interfaces"
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

      const { username, email } = validatedFields

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
        color: getColor(),
        confirmed: !args.isAdmin && true,
        date: new Date(),
      })
      const newUser = await user.save()

      if (args.isAdmin) {
        return { userId: newUser.id }
      }
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET)
      return { userId: newUser.id, token }
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

      return { userId: user?._id, token }
    } catch (error) {
      throw new AuthenticationError(error.message)
    }
  },
  async getUser(_: any, { userId }: IField, { isAuth }: { isAuth: IIsAuth }) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }

      const user = await User.findById(userId)
      return user
    } catch (error) {
      throw new Error(`Getting user data error: ${error.message}`)
    }
  },
}
