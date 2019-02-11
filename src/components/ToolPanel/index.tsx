import * as React from 'react'
import AceEditor from 'react-ace'
import styled from 'styled-components'
import { State } from 'xstate'
import 'brace/theme/monokai'
import 'brace/mode/typescript'

interface Props {
  view: string
  current: State<any, any>
  code: string
  updateCode: (code: string) => void
}

const StyledField = styled.div`
  > label {
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.5em;
    font-weight: bold;
  }
`

interface FieldProps {
  label: string
  children: any
}
function Field({ label, children }: FieldProps) {
  return (
    <StyledField>
      <label>{label}</label>
      {children}
    </StyledField>
  )
}

export const ToolPanel = (props: Props) => {
  const { view, current, code, updateCode } = props

  switch (view) {
    case 'definition':
      return (
        <AceEditor
          mode="typescript"
          theme="monokai"
          editorProps={{ $blockScrolling: true }}
          value={code}
          onChange={value => updateCode(value)}
          setOptions={{ tabSize: 2 }}
          width="100%"
          height="100%"
        />
      )
    case 'state':
      return (
        <div>
          <Field label="Value">
            <pre>{JSON.stringify(current.value, null, 2)}</pre>
          </Field>
          <Field label="Actions">
            {current.actions.length ? (
              <ul>
                {current.actions.map((action: { type: string }) => {
                  return <li key={action.type}>{action.type}</li>
                })}
              </ul>
            ) : (
              '-'
            )}
          </Field>
          <Field label="Context">
            {current.context !== undefined ? (
              <pre>{JSON.stringify(current.context, null, 2)}</pre>
            ) : (
              '-'
            )}
          </Field>
        </div>
      )
    default:
      return null
  }
}
