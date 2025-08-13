import axios from 'axios'

const http = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 8000,
})

export default http
