import { PageSection, Page, Filter } from "../models"
import { IField, IIsAuth, IFilter, IPageSection } from "../interfaces"
import { types } from "../../modules/messageTypes"
import { createEditValid } from "../validation/pageSections"

export const Query = {
  async getPageSections(_: any, { search, url, filters, from, to }: IField) {
    try {
      console.log({ search, url, filters, from, to })
      const searchQuery = search && { $text: { $search: search } }
      let collection: any = []
      let quantity = 0
      if (filters.length) {
        // console.log("+++")
        for (let i = 0; i < filters.length; i++) {
          const sections: any = await PageSection.find({
            url,
            ...searchQuery,
          }).populate({
            path: "filters",
            match: { keyWord: filters[i].keyWord, value: filters[i].value },
          })

          // TODO:
          // for (let i = 0; i < sections.length; i++) {
          //   console.log({
          //     sectionItem: sections[i],
          //     filtersItem: sections[i].filters,
          //   })
          // }
          // console.log({ sections, filters_: sections.filters })
          // TODO:

          let colectionTemp: IPageSection[] = []
          sections.forEach((item: any) => {
            if (item.filters.length) {
              colectionTemp.push(item)
            }
          })
          // console.log({ colectionTemp })
          if (i === 0) {
            collection = colectionTemp
          } else {
            let collectionNew = []
            for (let i = 0; i < collection.length; i++) {
              for (let j = 0; j < colectionTemp.length; j++) {
                if (
                  String(collection[i]._id) === String(colectionTemp[j]._id)
                ) {
                  collectionNew.push(collection[i])
                }
              }
            }
            collection = collectionNew
          }
        }
        let collectionNew: IPageSection[] = []
        collection.forEach((item: IPageSection, index: number) => {
          if (from <= index && index < from + to) {
            collectionNew.push(item)
          }
        })
        quantity = collection.length
        const sections = await PageSection.find({
          _id: { $in: collectionNew.map((item) => item._id) },
        }).populate({ path: "filters" })
        collection = sections
      } else {
        // console.log("---")
        const sections: any = await PageSection.find({ ...searchQuery, url })
          .populate({ path: "filters" })
          .skip(from)
          .limit(to)
          .sort({
            priority: 1,
          })
        quantity = await PageSection.find({
          ...searchQuery,
          url,
        }).countDocuments()
        // collection = sections.map((item: IPageSection) => ({
        //   ...item,
        //   filters: [],
        // }))
        collection = sections
      }

      // console.log({ collection, quantity })
      return {
        items: collection,
        quantity,
      }
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
