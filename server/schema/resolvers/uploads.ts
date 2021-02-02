import { Upload } from "../models"
import { uploadFile, deleteFile, updateFile } from "../helpers/crudBucket"
import { config } from "dotenv"
config({ path: "../../../.env" })
const { AWS_UPLOADS_BUCKET: uploadBucket } = process.env
import { IField, IIsAuth } from "../interfaces"
import { types as msgTypes } from "../../modules/messageTypes"

export const Query = {
  async getImages(_: any, { from, to, search, type }: IField) {
    try {
      let query
      if (search) {
        query = {
          $text: { $search: search },
          type: type ? type : { $exists: true },
        }
      } else {
        query = { type: type ? type : { $exists: true } }
      }

      const images = await Upload.find({ ...query })
        .sort({ date: -1 })
        .skip(from)
        .limit(to)
      const quantity = await Upload.find({ ...query }).countDocuments()

      return { images, quantity }
    } catch (error) {
      throw new Error(`Getting images errror: ${error.message}`)
    }
  },
  async getImage(_: any, { imageId }: IField) {
    try {
      const image = await Upload.findById(imageId)
      return image
    } catch (error) {
      throw new Error(`Getting image errror: ${error.message}`)
    }
  },
}

export const Mutation = {
  async createUpload(
    _: any,
    { hashtags, description, upload: uploadImage, content, type }: IField,
    { isAuth }: { isAuth: IIsAuth }
  ) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }
      //TODO: validation for each field and check in models

      if (!!uploadImage) {
        if (type) {
          const uploaded = await uploadFile(uploadImage, uploadBucket || "")

          const upload = new Upload({
            owner: isAuth.userId,
            date: new Date(),
            location: uploaded.Location,
            content,
            type,
            key: uploaded.Key,
            description,
            hashtags,
          })
          await upload.save()

          return {
            message: "Зображення успішно додано!",
            type: msgTypes.success.keyWord,
          }
        } else {
          throw new Error("Type not specified while creating upload!")
        }
      } else {
        throw new Error(
          JSON.stringify({
            upload: {
              value: "",
              msg: ["Будь-ласка виберіть зображення!"],
            },
          })
        )
      }
    } catch (error) {
      throw new Error(error.message)
    }
  },
  async editUpload(
    _: any,
    { imageId, hashtags, description, upload: uploadImage }: IField,
    { isAuth }: { isAuth: IIsAuth }
  ) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }
      //TODO: validation for each field and check in models

      const upload: any = await Upload.findById(imageId)
      let uploaded = {
        key: upload.key,
        location: upload.location,
      }
      if (!!uploadImage) {
        const file = await updateFile(
          uploadImage,
          upload.key,
          uploadBucket || ""
        )
        uploaded.key = file.Key
        uploaded.location = file.Location
      }

      await Upload.findByIdAndUpdate(imageId, {
        ...uploaded,
        hashtags,
        description,
        date: new Date(),
      })
      return {
        message: "Зображення успішно оновлено!",
        type: msgTypes.success.keyWord,
      }
    } catch (error) {
      throw new Error(`Updating image error: ${error.message}`)
    }
  },
}
