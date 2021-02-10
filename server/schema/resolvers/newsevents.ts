import { NewsEvent, ExtraLink, Upload } from "../models"
import { IField, IIsAuth } from "../interfaces"
import { createEditValid } from "../validation/newsEvents"
import { types as msgTypes } from "../../modules/messageTypes"
import { deleteFile } from "../helpers/crudBucket"
import { config } from "dotenv"
config({ path: "../../../.env" })
const { AWS_UPLOADS_BUCKET: uploadsBucket } = process.env

export const Query = {
  async getNewsEvents(
    _: any,
    { search, type, category, dateFrom, dateTo, from, to, exceptId }: IField
  ) {
    try {
      const searchQuery = search && { $text: { $search: search } }
      const rangeDates =
        dateFrom && dateTo
          ? { $gte: dateFrom, $lte: dateTo }
          : dateFrom
          ? { $gte: dateFrom }
          : dateTo
          ? { $lte: dateTo }
          : { $exists: true }
      const query = {
        ...searchQuery,
        _id: exceptId ? { $ne: exceptId } : { $exists: true },
        type,
        date: type === "news" ? rangeDates : { $exists: true },
        dateEvent: type === "event" ? rangeDates : { $exists: true },
        category: category ? category : { $exists: true },
      }

      const newsEvents = await NewsEvent.find(query)
        .skip(from)
        .limit(to)
        .sort({ date: -1 })

      const quantity = await NewsEvent.find(query).countDocuments()

      return { items: newsEvents, quantity }
    } catch (error) {
      throw new Error(`Getting news or events error: ${error.message}`)
    }
  },
  async getNewsEvent(_: any, { contentId, type }: IField) {
    try {
      //TODO: validation for each field and check in models

      const newsEvent = await NewsEvent.findOne({ _id: contentId, type })
      return newsEvent
    } catch (error) {
      throw new Error(`Getting news or event error: ${error.message}`)
    }
  },
}

export const Mutation = {
  async createNewsEvent(
    _: any,
    { title, content, type, category, dateEvent, links }: IField,
    { isAuth }: { isAuth: IIsAuth }
  ) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }

      const {
        title: vTitle,
        content: vContent,
        dateEvent: vDateEvent,
        isError,
      }: any = await createEditValid({ title, content, dateEvent })
      if (isError) {
        throw new Error(
          JSON.stringify({
            title: vTitle,
            content: vContent,
            dateEvent: vDateEvent,
          })
        )
      }

      const newsEvent = new NewsEvent({
        title,
        content,
        type,
        category,
        dateEvent,
        date: new Date().toISOString().split("T")[0],
        owner: isAuth.userId,
      })
      const newNewsEvent = await newsEvent.save()

      for (let i = 0; i < links.length; i++) {
        const extraLink = new ExtraLink({
          link: links[i].link,
          label: links[i].label,
          content: newNewsEvent._id,
          date: new Date(),
        })
        await extraLink.save()
      }

      return newNewsEvent._id
    } catch (error) {
      throw new Error(error.message)
    }
  },
  async editNewsEvent(
    _: any,
    { contentId, title, content, type, category, dateEvent, links }: IField,
    { isAuth }: { isAuth: IIsAuth }
  ) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }

      const {
        title: vTitle,
        content: vContent,
        dateEvent: vDateEvent,
        isError,
      }: any = await createEditValid({ title, content, dateEvent })
      if (isError) {
        throw new Error(
          JSON.stringify({
            title: vTitle,
            content: vContent,
            dateEvent: vDateEvent,
          })
        )
      }

      await NewsEvent.updateOne(
        { _id: contentId, type },
        {
          title,
          content,
          category,
          dateEvent,
          date: new Date().toISOString().split("T")[0],
        }
      )

      await ExtraLink.deleteMany({ content: contentId })

      for (let i = 0; i < links.length; i++) {
        const extraLink = new ExtraLink({
          link: links[i].link,
          label: links[i].label,
          content: contentId,
          date: new Date(),
        })
        await extraLink.save()
      }

      return {
        message: `${
          type === "news" ? "Новина" : "Подія"
        } була успішно оновлена!`,
        type: msgTypes.success.keyWord,
      }
    } catch (error) {
      throw new Error(error.message)
    }
  },
  async deleteNewsEvent(
    _: any,
    { contentId }: IField,
    { isAuth }: { isAuth: IIsAuth }
  ) {
    try {
      if (!isAuth.auth) {
        throw new Error("Access denied!")
      }

      const images: any = await Upload.find({ content: contentId })
      if (images.length) {
        for (let i = 0; i < images.length; i++) {
          await deleteFile(images[i].key, uploadsBucket || "")
        }
        await Upload.deleteMany({ content: contentId })
      }

      await ExtraLink.deleteMany({ content: contentId })
      const content: any = await NewsEvent.findById(contentId)
      await NewsEvent.findByIdAndDelete(contentId)

      return {
        message: `${
          content?.type === "news" ? "Новина" : "Подія"
        } була успішно видалена!`,
        type: msgTypes.success.keyWord,
      }
    } catch (error) {
      throw new Error(`Deleting news or event error: ${error.message}`)
    }
  },
}
