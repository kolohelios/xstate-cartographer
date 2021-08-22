import * as React from 'react'
import { useRef } from 'react'
import { Edge, EventObject } from 'xstate'

interface Props {
	edges: Edge<any, EventObject, string>[]
	previewEvent: any
	preview: any
	current: any
}

function relative(childRect: ClientRect, parentRect: ClientRect): ClientRect {
	return {
		top: childRect.top - parentRect.top,
		right: childRect.right - parentRect.left,
		bottom: childRect.bottom - parentRect.top,
		left: childRect.left - parentRect.left,
		width: childRect.width,
		height: childRect.height,
	}
}

interface Point {
	x: number
	y: number
}

function center(rect: ClientRect): Point {
	return {
		x: rect.left + rect.width / 2,
		y: rect.top + rect.height / 2,
	}
}

export const SVGElement = (props: Props) => {
	const { edges, previewEvent, preview, current } = props
	const svgRef = useRef<SVGSVGElement>(null)

	return (
		<svg
			width="100%"
			height="100%"
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				// @ts-ignore
				'--color': 'gray',
				overflow: 'visible',
				pointerEvents: 'none',
			}}
			ref={svgRef}>
			<defs>
				<marker
					id="marker"
					markerWidth="4"
					markerHeight="4"
					refX="2"
					refY="2"
					markerUnits="strokeWidth"
					orient="auto">
					<path d="M0,0 L0,4 L4,2 z" fill="var(--color-edge)" />
				</marker>
				<marker
					id="marker-preview"
					markerWidth="4"
					markerHeight="4"
					refX="2"
					refY="2"
					markerUnits="strokeWidth"
					orient="auto">
					<path d="M0,0 L0,4 L4,2 z" fill="var(--color-primary)" />
				</marker>
			</defs>
			{edges.map((edge, i) => {
				if (!svgRef.current) {
					return
				}

				const elEvent = document.querySelector(
					`[data-id="${edge.source.id}:${edge.event}"]`,
				)
				const elSource = document.querySelector(`[data-id="${edge.source.id}"]`)
				const elTarget = document.querySelector(`[data-id="${edge.target.id}"]`)

				if (!elEvent || !elTarget || !elSource) {
					return
				}

				const sourceRect = relative(
					elSource.getBoundingClientRect(),
					svgRef.current.getBoundingClientRect(),
				)
				const eventRect = relative(
					elEvent.getBoundingClientRect(),
					svgRef.current.getBoundingClientRect(),
				)
				const targetRect = relative(
					elTarget.getBoundingClientRect(),
					svgRef.current.getBoundingClientRect(),
				)
				const eventCenterPt = center(eventRect)
				const targetCenterPt = center(targetRect)

				const start = {
					x: eventRect.right - 5,
					y: eventCenterPt.y + 1,
				}
				const midpoints: Point[] = []
				const end = { x: targetRect.left - 4, y: targetRect.bottom }

				if (start.y > targetRect.top && start.y < targetRect.bottom) {
					end.y = start.y
				}
				if (start.x > end.x) {
					start.x = eventRect.right - 8
					start.y = eventCenterPt.y + 4
					midpoints.push({
						x: start.x,
						y: sourceRect.bottom + 10,
					})
					midpoints.push({
						x: sourceRect.left,
						y: sourceRect.bottom + 10,
					})
					midpoints.push({
						x: targetRect.right - 10,
						y: targetRect.bottom + 10,
					})
					end.x = targetRect.right - 10
					end.y = targetRect.bottom + 4
				}

				if (start.y < targetRect.top) {
					end.y = targetRect.top
				}

				if (start.x <= targetRect.right && start.x >= targetRect.left) {
					end.x = start.x
				}

				const pathMidpoints = midpoints
					.map(midpoint => {
						return `L ${midpoint.x},${midpoint.y}`
					})
					.join(' ')

				const isHighlighted =
					edge.event === previewEvent &&
					current.matches(edge.source.path.join('.')) &&
					preview &&
					preview.matches(edge.target.path.join('.'))

				return (
					<path
						key={i}
						d={`M${start.x} ${start.y - 1} ${pathMidpoints} ${end.x} ${end.y}`}
						stroke={
							isHighlighted ? 'var(--color-primary)' : 'var(--color-edge)'
						}
						strokeWidth={2}
						fill="none"
						markerEnd={isHighlighted ? `url(#marker-preview)` : `url(#marker)`}
					/>
				)
			})}
		</svg>
	)
}
