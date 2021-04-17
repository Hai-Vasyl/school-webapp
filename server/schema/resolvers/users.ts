import { User } from "../models"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { config } from "dotenv"
import { AuthenticationError } from "apollo-server"
import { registerValid, loginValid } from "../validation/auth"
import { IField, IIsAuth } from "../interfaces"
import { getColor } from "../helpers/randomColor"
import { uploadFile, deleteFile, updateFile } from "../helpers/upload"
import { uploadPath } from "../../modules/uploadTypes"
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
        password: args.password,
      })
      if (validatedFields.isError) {
        throw new Error(JSON.stringify(validatedFields))
      }

      const { email } = validatedFields

      const salt = bcrypt.genSaltSync(12)
      const hash = bcrypt.hashSync(args.password, salt)

      const user = new User({
        email: email.value,
        firstname: args.firstname,
        lastname: args.lastname,
        middlename: args.middlename,
        password: hash,
        role: args.role,
        color: getColor(),
        confirmed: !args.isAdmin && true,
        encrpassword: args.password,
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
  async getUser(_: any, { userId }: IField) {
    try {
      const user = await User.findById(userId)
      return user
    } catch (error) {
      throw new Error(`Getting user data error: ${error.message}`)
    }
  },
  async getAllUsers(_: any, __: any, { isAuth }: { isAuth: IIsAuth }) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }

      const users = await User.find()
      return users
    } catch (error) {
      throw new Error(`Getting all users error: ${error.message}`)
    }
  },
}

export const Mutation = {
  async setUserAva(
    _: any,
    { image: uploadImage, deleting }: IField,
    { isAuth }: { isAuth: IIsAuth }
  ) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }

      const user: any = await User.findById(isAuth.userId)

      if (user) {
        let ava = ""
        if (deleting) {
          if (user.ava) {
            await deleteFile(user.ava)
          }
        } else {
          if (!!uploadImage) {
            if (user.ava) {
              const Location = await updateFile(uploadImage, user.ava)
              ava = Location
            } else {
              const Location = await uploadFile(uploadImage, uploadPath.upload)
              ava = Location
            }
          }
        }
        await User.findByIdAndUpdate(isAuth.userId, { ava })
      }

      return {
        type: types.success.keyWord,
        message: "Зображення оновлено успішно!",
      }
    } catch (error) {
      throw new Error(`Updating user avatar error: ${error.message}`)
    }
  },
  async updateUserData(
    _: any,
    {
      firstname,
      lastname,
      middlename,
      address,
      phone,
      email,
      password,
    }: IField,
    { isAuth }: { isAuth: IIsAuth }
  ) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }

      const user: any = await User.findById(isAuth.userId)

      let newPassword = password || user.encrpassword
      let newEncrpassword = newPassword

      const validatedFields = await registerValid({
        firstname,
        lastname,
        email,
        password: newPassword,
        exceptId: isAuth.userId || "",
      })
      if (validatedFields.isError) {
        throw new Error(JSON.stringify(validatedFields))
      }

      const salt = bcrypt.genSaltSync(12)
      newPassword = bcrypt.hashSync(newPassword, salt)

      await User.findByIdAndUpdate(isAuth.userId, {
        firstname,
        lastname,
        middlename,
        address,
        phone,
        email,
        password: newPassword,
        encrpassword: newEncrpassword,
      })

      return {
        type: types.success.keyWord,
        message: "Дані користувача оновлено успішно!",
      }
    } catch (error) {
      throw new Error(error.message)
    }
  },
}
