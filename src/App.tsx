import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/components/theme-provider"
import AuthLayout from "@/components/auth/AuthLayout"
import AppLayout from "@/layouts/AppLayout"
import Login from "@/pages/auth/Login"
import Signup from "@/pages/auth/Signup"
import RequireAuth from "@/components/auth/RequireAuth"
import Settings from "@/pages/settings/Settings"
import ContactDetail from "@/pages/contacts/ContactDetail"
import Contacts from "@/pages/contacts/Contacts"
import Deals from "@/pages/deals/Deals"
import Tasks from "@/pages/tasks/Tasks"

import Dashboard from "@/pages/dashboard/Dashboard"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* Protected Routes */}
            <Route
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/contacts/:id" element={<ContactDetail />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
