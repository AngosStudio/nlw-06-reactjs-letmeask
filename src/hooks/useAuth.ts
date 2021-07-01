import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

// criado o hook para simplificar o import do Auth nas Rotas
export function useAuth() {
  const value = useContext(AuthContext)

  return value
}