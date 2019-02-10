import * as React from 'react'
import TestRenderer from 'react-test-renderer'
import { Header } from '.'

describe('Header', () => {
  it('renders correctly', () => {
    const header = TestRenderer.create(<Header />).toJSON()
    expect(header).toMatchSnapshot()
  })
})
