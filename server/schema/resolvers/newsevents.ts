import { NewsEvent, ExtraLink } from "../models"
import { IField, IIsAuth } from "../interfaces"
import { createEditValid } from "../validation/newsEvents"

export const Query = {
  async getNewsEvents(
    _: any,
    { search, type, category, dateFrom, dateTo, from, to }: IField
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
        type,
        dateEvent: rangeDates,
        category: category ? category : { $exists: true },
      }

      const newsEvents = await NewsEvent.find(query)
        .sort({ date: -1 })
        .skip(from)
        .limit(to)
      const quantity = await NewsEvent.find(query).countDocuments()

      return { items: newsEvents, quantity }
    } catch (error) {
      throw new Error(`Getting news or events error: ${error.message}`)
    }
  },
}

// createNewsEvent(
//   title: String!  isEmpty, isLength
//   content: String!  isEmpty
//   type: String!
//   category: String!
//   dateEvent: String!  isEmpty
//   links: [InputLink]
// ): Msg!

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
        date: new Date(),
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
}
