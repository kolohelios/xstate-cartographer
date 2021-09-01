import * as React from 'react'
import TestRenderer from 'react-test-renderer'
import { Header } from '.'

jest.mock('src/sampleMachines/defaultMachine.js.txt', () => {})

describe('Header', () => {
	it.todo('renders correctly', /*() => {
		const header = TestRenderer.create(<Header />).toJSON()
		expect(header).toMatchSnapshot()
	}*/)

})
