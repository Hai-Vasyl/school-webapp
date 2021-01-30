import { Image, Upload } from "../models"
import { uploadFile, deleteFile, updateFile } from "../helpers/crudBucket"
import { config } from "dotenv"
config({ path: "../../../.env" })
const { AWS_UPLOADS_BUCKET: uploadBucket } = process.env
import { IField, IIsAuth } from "../interfaces"
import { types } from "../../modules/uploadTypes"

export const Query = {}

export const Mutation = {
  async createImage(
    _: any,
    { description, upload: uploadFile }: IField,
    { isAuth }: { isAuth: IIsAuth }
  ) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }
      //TODO: validation for each field and check in models

      if (uploadFile) {
        const uploaded = await uploadFile(uploadFile, uploadBucket || "")
        const image = new Image({
          description,
          date: new Date(),
          owner: isAuth.userId,
        })
        const newImage = await image.save()

        const upload = new Upload({
          owner: isAuth.userId,
          date: new Date(),
          location: uploaded.Location,
          content: newImage._id,
          type: types.image.keyWord,
          key: uploaded.Key,
        })
        await upload.save()

        return newImage
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
}
