//src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material'
import App from './App.jsx'
import { getTheme } from './theme.js'
import AuthProvider from './auth/AuthProvider.jsx'

const mode = localStorage.getItem('themeMode') || 'dark'
const theme = getTheme(mode)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{
        'html, body, #root': { height: '100%' },
        body: { margin: 0 },
        '.app-root': { minHeight: '100%', display: 'flex', flexDirection: 'column' },
        '.app-main': { flex: '1 0 auto' },
        '.app-footer': { flexShrink: 0 },
      }} />
      <AuthProvider>
        <BrowserRouter>
          <div className="app-root">
            <App />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
