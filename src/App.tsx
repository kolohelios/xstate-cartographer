import * as React from 'react'
import { StateChart } from './components/StateChart'
import { Layout } from './components/Layout'
import { RootProvider } from './machines/Root'

const rawDefaultMachineText = require('./sampleMachines/defaultMachine.js.txt')

const defaultMachine = Object.values(rawDefaultMachineText).join('')

export const App = () => {
  return (
    <RootProvider>
      <Layout>
        <StateChart machine={defaultMachine} height={'calc(100vh - 70px)'} />
      </Layout>
    </RootProvider>
  )
}
