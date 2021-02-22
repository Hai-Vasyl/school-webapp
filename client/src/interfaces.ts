export interface IAuthErrors {
  [key: string]: { value: string; msg: string[] }
}

export interface IRoute {
  path: string
  exact?: boolean
  Component: any
}

export interface ILink {
  to?: string
  exact?: boolean
  title: any
  extraLinks?: any
}

export interface IChatOwner {
  id: string
  ava: string
  username: string
}

// export interface IChatLink {
//   id: string
//   image: string
//   owner: {
//     id: string
//   }
//   title: string
//   type: string
// }

export interface IUserLink {
  id: string
  username: string
  email: string
  ava: string
}

export interface IUserSearch {
  id: string
  username: string
  email: string
  ava: string
}

export interface IChatSearch {
  id: string
  title: string
  image: string
  type: string
  owner: {
    id: string
  }
}

export interface ISearch {
  users: IUserSearch[]
  chats: IChatSearch[]
}

export interface IOwner {
  ava: string
  email: string
  id: string
  username: string
  color: string
  firstname: string
  lastname: string
  role: string
}

export interface IChatCard {
  id: string
  title: string
  type: string
  image: string
}

export interface IOption {
  label: string
  value: string
}

export interface IField {
  param: string
  type?: string
  value?: any
  title: string
  msg?: string
  options?: IOption[]
  isImportant?: boolean
}

export interface IMessage {
  id: string
  content: string
  date: string
  owner: {
    id: string
    username: string
    ava: string
  }
  chat: {
    id: string
  }
}

export interface IMessageToast {
  id: string
  content: string
  date: string
  owner: {
    id: string
    username: string
    ava: string
    typeUser: string
  }
  chat: {
    id: string
    title: string
    type: string
    image: string
  }
}

export interface IGroup {
  id: string
  owner: {
    id: string
    username: string
    email: string
    ava: string
    color: string
    firstname: string
    lastname: string
    role: string
  }
  name: string
  date: string
}

export interface IToast {
  type: string
  message: string
}

export interface IImage {
  id: string
  date: string
  location: string
  type: string
  owner: {
    id: string
  }
}

export interface IImageDetailed {
  id: string
  owner: {
    id: string
    username: string
    email: string
    ava: string
    color: string
    firstname: string
    lastname: string
    role: string
  }
  date: string
  location: string
  content: string
  type: string
  key: string
  hashtags: string
  description: string
  format: string
}

export interface INewsEvent {
  id: string
  title: string
  date: string
  category: string
  dateEvent: string
  links: {
    link: string
    label: string
  }[]
  preview: {
    id: string
    location: string
  }
}

export interface INewsEventDetailed {
  id: string
  title: string
  content: string
  type: string
  owner: {
    id: string
    username: string
    email: string
    ava: string
    color: string
    firstname: string
    lastname: string
    role: string
  }
  date: string
  category: string
  dateEvent: string
  links: {
    link: string
    label: string
  }[]
}

export interface IImageSlide {
  id: string
  date: string
  location: string
  owner: {
    id: string
  }
  hashtags?: string
  description?: string
}

export interface IUploadSection {
  id: string
  location: string
  content: string
  type: string
  hashtags: string
  description: string
  format: string
  owner: {
    id: string
  }
  date: string
}

export interface IPageSection {
  id: string
  page: string
  url: string
  title: string
  content: string
  priority: string
  date: string
  owner: {
    id: string
  }
  uploads: IUploadSection[]
  filters: {
    id: string
    url: string
    section: string
    keyWord: string
    value: string
  }[]
}

export interface IPageSectionShort {
  id: string
  page: string
  url: string
  title: string
  priority: string
  date: string
  owner: {
    id: string
  }
  uploads: IUploadSection[]
  filters: {
    id: string
    url: string
    section: string
    keyWord: string
    value: string
  }[]
}

export interface IPageSectionFilter {
  id: string
  url: string
  section: string
  keyWord: string
  value: string
}

export interface IFilter {
  keyWord: string
  value: string
}
