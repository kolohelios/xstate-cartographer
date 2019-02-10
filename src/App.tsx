import * as React from 'react'
import { StateChart } from './components/StateChart'

const rawDefaultMachineText = require('./sampleMachines/defaultMachine.js.txt')

const defaultMachine = Object.values(rawDefaultMachineText).join('')

export const App = () => {
  return <StateChart machine={defaultMachine} height={'calc(100vh - 30px)'} />
}
