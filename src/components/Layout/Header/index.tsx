import * as React from 'react'
import styled from 'styled-components'
import { updateStateChart } from 'src/machines/App/provider'

const HeaderContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	background-color: #eaeaea;
	padding: 0;
	margin: 0;
	height: 50px;
	position: fixed;
	width: 100vw;
`

const HeaderText = styled.p`
	font-size: 24;
	font-family: 'Roboto', sans-serif;
	margin-left: 20px;
`

const Button = styled.button`
	margin-right: 20px;
	height: 20px;
	align-self: center;
`

export const Header = () => {
	return (
		<HeaderContainer>
			<HeaderText>XState Cartographer</HeaderText>
			<Button onClick={updateStateChart}>Update Chart</Button>
		</HeaderContainer>
	)
}
