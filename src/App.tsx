import * as React from 'react'
import { StateChart } from './StateChart'

const rawDefaultMachineText = require('./defaultMachine.js.txt')

const defaultMachine = Object.values(rawDefaultMachineText).join('')

export const App = () => {
  return <StateChart machine={defaultMachine} height={'calc(100vh - 30px)'} />
}
