import { PageSection, Page, Filter, Upload } from "../models"
import { IField, IIsAuth, IFilter, IPageSection } from "../interfaces"
import { types } from "../../modules/messageTypes"
import { createEditValid } from "../validation/pageSections"
import { deleteFile } from "../helpers/crudBucket"
import { config } from "dotenv"
config({ path: "../../../.env" })
const { AWS_UPLOADS_BUCKET: uploadsBucket } = process.env

export const Query = {
  async getPageSections(_: any, { search, url, filters, from, to }: IField) {
    try {
      const searchQuery = search && { $text: { $search: search } }
      let collection: any = []
      let quantity = 0
      if (filters.length) {
        for (let i = 0; i < filters.length; i++) {
          const sections: any = await PageSection.find({
            url,
            ...searchQuery,
          }).populate({
            path: "filters",
            match: { keyWord: filters[i].keyWord, value: filters[i].value },
          })

          let colectionTemp: IPageSection[] = []
          sections.forEach((item: any) => {
            if (item.filters.length) {
              colectionTemp.push(item)
            }
          })
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
        const sections: any = await PageSection.find({ ...searchQuery, url })
          .populate({ path: "filters" })
          // .sort({
          //   priority: 1,
          // })
          .skip(from)
          .limit(to)
        quantity = await PageSection.find({
          ...searchQuery,
          url,
        }).countDocuments()
        collection = sections
      }

      return {
        items: collection,
        quantity,
      }
    } catch (error) {
      throw new Error(`Getting page sections error: ${error.message}`)
    }
  },
  async getPageSection(_: any, { sectionId }: IField) {
    try {
      const section = await PageSection.findById(sectionId).populate({
        path: "filters",
      })
      return section
    } catch (error) {
      throw new Error(`Getting page section error: ${error.message}`)
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
      if (isError || Object.keys(errors).length) {
        throw new Error(
          JSON.stringify({
            title: vTitle,
            content: vContent,
            priority: vPriority,
            url: vUrl,
            ...errors,
          })
        )
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
  async editPageSection(
    _: any,
    { sectionId, title, content, priority, filters }: IField,
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
        isError,
      }: any = await createEditValid({ title, content, priority })
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
      if (isError || Object.keys(errors).length) {
        throw new Error(
          JSON.stringify({
            title: vTitle,
            content: vContent,
            priority: vPriority,
            ...errors,
          })
        )
      }

      await PageSection.findByIdAndUpdate(sectionId, {
        title,
        content,
        priority,
        date: new Date(),
      })
      if (filters.length) {
        for (let i = 0; i < filters.length; i++) {
          await Filter.findByIdAndUpdate(filters[i].filterId, {
            value: filters[i].value,
          })
        }
      }

      return {
        message: "Розділ оновлено успішно!",
        type: types.success.keyWord,
      }
    } catch (error) {
      throw new Error(error.message)
    }
  },
  async deletePageSection(
    _: any,
    { sectionId }: IField,
    { isAuth }: { isAuth: IIsAuth }
  ) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }

      const uploads: any = await Upload.find({ content: sectionId })
      if (uploads.length) {
        for (let i = 0; i < uploads.length; i++) {
          await deleteFile(uploads[i].key, uploadsBucket || "")
        }
        await Upload.deleteMany({ content: sectionId })
      }

      await Filter.deleteMany({ section: sectionId })
      await PageSection.findByIdAndDelete(sectionId)

      return {
        message: "Розділ видалено успішно!",
        type: types.success.keyWord,
      }
    } catch (error) {
      throw new Error(`Deleting page section error: ${error.message}`)
    }
  },
}
