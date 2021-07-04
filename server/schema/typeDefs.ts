import { gql } from "apollo-server"

export default gql`
  type Filter {
    id: ID!
    page: ID!
    url: String!
    section: ID!
    keyWord: String!
    value: String!
    date: String!
  }
  input InputFilter {
    keyWord: String!
    value: String!
  }
  input InputFilterEdit {
    filterId: ID!
    keyWord: String!
    value: String!
  }
  type PageSection {
    id: ID!
    page: ID!
    url: String!
    title: String!
    content: String
    priority: Int!
    filters: [Filter]!
    owner: User!
    date: String!
    uploads: [UploadFile]!
  }
  type ExtraLink {
    id: ID!
    link: String!
    label: String!
    content: ID!
    date: String!
  }
  input InputLink {
    link: String!
    label: String!
  }
  type NewsEvent {
    id: ID!
    title: String!
    content: String!
    type: String!
    owner: User!
    date: String!
    category: String!
    dateEvent: String!
    links: [ExtraLink]!
    preview: UploadFile
  }
  type UploadFile {
    id: ID!
    owner: User!
    date: String!
    location: String!
    content: ID
    type: String!
    key: String!
    hashtags: String
    description: String
    format: String!
  }
  type Page {
    id: ID!
    url: String!
    image: String
    imageKey: String
    date: String!
  }
  type Msg {
    type: String!
    message: String!
  }
  type User {
    id: ID!
    email: String!
    ava: String
    color: String!
    firstname: String!
    confirmed: Boolean!
    lastname: String!
    middlename: String
    phone: String
    address: String
    birth: String
    role: String!
    date: String!
  }
  type Auth {
    userId: String
    token: String
  }
  type Images {
    images: [UploadFile]!
    quantity: Int!
  }
  type NewsEvents {
    items: [NewsEvent]!
    quantity: Int!
  }
  type PageSections {
    items: [PageSection]!
    quantity: Int!
  }
  type SearchContent {
    images: [UploadFile]!
    news: [NewsEvent]!
    events: [NewsEvent]!
    other: [PageSection]!
  }

  type Query {
    searchContent(search: String, tags: String): SearchContent!
    getUser(userId: String!): User!
    getAllUsers: [User]!
    getFilters(url: String!): [Filter]!
    getPageSections(
      search: String
      url: String!
      filters: [InputFilter]!
      from: Int!
      to: Int
      exceptId: ID
    ): PageSections!
    getPageSection(sectionId: ID!): PageSection!
    getNewsEvents(
      search: String
      type: String!
      category: String
      dateFrom: String
      dateTo: String
      from: Int!
      to: Int!
      exceptId: ID
    ): NewsEvents!
    getNewsEvent(contentId: ID!, type: String!): NewsEvent!
    getContentImages(contentId: ID!): [UploadFile]!
    login(email: String!, password: String!): Auth
    register(
      firstname: String!
      lastname: String!
      email: String!
      password: String!
      isAdmin: Boolean
      role: String
      group: String
    ): Auth
    getImages(from: Int!, to: Int!, search: String, type: String): Images!
    getImage(imageId: ID!): UploadFile!
    getPage(url: String!): Page
  }
  type Mutation {
    setUserAva(image: Upload, deleting: Boolean!): Msg!
    updateUserData(
      firstname: String!
      lastname: String!
      middlename: String
      address: String
      phone: String
      email: String!
      password: String
    ): Msg!
    sendEmail(
      firstname: String!
      lastname: String!
      email: String!
      message: String!
    ): Msg!
    createPageSection(
      url: String!
      title: String!
      content: String!
      priority: Int!
      filters: [InputFilter]!
      optContent: Boolean
    ): Msg!
    editPageSection(
      sectionId: ID!
      title: String!
      content: String!
      priority: Int!
      filters: [InputFilterEdit]!
      optContent: Boolean
    ): Msg!
    deletePageSection(sectionId: ID!): Msg!
    createNewsEvent(
      title: String!
      content: String!
      type: String!
      category: String!
      dateEvent: String!
      links: [InputLink]
    ): String!
    editNewsEvent(
      contentId: ID!
      title: String!
      content: String!
      type: String!
      category: String!
      dateEvent: String!
      links: [InputLink]
    ): Msg!
    deleteNewsEvent(contentId: ID!): Msg!
    createUpload(
      hashtags: String
      description: String
      upload: Upload
      content: ID
      type: String
      mimetype: String
    ): Msg!
    editUpload(
      imageId: ID!
      hashtags: String
      description: String
      upload: Upload
    ): Msg!
    deleteUpload(imageId: ID!): Msg!
    setPageImage(url: String!, image: Upload, deleting: Boolean!): Msg!
  }
`
