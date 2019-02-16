import * as React from 'react'
import { useContext } from 'react'
import { StateChart } from './components/StateChart'
import { Layout } from './components/Layout'
import { RootProvider, RootContext } from './machines/Root'

// TODO HACK we shouldn't need to bring in the defaultMachine here
import * as rawDefaultMachineText from './sampleMachines/defaultMachine.js.txt'
const defaultMachine = rawDefaultMachineText.default

const WrappedApp = () => {
  const rootContext = useContext(RootContext)
  // TODO HACK eliminate the failover on the next line
  const machine = rootContext.machineCode
    ? rootContext.machineCode
    : defaultMachine

  return (
    <RootProvider>
      <Layout>
        <StateChart machine={machine} height={'calc(100vh - 70px)'} />
      </Layout>
    </RootProvider>
  )
}

export const App = () => {
  return (
    <RootProvider>
      <WrappedApp />
    </RootProvider>
  )
}
