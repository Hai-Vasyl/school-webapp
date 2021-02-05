import { NewsEvent, ExtraLink } from "../models"
import { IField, IIsAuth } from "../interfaces"
import { createEditValid } from "../validation/newsEvents"
import { types } from "../../modules/messageTypes"

export const Query = {
  // async chatMessages(
  //   _: any,
  //   { chat }: IField,
  //   { isAuth }: { isAuth: IIsAuth }
  // ) {
  //   try {
  //     if (!isAuth.auth) {
  //       throw new Error("Access denied!")
  //     }
  //     //TODO: validation for each field and check in models
  //     const messages = await Message.find({ chat })
  //     return messages
  //   } catch (error) {
  //     throw new Error(`Getting all chat messages error: ${error.message}`)
  //   }
  // },
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
