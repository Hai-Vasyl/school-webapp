import { PageSection, Page } from "../models"
import { IField, IIsAuth } from "../interfaces"
import { types } from "../../modules/messageTypes"
import { createEditValid } from "../validation/pageSections"

export const Query = {
  async getPageSections(_: any, { url }: IField) {
    try {
      //TODO: validation for each field and check in models

      const pagesSections = await PageSection.find({ url }).sort({
        priority: 1,
      })
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

      const {
        title: vTitle,
        content: vContent,
        priority: vPriority,
        url: vUrl,
        isError,
      }: any = await createEditValid({ title, content, priority, url })
      if (isError) {
        throw new Error(
          JSON.stringify({
            title: vTitle,
            content: vContent,
            priority: vPriority,
            url: vUrl,
          })
        )
      }

      const page = await Page.findOne({ url })
      let savedPage: any
      if (!page) {
        const newPage = new Page({
          url,
          date: new Date(),
        })
        savedPage = await newPage.save()
      }

      const newSection = new PageSection({
        page: page ? page.id : savedPage.id,
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
      throw new Error(error.message)
    }
  },
}
