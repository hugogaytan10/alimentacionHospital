import './App.css'
import AppProvider from './Contexto/AppContext'
import { Rutas } from './Rutas/Rutas'

function App() {

  return (
    <AppProvider>
      <Rutas/>
    </AppProvider>
  )
}

export default App
