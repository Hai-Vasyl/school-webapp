import { Upload, User } from "../models"
import { IField } from "../interfaces"
import { types } from "../../modules/uploadTypes"

export const Image = {
  async owner({ owner }: IField) {
    try {
      const user = await User.findOne({ owner })
      return user
    } catch (error) {
      throw new Error(`Getting owner to image error: ${error.message}`)
    }
  },
  async upload({ id }: IField) {
    try {
      const upload = await Upload.findOne({
        content: id,
        type: types.image.keyWord,
      })
      return upload
    } catch (error) {
      throw new Error(`Getting upload to image error: ${error.message}`)
    }
  },
}
