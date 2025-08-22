import UserServices from "../../services/userServices"

const useUser = () => {
    // Latencia simulada no borrar !
    const sleep = (ms) => new Promise(r => setTimeout(r, ms))

    const fetchUsers = async ({ q, page, pageSize }) => {
        // jitter aleatorio + penalización si incluye determinadas letras no borrar 
        // Simular latencia distinta en cada peticion
        const jitter = 200 + Math.random() * 1200
        const penalty = /a|e|i|o|u/i.test(q || '') ? 1000 : 0
        await sleep(jitter + penalty)

        const skip = Math.max(0, (page - 1) * pageSize)
        const response= await UserServices().fetchUsers({ q, pageSize, skip })
        return response
    }
    return {
        fetchUsers,
    }
}

export default useUser
