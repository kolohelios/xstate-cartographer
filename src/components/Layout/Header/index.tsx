import * as React from 'react'
import styled from 'styled-components'

const HeaderContainer = styled.div`
  display: flex;
  background-color: #eaeaea;
  padding: 0;
  margin: 0;
  height: 50px;
`

const HeaderText = styled.p`
  font-size: 24;
  font-family: 'Roboto', sans-serif;
  margin-left: 20px;
`

export const Header = () => {
  return (
    <HeaderContainer>
      <HeaderText>XState Cartographer</HeaderText>
    </HeaderContainer>
  )
}
