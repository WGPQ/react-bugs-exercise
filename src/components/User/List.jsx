import { useEffect, useMemo, useState } from 'react'

import UserItem from './Item'
import { UserSearch } from './Search'
import Loading from '../common/Loading'
import useUser from '../hooks/useUser'
import useUserContext from '../../context/useUserContex'

export default function UserList() {
  const [query, setQuery] = useState('');
  const { users, loading,
    total,
    filters,
    loadError,
    usersFiltres,
    setUsersList,
    setTotalUsers,
    setLoadingState,
    setFiltersState,
    setLoadErrorMessage,
  } = useUserContext();

  const { fetchUsers } = useUser();


  const userList = useMemo(() => {
    let userLimit = users;
    if (query.trim().length > 0) {
      userLimit = usersFiltres;
    }
    return userLimit.slice((filters.page - 1) * filters.pageSize, filters.page * filters.pageSize);
  }, [users, usersFiltres, query, filters.page, filters.pageSize]);

  useEffect(() => {
    loadUsers()
  }, [])

  const setPageSize = (n) => setFiltersState({ pageSize: Number(n), page: 1 })
  const goTo = (p) => {
    if (p > 0) {
      setFiltersState({ page: p })
      loadUsers();
    }
  }

  async function loadUsers() {
    setLoadingState(true)
    setLoadErrorMessage(null)
    try {
      const res = await fetchUsers({
        page: filters.page,
        pageSize: filters.pageSize,
      })
      setUsersList(res.items)
      setTotalUsers(res.total)
    } catch (e) {
      setLoadErrorMessage(e?.message || String(e))
      setUsersList([])
      setTotalUsers(0)
    } finally {
      setLoadingState(false)
    }
  }

  const totalPages = useMemo(() => {
    return Math.ceil(total / filters.pageSize)
  }, [total, filters.pageSize])

  return (
    <section>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '8px 0', flexWrap: 'wrap' }}>
        <UserSearch
          query={query}
          onChange={setQuery}
          page={filters.page} pageSize={filters.pageSize} />
        {loading ? <Loading /> : (<>
          <label>
            Tamaño de página:
            <select
              value={filters.pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid #ddd' }}
            >
              {/* permitir 0 rompe la paginación */}
              <option value={0}>0</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>

          <div style={{ marginLeft: 'auto' }}>
            <strong>{total}</strong> resultados
          </div></>)}


      </div>

      {loadError && (
        <Error message={loadError} />
      )}

      <ul style={{ border: '1px solid #eee', borderRadius: 8, padding: 0, margin: 0, minHeight: 52 }}>
        {!loading && userList.map(user => (
          <UserItem key={user.id} user={user} />
        ))}
        {!loading && !loadError && userList.length === 0 && (
          <li style={{ listStyle: 'none', padding: 12, color: '#777' }}>Sin resultados</li>
        )}
      </ul>

      <nav style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12 }}>
        <button disabled={filters.page <= 1} onClick={() => goTo(filters.page - 1)}>Anterior</button>
        <span>Página {filters.page} / {String(totalPages)}</span>
        <button disabled={filters.page >= totalPages} onClick={() => goTo(filters.page + 1)}>Siguiente</button>
      </nav>
    </section>
  )
}
