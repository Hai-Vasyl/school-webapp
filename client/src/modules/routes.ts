import Home from "../pages/Home"
import Profile from "../pages/Profile"
import About from "../pages/About"
import Team from "../pages/Team"
import Graduates from "../pages/Graduates"
import NewsEvents from "../pages/NewsEvents"
import Library from "../pages/Library"
import Gallery from "../pages/Gallery"
import Management from "../pages/Management"
import Projects from "../pages/Projects"
import Contacts from "../pages/Contacts"
import Schedule from "../pages/Schedule"
import RegisterUser from "../pages/RegisterUser"
import NewsEvent from "../pages/NewsEvent"
import ModNewsEvent from "../pages/ModNewsEvent"
import BookDetails from "../pages/BookDetails"
import { ILink } from "../interfaces"
import { access } from "./accessModifiers"

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
        { to: "/team", title: "Команда" },
        { to: "/graduates", title: "Випускники" },
      ],
    },
    {
      to: "/news",
      title: "Новини",
    },
    {
      to: "/events",
      title: "Події",
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
          title: "Контакти",
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
      ])
    case access.teacher.keyWord:
      return getLinks([
        { to: "/create-news", title: "Створити новину" },
        { to: "/create-event", title: "Створити подію" },
      ])
    case access.user.keyWord:
      return [...allLinks]
    default:
      return [...allLinks]
  }
}

const mainRoutes = [
  { path: "/", exact: true, Component: Home },
  { path: "/about", Component: About },
  { path: "/team", Component: Team },
  { path: "/graduates", Component: Graduates },
  { path: "/news", exact: true, Component: NewsEvents },
  { path: "/events", exact: true, Component: NewsEvents },
  { path: "/library", exact: true, Component: Library },
  { path: "/gallery", exact: true, Component: Gallery },
  { path: "/projects", Component: Projects },
  { path: "/management", Component: Management },
  { path: "/contacts", Component: Contacts },
  { path: "/schedule", Component: Schedule },
  { path: "/profile/:userId", exact: true, Component: Profile },
  { path: "/news/details/:contentId", Component: NewsEvent },
  { path: "/events/details/:contentId", Component: NewsEvent },
  { path: "/library/:bookId", Component: BookDetails },
]

export const routes = {
  admin: [
    ...mainRoutes,
    { path: "/register-user", Component: RegisterUser },
    { path: "/create-news", Component: ModNewsEvent },
    { path: "/create-event", Component: ModNewsEvent },
    { path: "/edit-news/:contentId", Component: ModNewsEvent },
    { path: "/edit-event/:contentId", Component: ModNewsEvent },
  ],
  teacher: [
    ...mainRoutes,
    { path: "/create-news", Component: ModNewsEvent },
    { path: "/create-event", Component: ModNewsEvent },
    { path: "/edit-news/:contentId", Component: ModNewsEvent },
    { path: "/edit-event/:contentId", Component: ModNewsEvent },
  ],
  user: [...mainRoutes],
  unregistered: [...mainRoutes],
}
