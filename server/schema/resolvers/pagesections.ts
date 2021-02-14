import { PageSection, Page, Filter } from "../models"
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
    { title, content, priority, url, filters }: IField,
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
      let errors: any = {}
      if (filters.length) {
        for (let i = 0; i < filters.length; i++) {
          if (!filters[i].value) {
            errors[filters[i].keyWord] = {
              value: filters[i].value,
              msg: ["Це поле не може бути порожнім!"],
            }
          }
        }
      }
      if (Object.keys(errors).length) {
        throw new Error(JSON.stringify(errors))
      }

      const page: any = await Page.findOne({ url })
      let savedPage: any
      if (!page) {
        const newPage = new Page({
          url,
          date: new Date(),
        })
        savedPage = await newPage.save()
      }
      let pageCollection = page || savedPage

      const newSection = new PageSection({
        page: pageCollection._id,
        title,
        url,
        content,
        priority,
        owner: isAuth.userId,
        date: new Date(),
      })
      const section: any = await newSection.save()

      if (filters.length) {
        for (let i = 0; i < filters.length; i++) {
          const filter = new Filter({
            page: pageCollection._id,
            url,
            section: section._id,
            keyWord: filters[i].keyWord,
            value: filters[i].value,
            date: new Date(),
          })
          const newFilter = await filter.save()
          section.filters.push(newFilter._id)
        }
        await section.save()
      }

      return {
        message: "Розділ створено успішно!",
        type: types.success.keyWord,
      }
    } catch (error) {
      throw new Error(error.message)
    }
  },
}
