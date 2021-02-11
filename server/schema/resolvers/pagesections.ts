import { PageSection, Page } from "../models"
import { IField, IIsAuth } from "../interfaces"
import { types } from "../../modules/messageTypes"

export const Query = {
  async getPageSections(_: any, { url }: IField) {
    try {
      //TODO: validation for each field and check in models

      const pagesSections = await PageSection.find({ url })
      return pagesSections
    } catch (error) {
      throw new Error(`Getting page sections error: ${error.message}`)
    }
  },
}

export const Mutation = {
  async createPageSection(
    _: any,
    { title, content, priority, url }: IField,
    { isAuth }: { isAuth: IIsAuth }
  ) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }
      //TODO: validation for each field and check in models

      const page = await Page.findOne({ url })
      let newPage: any
      if (!page) {
        newPage = new Page({
          url,
          date: new Date(),
        })
        await newPage.save()
      }

      const newSection = new PageSection({
        page: page ? page.id : newPage.id,
        title,
        url,
        content,
        priority,
        owner: isAuth.userId,
        date: new Date(),
      })
      await newSection.save()

      return {
        message: "Розділ створено успішно!",
        type: types.success.keyWord,
      }
    } catch (error) {
      throw new Error(`Creating section error: ${error.message}`)
    }
  },
}
