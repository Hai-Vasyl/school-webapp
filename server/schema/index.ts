import typeDefs from "./typeDefs"
import { Query as QUsers } from "./resolvers/users"
import { Query as QChats, Mutation as MChats } from "./resolvers/chats"
import {
  Query as QMessages,
  Mutation as MMessages,
  Subscription as SMessages,
} from "./resolvers/messages"
import {
  Subscription as SNotifications,
  Mutation as MNotifications,
  Query as QNotifications,
} from "./resolvers/notifications"
import {
  Query as QUnreadMessages,
  Mutation as MUnreadMessages,
} from "./resolvers/unreadmessages"
import { Query as QPages, Mutation as MPages } from "./resolvers/pages"
import { Query as QUploads, Mutation as MUploads } from "./resolvers/uploads"
import {
  Query as QNewsEvents,
  Mutation as MNewsEvents,
} from "./resolvers/newsevents"
import {
  Query as QPageSections,
  Mutation as MPageSections,
} from "./resolvers/pagesections"
import { Query as QFilters } from "./resolvers/filters"
import { Chat } from "./resolvers/chat"
import { Message } from "./resolvers/message"
import { UserChat } from "./resolvers/userchat"
import { Notification } from "./resolvers/notification"
import { UploadFile } from "./resolvers/upload"
import { NewsEvent } from "./resolvers/newsevent"
import { PageSection } from "./resolvers/pagesection"

const schema = {
  typeDefs,
  resolvers: {
    Query: {
      ...QUsers,
      ...QChats,
      ...QMessages,
      ...QNotifications,
      ...QUnreadMessages,
      ...QPages,
      ...QUploads,
      ...QNewsEvents,
      ...QPageSections,
      ...QFilters,
    },
    Mutation: {
      ...MChats,
      ...MMessages,
      ...MNotifications,
      ...MUnreadMessages,
      ...MPages,
      ...MUploads,
      ...MNewsEvents,
      ...MPageSections,
    },
    Subscription: {
      ...SMessages,
      ...SNotifications,
    },
    Chat,
    Message,
    UserChat,
    Notification,
    UploadFile,
    NewsEvent,
    PageSection,
  },
}

export default schema
