import * as React from 'react'
import { Header } from './Header'

interface Props {
  children: React.ReactNode
}

export const Layout = (props: Props) => {
  return (
    <div>
      <Header />
      {props.children}
    </div>
  )
}
