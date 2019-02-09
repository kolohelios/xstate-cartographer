# xstate-cartographer

For the time being, this is just a lightweight local dev implementation of an XState statechart visualizer.

## Credit

All credit goes to [David Khourshid](https://github.com/davidkpiano) for creating XState and inspiring lots of us to participate in the statechart community, and those who came before David through their creation of SCXML and the philosophy behind state machines. FSMs for the win!

Please consider becoming a [sponsor](https://opencollective.com/xstate) of and contributor to XState.

## Inspiration

More than simply inspriation, the  starting point for this project is David Khourshid's [xstate-viz](https://github.com/statecharts/xstate-viz); see it in action [here](https://statecharts.github.io/xstate-viz/). The code was originally forked from `xstate-viz` and then separated.

## Current feature wish list

- [ ] render children machines
- [ ] handle TypeScript compilation
- [ ] provide "dark mode" setting
- [ ] use localStorage to persist statechart(s)
- [ ] add ability to load examples as presets for exploration
- [ ] add mock API functionality for asyncronous event
- [ ] create two-way statechart changes based on  UI interaction
- [ ] create an Electron app for even more local visualization