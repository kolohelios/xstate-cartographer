import * as React from "react";
import { appMachineService, AppMachine, AppMachineEvents } from ".";

export const updateCode = (updatedCode: string) =>
  appMachineService.send({
    type: AppMachineEvents.UpdateCode,
    data: updatedCode,
  });

export const updateStateChart = () =>
  appMachineService.send({
    type: AppMachineEvents.UpdateStateChart,
  });

export const AppContext = React.createContext(
  appMachineService.initialState.context
);

interface Props {
  children: React.ReactNode;
}

export const AppProvider = (props: Props) => {
  const [state, setState] = React.useState(
    appMachineService.initialState.context
  );
  appMachineService.onTransition((newState) => {
    setState(newState.context);
  });

  return (
    <AppContext.Provider value={state}>{props.children}</AppContext.Provider>
  );
};
