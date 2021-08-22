import * as React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { State } from 'xstate'
import { Editor } from './Editor'

interface Props {
	current: State<any, any>
}

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

interface SelectedViewProps {
	view: string
	current: any
}

const SelectedView = (props: SelectedViewProps) => {
	const { current, view } = props
	switch (view) {
		case 'definition':
			return <Editor />
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

export const ToolPanel = (props: Props) => {
	const { current } = props
	const [activeView, setView] = useState('definition')

	return (
		<React.Fragment>
			<StyledViewTabs>
				{['definition', 'state'].map(view => {
					return (
						<li onClick={() => setView(view)} key={view}>
							{view}
						</li>
					)
				})}
			</StyledViewTabs>
			<SelectedView view={activeView} current={current} />
		</React.Fragment>
	)
}
