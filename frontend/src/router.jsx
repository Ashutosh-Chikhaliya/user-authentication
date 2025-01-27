import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import LogIn from './pages/LogIn'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />

    },
    {
        path: '/LogIn',
        element: <LogIn />
    },
    {
        path: '/SignUp',
        element: <Register />
    }
])

export default router

