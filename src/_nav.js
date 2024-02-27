import React from "react"
import CIcon from "@coreui/icons-react"
import {
  cilIndustry,
  cilSpeedometer,
} from "@coreui/icons"
import { CNavGroup, CNavItem } from "@coreui/react"

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    href: "/#/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: "Administração",
    items: [
      // {
      //   component: CNavItem,
      //   name: "Usuários",
      //   href: "/#/list/user",
      //   icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      // },
      {
        component: CNavItem,
        name: "Empresas",
        href: "/#/list/company/",
        icon: <CIcon icon={cilIndustry} customClassName="nav-icon" />,
      },
    ]
  },
  // {
  //   component: CNavGroup,
  //   name: "Relatório",
  //   to: "/base",
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Empresas",
  //       to: "#",
  //     },
  //   ],
  // },
  
]

export default _nav
