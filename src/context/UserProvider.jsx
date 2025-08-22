import { useState } from "react"
import { UserContext } from "./UserContext"


export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [usersFiltres, setUsersFiltres] = useState([]);
    const [loadError, setLoadError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        page: 1,
        pageSize: 10,
    })


    const setUsersList = (users) => {
        if (Array.isArray(users)) {
            setUsers(users);
        }
    }

    const setLoadErrorMessage = (error) => {
        if (typeof error === 'string') {
            setLoadError(error);
        }
    }
    const clearLoadError = () => {
        setLoadError(null);
    }

    const setLoadingState = (isLoading) => {
        setLoading(isLoading);
    }

    const setUsersFiltresList = (users) => {
        if (Array.isArray(users)) {
            setUsersFiltres(users);
        }
    }

    const setTotalUsers = (total) => {
        setTotal(total);
    }

    const setFiltersState = (newFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    }

    return (
        <UserContext.Provider
            value={{
                users,
                setUsersList,
                loadError,
                setLoadErrorMessage,
                clearLoadError,
                loading,
                setLoadingState,
                usersFiltres,
                setUsersFiltresList,
                total,
                setTotalUsers,
                filters,
                setFiltersState,
            }}>
            {children}
        </UserContext.Provider>
    )
}

