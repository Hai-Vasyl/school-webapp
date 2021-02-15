import { Filter } from "../models"
import { IField } from "../interfaces"

export const Query = {
  async getFilters(_: any, { url }: IField) {
    try {
      const filters = await Filter.find({ url })
      return filters
    } catch (error) {
      throw new Error(`Getting filters error: ${error.message}`)
    }
  },
}
