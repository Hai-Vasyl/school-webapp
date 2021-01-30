import { Upload } from "../models"
import { uploadFile, deleteFile, updateFile } from "../helpers/crudBucket"
import { config } from "dotenv"
config({ path: "../../../.env" })
const { AWS_UPLOADS_BUCKET: uploadBucket } = process.env
import { IField, IIsAuth } from "../interfaces"
import { types as msgTypes } from "../../modules/messageTypes"

export const Query = {}

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

      if (uploadImage) {
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
}
