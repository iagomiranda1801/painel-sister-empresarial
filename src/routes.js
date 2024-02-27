import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const Login = React.lazy(() => import('./views/pages/login/Login'))

const Colors = React.lazy(() => import('./views/theme/colors/Colors'))

const UserRegister = React.lazy(() => import('./views/pages/register/Register'))
const UserList = React.lazy(() => import('./views/pages/User/List'))

const CompanyList = React.lazy(() => import('./views/pages/Company/List'))
const CompanyRuv = React.lazy(() => import('./views/pages/Company/FormRuv'))

const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  { path: '/login', name: 'Login', element: Login },

  { path: '/theme/colors', name: 'Colors', element: Colors },

  { path: '/register', name: 'Register', element: UserRegister },
  { path: '/list/user', name: 'Usuários', element: UserList },

  { path: '/list/company', name: 'Empresas', element: CompanyList },
  { path: '/form-ruv/company', name: 'Empresa', element: CompanyRuv },
]

export default routes
