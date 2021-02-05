import typeDefs from "./typeDefs"
import { Query as QUsers, Mutation as MUsers } from "./resolvers/users"
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
import { Query as QGroups, Mutation as MGroups } from "./resolvers/groups"
import { Query as QUploads, Mutation as MUploads } from "./resolvers/uploads"
import {
  Query as QNewsEvents,
  Mutation as MNewsEvents,
} from "./resolvers/newsevents"
import { Chat } from "./resolvers/chat"
import { Message } from "./resolvers/message"
import { UserChat } from "./resolvers/userchat"
import { Notification } from "./resolvers/notification"
import { User } from "./resolvers/user"
import { Group } from "./resolvers/group"
import { UploadFile } from "./resolvers/upload"
import { NewsEvent } from "./resolvers/newsevent"

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
      ...QGroups,
      ...QUploads,
      ...QNewsEvents,
    },
    Mutation: {
      ...MUsers,
      ...MChats,
      ...MMessages,
      ...MNotifications,
      ...MUnreadMessages,
      ...MPages,
      ...MGroups,
      ...MUploads,
      ...MNewsEvents,
    },
    Subscription: {
      ...SMessages,
      ...SNotifications,
    },
    Chat,
    Message,
    UserChat,
    Notification,
    User,
    Group,
    UploadFile,
    NewsEvent,
  },
}

export default schema
