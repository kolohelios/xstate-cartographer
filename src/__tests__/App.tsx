import * as React from 'react'
import { StateChart } from '../StateChart'
import TestRenderer from 'react-test-renderer'

jest.genMockFromModule('xstate')

const stateChart = `
const lightMachine = Machine({
  id: "light",
  initial: "green",
  states: {
    green: {
      on: { TIMER: "yellow" }
    },
    yellow: {
      on: { TIMER: "red" }
    },
    red: {
      on: { TIMER: "green" }
    }
  }
});
`

describe('make sure that App renders', () => {
  it('should render', () => {
    const app = TestRenderer.create(
      <StateChart machine={stateChart} />
    ).toJSON()
    expect(app).toBeDefined()
  })
})
