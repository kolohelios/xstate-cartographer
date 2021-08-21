import * as React from "react";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { interpret, Interpreter } from "xstate/lib/interpreter";
import {
  Machine as _Machine,
  StateNode,
  State,
  OmniEventObject,
  EventObject,
} from "xstate";
import { getEdges } from "xstate/lib/graph";
import { StateChartNode } from "./StateChartNode";
import { ToolPanel } from "../ToolPanel";
import { toMachine } from "src/lib/utils";
import { SVGElement } from "./SVGElement";
import SplitPane from "react-split-pane";
import { AppContext } from "src/machines/App/provider";

import * as rawText from "../../sampleMachines/defaultMachine.js.txt";
const defaultMachine = rawText.default;

const StyledStateChart = styled.div`
  display: grid;
  grid-template-columns: 1fr 30rem;
  grid-template-rows: auto;
  font-family: sans-serif;
  font-size: 10px;
  overflow: hidden;
  max-height: inherit;

  > * {
    max-height: inherit;
    overflow-y: scroll;
  }
`;

interface StateChartProps {
  height?: number | string;
  machine: StateNode<any>;
}

interface StateChartState {
  machine: StateNode<any>;
  current: State<any, any>;
  preview?: State<any, any>;
  previewEvent?: string;
  code: string;
  toggledStates: Record<string, boolean>;
}

const StyledVisualization = styled.div`
  max-height: inherit;
  overflow-y: scroll;
`;

// TODO verify that getEvents is needed
const getEvents = (stateNodes: StateNode<any>[]) => {
  const events = new Set();
  stateNodes.forEach((stateNode) => {
    const potentialEvents = Object.keys(stateNode.on);

    potentialEvents.forEach((event) => {
      const transitions = stateNode.on[event];

      transitions.forEach((transition) => {
        if (transition.target !== undefined) {
          events.add(event);
        }
      });
    });
  });

  return events;
};

interface StateChartWrapperProps {
  height?: number | string;
}

const HideToolPanel = () => {
  return (
    <div>
      <div style={{ backgroundColor: "green", height: 40, width: 40 }} />
      <div style={{ backgroundColor: "green", height: 40, width: 40 }} />
    </div>
  );
};

export const StateChartWrapper = (props: StateChartWrapperProps) => {
  const appContext = React.useContext(AppContext);
  const [machine, setMachine] = useState(defaultMachine);

  // setMachine(appContext.stagedMachineCode)

  return <StateChart machine={machine} />;
};

export const StateChart = (props: StateChartProps) => {
  const initialMachine = toMachine(props.machine);

  const [current, setCurrent] = useState(initialMachine.initialState);
  const [preview, setPreview] = useState<
    State<any, OmniEventObject<EventObject>> | undefined
  >(undefined);
  const [previewEvent, setPreviewEvent] = useState<string | undefined>(
    undefined
  );
  const [machine, setMachine] = useState(initialMachine);
  const [toggledStates, setToggledStates] = useState<Record<string, boolean>>(
    {}
  );

  const service = useMemo(() => {
    const service = interpret(initialMachine);
    service.onTransition((newCurrent) => {
      setCurrent(newCurrent);

      if (previewEvent) {
        const newPreview = service.nextState(previewEvent);

        setPreview(newPreview);
      }
    });
    service.start();
    return service;
  }, [props.machine]);

  // React.useEffect(() => {
  //   service.stop()
  //   service.onTransition(newCurrent => {
  //     console.log('onTransition')
  //     setCurrent(newCurrent)

  //     if (previewEvent) {
  //       const newPreview = service.nextState(previewEvent)

  //       setPreview(newPreview)
  //     }
  //   })

  //   return () => {
  //     service.stop()
  //   }
  // }, [props.machine])

  const toggleState = (id: string) => {
    setToggledStates({
      ...toggledStates,
      [id]: !toggledStates[id],
    });
  };

  const edges = getEdges(machine);

  return (
    <StyledStateChart
      style={{
        height: props.height || "100%",
        // @ts-ignore
        "--color-border": "#dedede",
        "--color-primary": "rgba(87, 176, 234, 1)",
        "--color-primary-faded": "rgba(87, 176, 234, 0.5)",
        "--color-primary-shadow": "rgba(87, 176, 234, 0.1)",
        "--color-link": "rgba(87, 176, 234, 1)",
        "--color-disabled": "#888",
        "--color-edge": "rgba(0, 0, 0, 0.2)",
        "--radius": "0.2rem",
      }}
    >
      <SplitPane
        split="horizontal"
        minSize={350}
        primary="second"
        resizerStyle={{
          backgroundColor: "#000",
          width: 11,
          cursor: "ew-resize",
        }}
      >
        <StyledVisualization>
          <StateChartNode
            stateNode={machine}
            current={current}
            preview={preview}
            onEvent={(e) => {
              console.log(e, service);
              service.send(e);
            }}
            onPreEvent={(event: string) => {
              if (event) {
                setPreview(service.nextState(event));
                setPreviewEvent(event);
              }
            }}
            onToggle={(id) => toggleState(id)}
            onExitPreEvent={() => {
              setPreview(undefined);
              setPreviewEvent(undefined);
            }}
            toggledStates={toggledStates}
            toggled={true}
          />
          <SVGElement
            edges={edges}
            previewEvent={previewEvent}
            current={current}
            preview={preview}
          />
        </StyledVisualization>
        <ToolPanel current={current} />
      </SplitPane>
      <HideToolPanel />
    </StyledStateChart>
  );
};
