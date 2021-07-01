import { ButtonHTMLAttributes } from 'react'

import '../styles/button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button( props: ButtonProps ) {
  return (
    // trás todas as props para dentro do componente em forma de atributos
    <button className="button" {...props} />
  )
}