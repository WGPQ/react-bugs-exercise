import http from "../lib/http"

const UserServices = () => {
    const base = '/users'
    const fetchUsers = async ({ q, pageSize, skip }) => {
        try {
            const params = new URLSearchParams({ limit: String(pageSize), skip: String(skip) })
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
        } catch (error) {
            throw new Error('Error fetching users', error)
        }
    }

    return {
        fetchUsers,
    }
}

export default UserServices