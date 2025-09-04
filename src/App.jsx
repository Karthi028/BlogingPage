import { createBrowserRouter, RouterProvider } from "react-router"
import './App.css'
import RegisterPage from "../pages/RegisterPage.jsx"
import LoginPage from "../pages/LoginPage.jsx"
import ContentWrite from "../pages/ContentWrite.jsx"
import Homepage from "../pages/Homepage.jsx"
import SinglePost from "../pages/Singlepost.jsx"
import PostlistsPage from "../pages/PostlistsPage.jsx"
import BlogPage from "../pages/Blogpage.jsx"
import DraftsDashboard from "../components/DraftsDashboard .jsx"


const App = () => {

  const routes = [
    {
      path: '/',
      element: <BlogPage />,
      hydrateFallbackElement: <h1>Loading....</h1>,
      children: [
        {
          path: '/',
          element: <Homepage />
        },
        {
          path: '/login',
          element: <LoginPage />
        },
        {
          path: '/register',
          element: <RegisterPage />
        },
        {
          path: '/posts',
          element: <PostlistsPage />
        },
        {
          path: '/contentwrite',
          element: <ContentWrite />
        },
        {
          path: '/:slug',
          element: <SinglePost />
        },
        {
          path:'/dashboard/drafts',
          element:<DraftsDashboard/>
        },
      ]
    }

  ]

  const router = createBrowserRouter((routes), {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  })

  return <RouterProvider
    router={router}
    future={{
      v7_startTransition: true,
    }}
  />


}

export default App