import { createContext, ReactNode, useEffect, useState } from "react"
import { auth, firebase } from "../services/firebase"

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider (props: AuthContextProviderProps) {
  // dados do usuário
  const [user, setUser] = useState<User>()

  // valida se o usuário já estava logado no load/reload da página
  useEffect(() => {
    // registra o unload do watcher (boas práticas)
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account (name and/or photo).')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    return () => {
      unsubscribe();
    }
  }, [])

  // login do Google
  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()
    const result = await auth.signInWithPopup(provider)

    if (result.user) {
      const { displayName, photoURL, uid } = result.user

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account (name and/or photo).')
      }

      // salvando os dados do usuário no context (AuthContext)
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {/* carrega todo o conteúdo do componente pai para dentro deste */}
      {props.children}
    </AuthContext.Provider>
  )
}