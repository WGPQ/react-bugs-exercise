import User from './components/User/index.jsx'
import { UserProvider } from './context/UserProvider.jsx'

export default function App() {

  return (
    <UserProvider>
      <main style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
        <h1 style={{ margin: '0 0 12px' }}>Listado de usuarios (React) — con bugs intencionales</h1>
        <p style={{ margin: '0 0 16px', color: '#666' }}>Búsqueda y paginación en servidor (DummyJSON) usando Axios.</p>
        <User />
        {/* <pre style={{ marginTop: 16, background: '#f8f8f8', border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
        Estado en el padre:
        {JSON.stringify(filters, null, 2)}
        </pre> */}
      </main>
    </UserProvider>
  )
}
