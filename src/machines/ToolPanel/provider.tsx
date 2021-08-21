import * as React from "react";
import {
  toolPanelMachineService,
  ToolPanelMachine,
  ToolPanelMachineEvents,
} from ".";

// TODO make the mode an enum and reference it in state names as well
export const toggleToolPanel = (mode: string) => {
  switch (mode) {
    case "definition":
      toolPanelMachineService.send({
        type: ToolPanelMachineEvents.ShowDefinition,
      });
    case "state":
      toolPanelMachineService.send({
        type: ToolPanelMachineEvents.ShowState,
      });
  }
};

export const ToolPanelContext = React.createContext(
  ToolPanelMachine.initialState.context
);

interface Props {
  children: React.ReactNode;
}

export const ToolPanelProvider = (props: Props) => {
  const [state, setState] = React.useState(
    ToolPanelMachine.initialState.context
  );

  toolPanelMachineService.onTransition((newState) => {
    console.log(newState);
    setState(newState.context);
  });

  return (
    <ToolPanelContext.Provider value={state}>
      {props.children}
    </ToolPanelContext.Provider>
  );
};
