import { Page } from "../models"
import { IIsAuth, IField } from "../interfaces"
import { uploadFile, deleteFile, updateFile } from "../helpers/crudBucket"
import { config } from "dotenv"
config({ path: "../../../.env" })
const { AWS_CHAT_USER_BUCKET: chatUserBucket } = process.env
import { types } from "../../modules/messageTypes"

export const Query = {
  async getPage(_: any, { url }: { url: string }) {
    try {
      const page = await Page.findOne({ url })
      return page
    } catch (error) {
      throw new Error(`Getting page error: ${error.message}`)
    }
  },
}

export const Mutation = {
  async setPageImage(
    _: any,
    { url, image: uploadImage, deleting }: IField,
    { isAuth }: { isAuth: IIsAuth }
  ) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }

      const page: any = await Page.findOne({ url })
      if (!page) {
        let uploaded
        if (!!uploadImage) {
          uploaded = await uploadFile(uploadImage, chatUserBucket || "")
        }
        const newPage = new Page({
          url,
          image: uploaded ? uploaded.Location : "",
          imageKey: uploaded ? uploaded.Key : "",
          date: new Date(),
        })
        await newPage.save()
      } else {
        let image = ""
        let imageKey = ""
        if (deleting) {
          if (page.image) {
            await deleteFile(page.imageKey, chatUserBucket || "")
          }
        } else {
          if (!!uploadImage) {
            const uploaded = await updateFile(
              uploadImage,
              page.imageKey,
              chatUserBucket || ""
            )
            image = uploaded.Location
            imageKey = uploaded.Key
          }
        }
        await Page.updateOne({ url }, { image, imageKey, date: new Date() })
      }

      return {
        type: types.success.keyWord,
        message: "Зображення оновлено успішно!",
      }
    } catch (error) {
      throw new Error(`Updating image page error: ${error.message}`)
    }
  },
}
