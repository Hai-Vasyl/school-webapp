import Home from "../pages/Home"
import Profile from "../pages/Profile"
import { BsChat, BsSearch, BsBell } from "react-icons/bs"
import EduInst from "../pages/EduInst"
import OurValues from "../pages/OurValues"
import Team from "../pages/Team"
import Graduates from "../pages/Graduates"
import Achievement from "../pages/Achievement"
import News from "../pages/News"
import Library from "../pages/Library"
import Gallery from "../pages/Gallery"
import Management from "../pages/Management"
import Projects from "../pages/Projects"
import Contacts from "../pages/Contacts"
import Schedule from "../pages/Schedule"
import RegisterUser from "../pages/RegisterUser"
import ModGroup from "../pages/ModGroup"
import Groups from "../pages/Groups"
import NewsDetails from "../pages/NewsDetails"
import Events from "../pages/Events"
import Event from "../pages/Event"
import ModNewsEvent from "../pages/ModNewsEvent"
import ImageDetails from "../pages/ImageDetails"
import { ILink } from "../interfaces"
import { access } from "./accessModifiers"

export const buttons = {
  search: {
    keyWord: "search",
    Icon: BsSearch,
  },
  chat: {
    keyWord: "chat",
    Icon: BsChat,
  },
  notif: {
    keyWord: "notif",
    Icon: BsBell,
  },
}

export const getLinks = (role: string) => {
  const allLinks = [
    {
      to: "/",
      exact: true,
      title: "Головна",
    },
    {
      title: "Про школу",
      extraLinks: [
        { to: "/about", title: "Навчальний заклад" },
        { to: "/values", title: "Наші цінності" },
        { to: "/team", title: "Команда" },
        { to: "/graduates", title: "Випускники" },
        { to: "/achievement", title: "Досягнення" },
      ],
    },
    {
      to: "/news",
      title: "Новини",
    },
    {
      to: "/library",
      title: "Бібліотека",
    },
    {
      to: "/gallery",
      title: "Галерея",
    },
    {
      to: "/management",
      title: "Управління",
    },
    {
      title: "Інше",
      extraLinks: [
        {
          to: "/projects",
          title: "Проекти",
        },
        {
          to: "/contacts",
          title: "Котакти",
        },
        {
          to: "/schedule",
          title: "Розклад занять",
        },
      ],
    },
  ]

  const getLinks = (extraLinks: ILink[]) => {
    return [...allLinks].map((link, index) => {
      if (index === allLinks.length - 1 && link.extraLinks) {
        return {
          ...link,
          extraLinks: [...link.extraLinks, ...extraLinks],
        }
      }
      return link
    })
  }

  switch (role) {
    case access.admin.keyWord:
      return getLinks([
        { to: "/create-news", title: "Створити новину" },
        { to: "/create-event", title: "Створити подію" },
        { to: "/register-user", title: "Створити користувача" },
        { to: "/create-group", title: "Створити клас" },
        { to: "/groups", title: "Усі класи" },
      ])
    case access.teacher.keyWord:
      return getLinks([
        { to: "/create-news", title: "Створити новину" },
        { to: "/create-event", title: "Створити подію" },
        { to: "/groups", title: "Усі класи" },
      ])
    case access.student.keyWord:
      return getLinks([{ to: "/groups", title: "Усі класи" }])
    case access.user.keyWord:
      return getLinks([{ to: "/groups", title: "Усі класи" }])
    default:
      return [...allLinks]
  }
}

const mainRoutes = [
  { path: "/", exact: true, Component: Home },
  { path: "/about", Component: EduInst },
  { path: "/values", Component: OurValues },
  { path: "/team", Component: Team },
  { path: "/graduates", Component: Graduates },
  { path: "/achievement", Component: Achievement },
  { path: "/news", exact: true, Component: News },
  { path: "/events", exact: true, Component: Events },
  { path: "/library", Component: Library },
  { path: "/gallery", exact: true, Component: Gallery },
  { path: "/projects", Component: Projects },
  { path: "/management", Component: Management },
  { path: "/contacts", Component: Contacts },
  { path: "/schedule", Component: Schedule },
  { path: "/profile/:userId", exact: true, Component: Profile },
  { path: "/news/details/:contentId", Component: NewsDetails },
  { path: "/events/details/:contentId", Component: Event },
  { path: "/gallery/:imageId", exact: true, Component: ImageDetails },
]

export const routes = {
  admin: [
    ...mainRoutes,
    { path: "/register-user", Component: RegisterUser },
    { path: "/create-news", Component: ModNewsEvent },
    { path: "/create-event", Component: ModNewsEvent },
    { path: "/edit-news/:contentId", Component: ModNewsEvent },
    { path: "/edit-event/:contentId", Component: ModNewsEvent },
    { path: "/create-group", Component: ModGroup },
    { path: "/edit-group/:groupId", Component: ModGroup },
    { path: "/groups", exact: true, Component: Groups },
    { path: "/groups/:groupId", Component: Groups },
  ],
  teacher: [
    ...mainRoutes,
    { path: "/create-news", Component: ModNewsEvent },
    { path: "/create-event", Component: ModNewsEvent },
    { path: "/edit-news/:contentId", Component: ModNewsEvent },
    { path: "/edit-event/:contentId", Component: ModNewsEvent },
    { path: "/groups", exact: true, Component: Groups },
    { path: "/groups/:groupId", Component: Groups },
  ],
  student: [
    ...mainRoutes,
    { path: "/groups", exact: true, Component: Groups },
    { path: "/groups/:groupId", Component: Groups },
  ],
  user: [
    ...mainRoutes,
    { path: "/groups", exact: true, Component: Groups },
    { path: "/groups/:groupId", Component: Groups },
  ],
  unregistered: [...mainRoutes],
}
