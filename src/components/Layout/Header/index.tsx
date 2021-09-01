import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { useActor } from '@xstate/react'
import { AppMachineEvents } from 'src/machines/App'
import { GlobalStateContext } from 'src/App'

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
	const globalServices = useContext(GlobalStateContext)
	const [state, send] = useActor(globalServices.appMachineService!)

	useEffect(() => {
		console.log(state)
	}, [state])

	const updateStateChart = () => send(AppMachineEvents.UpdateStateChart)

	return (
		<HeaderContainer>
			<HeaderText>XState Cartographer</HeaderText>
			<Button onClick={updateStateChart}>Update Chart</Button>
		</HeaderContainer>
	)
}
