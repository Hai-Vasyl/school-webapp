import typeDefs from "./typeDefs"
import { Query as QUsers, Mutation as MUsers } from "./resolvers/users"
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
import { UploadFile } from "./resolvers/upload"
import { NewsEvent } from "./resolvers/newsevent"
import { PageSection } from "./resolvers/pagesection"
import { Mutation as MEmail } from "./resolvers/email"

const schema = {
  typeDefs,
  resolvers: {
    Query: {
      ...QUsers,
      ...QPages,
      ...QUploads,
      ...QNewsEvents,
      ...QPageSections,
      ...QFilters,
    },
    Mutation: {
      ...MEmail,
      ...MPages,
      ...MUploads,
      ...MNewsEvents,
      ...MPageSections,
      ...MUsers,
    },
    UploadFile,
    NewsEvent,
    PageSection,
  },
}

export default schema
