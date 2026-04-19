import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import{SnackbarProvider} from 'notistack'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <SnackbarProvider >
    <App />
  </SnackbarProvider>
  </BrowserRouter>,
)
