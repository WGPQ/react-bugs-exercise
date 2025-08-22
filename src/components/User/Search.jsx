import { useEffect } from "react";
import useUser from "../hooks/useUser";
import useUserContext from "../../context/useUserContex";

export const UserSearch = ({ query, onChange }) => {
    const { fetchUsers } = useUser();
    const {
        filters,
        clearLoadError,
        setLoadingState,
        setFiltersState,
        setTotalUsers,
        setLoadErrorMessage,
        setUsersFiltresList,
    } = useUserContext();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim() !== '') {
                setFiltersState({
                    page: 1,
                    pageSize: 10,
                })
                searchUsers();
            } else {
                setUsersFiltresList([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    async function searchUsers() {
        clearLoadError(null)
        setLoadingState(true)
        try {
            const response = await fetchUsers({
                q: query,
                page: filters.page,
                pageSize: filters.pageSize,
            })
            setUsersFiltresList(response.items)
            // setTotalUsers(response.total)
        } catch (e) {
            setLoadErrorMessage(e?.message || String(e))
            setUsersFiltresList([])
            setTotalUsers(0)
        } finally {
            setLoadingState(false)
        }
    }
    return (
        <label style={{ flex: '1 1 260px' }}>
            Buscar:
            <input
                value={query}
                onChange={(e) => onChange(e.target.value)}
                type="search"
                placeholder="Nombre… (ej. John)"
                style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: 8 }}
            />
        </label>
    )
}

