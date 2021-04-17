import { Upload } from "../models"
import { uploadPath } from "../../modules/uploadTypes"
import { uploadFile, deleteFile } from "../helpers/upload"
// import { config } from "dotenv"
// config({ path: "../../../.env" })
// const { AWS_UPLOADS_BUCKET: uploadBucket } = process.env
import { IField, IIsAuth } from "../interfaces"
import { types as msgTypes } from "../../modules/messageTypes"

export const Query = {
  async getImages(_: any, { from, to, search, type }: IField) {
    try {
      let typeQuery = type ? type : { $ne: "private" }
      let query
      if (search) {
        query = {
          $text: { $search: search },
          type: typeQuery,
          format: "image",
        }
      } else {
        query = { type: typeQuery, format: "image" }
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
  async getContentImages(_: any, { contentId }: IField) {
    try {
      //TODO: validation for each field and check in models

      const images = await Upload.find({ content: contentId })

      return images
    } catch (error) {
      throw new Error(`Getting content images error: ${error.message}`)
    }
  },
}

export const Mutation = {
  async createUpload(
    _: any,
    {
      hashtags,
      description,
      upload: uploadImage,
      content,
      type,
      mimetype = "image",
    }: IField,
    { isAuth }: { isAuth: IIsAuth }
  ) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }
      //TODO: validation for each field and check in models
      const isImgFormat = mimetype === "image"
      if (!!uploadImage) {
        const imageValid = await uploadImage
        const fileType = imageValid.mimetype.split("/")[0]
        if (fileType !== "image" && isImgFormat) {
          throw new Error(
            JSON.stringify({
              upload: {
                value: "",
                msg: ["Ви не можете вибрати файл, який не є зображенням!"],
              },
            })
          )
        }
        if (type) {
          const Location = await uploadFile(uploadImage, uploadPath.uploads)

          const upload = new Upload({
            owner: isAuth.userId,
            date: new Date(),
            location: Location,
            content,
            type,
            description,
            hashtags,
            format: isImgFormat ? "image" : "file",
          })
          await upload.save()

          return {
            message: `${isImgFormat ? "Зображення" : "Файл"} успішно додано!`,
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
              msg: [
                `Будь-ласка виберіть ${isImgFormat ? "зображення" : "файл"}!`,
              ],
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
        const imageValid = await uploadImage
        const fileType = imageValid.mimetype.split("/")[0]
        if (fileType !== "image" && upload.format === "image") {
          throw new Error(
            JSON.stringify({
              upload: {
                value: "",
                msg: ["Ви не можете вибрати файл, який не є зображенням!"],
              },
            })
          )
        }
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
        message: `${
          upload.format === "image" ? "Зображення" : "Файл"
        } успішно оновлено!`,
        type: msgTypes.success.keyWord,
      }
    } catch (error) {
      throw new Error(`Updating upload error: ${error.message}`)
    }
  },
  async deleteUpload(
    _: any,
    { imageId }: IField,
    { isAuth }: { isAuth: IIsAuth }
  ) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }
      //TODO: validation for each field and check in models

      const upload: any = await Upload.findById(imageId)
      await deleteFile(upload.location, uploadBucket || "")
      await Upload.findByIdAndDelete(imageId)

      return {
        message: "Файл успішно видалено!",
        type: msgTypes.success.keyWord,
      }
    } catch (error) {
      throw new Error(`Deleting upload error: ${error.message}`)
    }
  },
}
