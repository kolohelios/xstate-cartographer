import * as React from 'react'
import { useContext } from 'react'
import { StateChart } from './components/StateChart'
import { Layout } from './components/Layout'
import { AppProvider, AppContext } from './machines/App/provider'
import { rootMachineService } from './machines/Root'

rootMachineService.start()

// TODO HACK we shouldn't need to bring in the defaultMachine here
import * as rawDefaultMachineText from './sampleMachines/defaultMachine.js.txt'
const defaultMachine = rawDefaultMachineText.default

const WrappedApp = () => {
  const appContext = useContext(AppContext)
  // TODO HACK eliminate the failover on the next line
  const machine = appContext.machineCode
    ? appContext.machineCode
    : defaultMachine

  return (
    <Layout>
      <StateChart machine={machine} height={'calc(100vh - 70px)'} />
    </Layout>
  )
}

export const App = () => {
  return (
    <AppProvider>
      <WrappedApp />
    </AppProvider>
  )
}
