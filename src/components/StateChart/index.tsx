import * as React from 'react'
import styled from 'styled-components'
import { interpret, Interpreter } from 'xstate/lib/interpreter'
import { Machine as _Machine, StateNode, State } from 'xstate'
import { getEdges } from 'xstate/lib/graph'
import { StateChartNode } from './StateChartNode'
import { ToolPanel } from '../ToolPanel'
import { toMachine } from 'src/lib/utils'
import { SVGElement } from './SVGElement'

const StyledViewTabs = styled.ul`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  margin: 0;
  padding: 0;
  height: 1rem;

  > li {
    padding: 0 0.5rem;
    text-align: center;
    list-style: none;
  }
`

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
`

interface StateChartProps {
  machine: StateNode<any> | string
  height?: number | string
}

interface StateChartState {
  machine: StateNode<any>
  current: State<any, any>
  preview?: State<any, any>
  previewEvent?: string
  view: string //"definition" | "state";
  code: string
  toggledStates: Record<string, boolean>
}

const StyledVisualization = styled.div`
  max-height: inherit;
  overflow-y: scroll;
`
export class StateChart extends React.Component<
  StateChartProps,
  StateChartState
> {
  state: StateChartState = (() => {
    const machine = toMachine(this.props.machine)
    // const machine = this.props.machine;

    return {
      current: machine.initialState,
      preview: undefined,
      previewEvent: undefined,
      view: 'definition', // or 'state'
      machine: machine,
      code:
        typeof this.props.machine === 'string'
          ? this.props.machine
          : `Machine(${JSON.stringify(machine.definition, null, 2)})`,
      toggledStates: {},
    }
  })()
  service = interpret(this.state.machine).onTransition(current => {
    this.setState({ current }, () => {
      if (this.state.previewEvent) {
        this.setState({
          preview: this.service.nextState(this.state.previewEvent),
        })
      }
    })
  })
  svgRef = React.createRef<SVGSVGElement>()
  componentDidMount() {
    this.service.start()
  }
  toggleState(id: string) {
    this.setState({
      toggledStates: {
        ...this.state.toggledStates,
        [id]: !this.state.toggledStates[id],
      },
    })
  }
  updateMachine() {
    const { code } = this.state

    const machine = toMachine(code)

    this.setState(
      {
        machine,
      },
      () => {
        this.service.stop()
        this.service = interpret(this.state.machine)
          .onTransition(current => {
            this.setState({ current }, () => {
              if (this.state.previewEvent) {
                this.setState({
                  preview: this.service.nextState(this.state.previewEvent),
                })
              }
            })
          })
          .start()
      }
    )
  }
  updateCode = (code: string) => {
    this.setState({ code })
  }
  render() {
    const { current, preview, previewEvent, machine } = this.state

    const edges = getEdges(machine)

    const stateNodes = machine.getStateNodes(current)
    const events = new Set()

    stateNodes.forEach(stateNode => {
      const potentialEvents = Object.keys(stateNode.on)

      potentialEvents.forEach(event => {
        const transitions = stateNode.on[event]

        transitions.forEach(transition => {
          if (transition.target !== undefined) {
            events.add(event)
          }
        })
      })
    })

    return (
      <StyledStateChart
        style={{
          height: this.props.height || '100%',
          // @ts-ignore
          '--color-border': '#dedede',
          '--color-primary': 'rgba(87, 176, 234, 1)',
          '--color-primary-faded': 'rgba(87, 176, 234, 0.5)',
          '--color-primary-shadow': 'rgba(87, 176, 234, 0.1)',
          '--color-link': 'rgba(87, 176, 234, 1)',
          '--color-disabled': '#888',
          '--color-edge': 'rgba(0, 0, 0, 0.2)',
          '--radius': '0.2rem',
        }}
      >
        <StyledVisualization>
          <StateChartNode
            stateNode={this.state.machine}
            current={current}
            preview={preview}
            onEvent={this.service.send.bind(this)}
            onPreEvent={event =>
              this.setState({
                preview: this.service.nextState(event),
                previewEvent: event,
              })
            }
            onToggle={id => this.toggleState(id)}
            onExitPreEvent={() =>
              this.setState({ preview: undefined, previewEvent: undefined })
            }
            toggledStates={this.state.toggledStates}
            toggled={true}
          />
          <SVGElement
            edges={edges}
            previewEvent={previewEvent}
            current={current}
            preview={preview}
          />
        </StyledVisualization>
        <div
          style={{
            overflow: 'scroll',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <StyledViewTabs>
            {['definition', 'state'].map(view => {
              return (
                <li onClick={() => this.setState({ view })} key={view}>
                  {view}
                </li>
              )
            })}
          </StyledViewTabs>
          <ToolPanel
            view={this.state.view}
            current={this.state.current}
            code={this.state.code}
            updateCode={this.updateCode}
          />
          <footer>
            <button onClick={() => this.updateMachine()}>Update</button>
          </footer>
        </div>
      </StyledStateChart>
    )
  }
}
