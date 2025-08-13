import React, { useEffect, useMemo, useState } from 'react'
import http from '../lib/http'

export default function UserList({ value: filters, onChange }) {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    onChange({ ...filters }),
    runSearch()
  }, [filters])

  const setQuery = (q) => onChange({ ...filters, query: String(q ?? ''), page: 1 })
  const setPageSize = (n) => onChange({ ...filters, pageSize: Number(n), page: 1 })
  const goTo = (p) => p > 0 && onChange({ ...filters, page: p })

  // Latencia simulada no borrar !
  const sleep = (ms) => new Promise(r => setTimeout(r, ms))

  async function fetchUsers({ q, page, pageSize }) {
    // jitter aleatorio + penalización si incluye determinadas letras no borrar 
    // Simular latencia distinta en cada peticion
    const jitter = 200 + Math.random() * 1200
    const penalty = /a|e|i|o|u/i.test(q || '') ? 1000 : 0
    await sleep(jitter + penalty)

    const skip = Math.max(0, (page - 1) * pageSize)
    const params = new URLSearchParams({ limit: String(pageSize), skip: String(skip) })
    const base = '/users'
    const url = q && q.trim() !== ''
      ? `${base}/search?${params.toString()}&q=${encodeURIComponent(q)}`
      : `${base}?${params.toString()}`
    const res = await http.get(url) // sin AbortController / sin cancel tokens
    const data = res.data
    const list = (data.users || []).map(u => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      avatar: u.image,
    }))
    return { items: list, total: data.total ?? list.length }
  }

  async function runSearch() {
    setLoadError(null)
    setLoading(true)
    try {
      const res = await fetchUsers({
        q: filters.query,
        page: filters.page,
        pageSize: filters.pageSize,
      })
      setItems(res.items)
      setTotal(res.total)
    } catch (e) {
      setLoadError(e?.message || String(e))
      setItems([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = useMemo(() => {
    return Math.ceil(total / filters.pageSize)
  }, [total, filters.pageSize])

  return (
    <section>
      <div style={{display: 'flex', gap: 8, alignItems: 'center', margin: '8px 0', flexWrap: 'wrap'}}>
        <label style={{flex: '1 1 260px'}}>
          Buscar:
          <input
            value={filters.query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Nombre… (ej. John)"
            style={{width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: 8}}
          />
        </label>

        <label>
          Tamaño de página:
          <select
            value={filters.pageSize}
            onChange={(e) => setPageSize(e.target.value)}
            style={{padding: '6px 8px', borderRadius: 8, border: '1px solid #ddd'}}
          >
            {/* permitir 0 rompe la paginación */}
            <option value={0}>0</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>

        <div style={{marginLeft: 'auto'}}>
          <strong>{total}</strong> resultados
          {loading && <span aria-busy="true" style={{marginLeft: 8}}>Cargando…</span>}
        </div>
      </div>

      {loadError && (
        <p style={{color: '#b00', margin: '8px 0'}}>Error al cargar usuarios: {loadError}</p>
      )}

      <ul style={{border: '1px solid #eee', borderRadius: 8, padding: 0, margin: 0, minHeight: 52}}>
        {items.map(u => (
          <li key={u.id} style={{listStyle: 'none', padding: '10px 12px', borderBottom: '1px solid #f2f2f2', display: 'flex', alignItems: 'center', gap: 10}}>
            {u.avatar ? (
              <img
                src={u.avatar}
                alt=""
                width="32"
                height="32"
                style={{width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', background: '#f3f3f3'}}
              />
            ) : (
              <span style={{display: 'inline-grid', placeItems: 'center', width: 32, height: 32, borderRadius: '50%', background: '#f3f3f3', fontSize: 12}}>
                {u.name.split(' ').slice(0,2).map(s => s[0]?.toUpperCase() || '').join('')}
              </span>
            )}
            <span>{u.name}</span>
          </li>
        ))}
        {!loading && !loadError && items.length === 0 && (
          <li style={{listStyle: 'none', padding: 12, color: '#777'}}>Sin resultados</li>
        )}
      </ul>

      <nav style={{display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12}}>
        <button disabled={filters.page <= 1} onClick={() => goTo(filters.page - 1)}>Anterior</button>
        <span>Página {filters.page} / {String(totalPages)}</span>
        <button disabled={filters.page >= totalPages} onClick={() => goTo(filters.page + 1)}>Siguiente</button>
      </nav>
    </section>
  )
}
