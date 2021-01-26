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
import { Query as QGroups, Mutation as MGroups } from "./resolvers/groups"
import { Chat } from "./resolvers/chat"
import { Message } from "./resolvers/message"
import { UserChat } from "./resolvers/userchat"
import { Notification } from "./resolvers/notification"
import { User } from "./resolvers/user"
import { Group } from "./resolvers/group"

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
    },
    Mutation: {
      ...MChats,
      ...MMessages,
      ...MNotifications,
      ...MUnreadMessages,
      ...MPages,
      ...MGroups,
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
  },
}

export default schema
