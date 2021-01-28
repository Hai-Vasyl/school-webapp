import { User, Group } from "../models"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { config } from "dotenv"
import { AuthenticationError } from "apollo-server"
import { registerValid, loginValid } from "../validation/auth"
import { IField, IIsAuth } from "../interfaces"
import { getColor } from "../helpers/randomColor"
import { types } from "../../modules/messageTypes"
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
  async getTeachers(_: any, __: IField, { isAuth }: { isAuth: IIsAuth }) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }
      //TODO: add validation and check in models

      const teachers = await User.find({ role: { $in: ["teacher", "admin"] } })
      return teachers
    } catch (error) {
      throw new Error(`Getting all teachers error: ${error.message}`)
    }
  },
  async getStudentsGroup(
    _: any,
    { groupId }: IField,
    { isAuth }: { isAuth: IIsAuth }
  ) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }
      //TODO: add validation and check in models

      const students = await User.find({ group: groupId, role: "student" })
      return students
    } catch (error) {
      throw new Error(`Getting all students of group error: ${error.message}`)
    }
  },
  async getStudentsNoGroup(_: any, __: any, { isAuth }: { isAuth: IIsAuth }) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }
      //TODO: add validation and check in models

      const students = await User.find({
        group: { $exists: true },
        role: "student",
      })
      return students
    } catch (error) {
      throw new Error(
        `Getting all students without group error: ${error.message}`
      )
    }
  },
}

export const Mutation = {
  async unpinStudentsGroup(
    _: any,
    { groupId, students }: IField,
    { isAuth }: { isAuth: IIsAuth }
  ) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }
      //TODO: add validation and check in models

      for (let i = 0; i < students.length; i++) {
        await User.findByIdAndUpdate(students[i], { group: null })
      }
      await Group.findByIdAndUpdate(groupId, { date: new Date() })

      return {
        message: "Учні були успішно відкріплені!",
        type: types.success.keyWord,
      }
    } catch (error) {
      throw new Error(`Unpin students of group error: ${error.message}`)
    }
  },
}
