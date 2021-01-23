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

const mainLinks = [
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
    to: "/projects",
    title: "Проекти",
  },
  {
    to: "/management",
    title: "Управління",
  },
  {
    to: "/contacts",
    title: "Котакти",
  },
  {
    to: "/schedule",
    title: "Розклад занять",
  },
]

export const links = {
  admin: [...mainLinks],
  teacher: [...mainLinks],
  student: [...mainLinks],
  user: [...mainLinks],
  unregistered: [...mainLinks],
}

const mainRoutes = [
  { path: "/", exact: true, Component: Home },
  { path: "/about", Component: EduInst },
  { path: "/values", Component: OurValues },
  { path: "/team", Component: Team },
  { path: "/graduates", Component: Graduates },
  { path: "/achievement", Component: Achievement },
  { path: "/news", Component: News },
  { path: "/library", Component: Library },
  { path: "/gallery", Component: Gallery },
  { path: "/projects", Component: Projects },
  { path: "/management", Component: Management },
  { path: "/contacts", Component: Contacts },
  { path: "/schedule", Component: Schedule },
]

export const routes = {
  admin: [
    ...mainRoutes,
    { path: "/register-user", Component: RegisterUser },
    { path: "/profile/:userId", exact: true, Component: Profile },
  ],
  teacher: [
    ...mainRoutes,
    { path: "/profile/:userId", exact: true, Component: Profile },
  ],
  student: [
    ...mainRoutes,
    { path: "/profile/:userId", exact: true, Component: Profile },
  ],
  user: [
    ...mainRoutes,
    { path: "/profile/:userId", exact: true, Component: Profile },
  ],
  unregistered: [...mainRoutes],
}
