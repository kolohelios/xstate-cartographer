import * as React from 'react'
import { StateChartWrapper } from './components/StateChart'
import { Layout } from './components/Layout'
import { AppProvider } from './machines/App/provider'
import { rootMachineService } from './machines/Root'

rootMachineService.start()

export const App = () => {
  return (
    <AppProvider>
      <Layout>
        <StateChartWrapper height={'calc(100vh - 70px)'} />
      </Layout>
    </AppProvider>
  )
}
