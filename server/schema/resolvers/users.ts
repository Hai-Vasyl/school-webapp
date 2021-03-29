import { User } from "../models"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { config } from "dotenv"
import { AuthenticationError } from "apollo-server"
import { registerValid, loginValid } from "../validation/auth"
import { IField, IIsAuth } from "../interfaces"
import { getColor } from "../helpers/randomColor"
import { uploadFile, deleteFile, updateFile } from "../helpers/crudBucket"
import { types } from "../../modules/messageTypes"
config({ path: "../../../.env" })
const { JWT_SECRET, AWS_CHAT_USER_BUCKET: chatUserBucket }: any = process.env

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
      const imgParts = user.ava.split("/")
      const imgKey = imgParts[imgParts.length - 1]

      if (user) {
        let ava = ""
        if (deleting) {
          if (user.ava) {
            await deleteFile(imgKey, chatUserBucket || "")
          }
        } else {
          if (!!uploadImage) {
            if (user.ava) {
              const uploaded = await updateFile(
                uploadImage,
                imgKey,
                chatUserBucket || ""
              )
              ava = uploaded.Location
            } else {
              const uploaded = await uploadFile(
                uploadImage,
                chatUserBucket || ""
              )
              ava = uploaded.Location
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
}
