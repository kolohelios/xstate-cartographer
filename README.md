# xstate-cartographer

[![Build Status](https://travis-ci.org/kolohelios/xstate-cartographer.svg?branch=master)](https://travis-ci.org/kolohelios/xstate-cartographer)
[![Coverage Status](https://coveralls.io/repos/github/kolohelios/xstate-cartographer/badge.svg?branch=master)](https://coveralls.io/github/kolohelios/xstate-cartographer?branch=master)

For the time being, this is just a lightweight local dev implementation of an XState statechart visualizer.

## Credit

All credit goes to [David Khourshid](https://github.com/davidkpiano) for creating XState and inspiring lots of us to participate in the statechart community, and those who came before David through their creation of SCXML and the philosophy behind state machines. FSMs for the win!

Please consider becoming a [sponsor](https://opencollective.com/xstate) of and contributor to XState.

## Inspiration

More than simply inspiration, the starting point for this project is David Khourshid's [xstate-viz](https://github.com/statecharts/xstate-viz); see it in action [here](https://statecharts.github.io/xstate-viz/). The code was originally forked from `xstate-viz` and then separated.

## Current feature wish list

- [ ] add versioning strategy for statecharts
- [ ] create statechart sharing process through URLs
- [ ] add cloud storage system (this needs some thought)
- [ ] render children machines
- [x] handle TypeScript compilation
- [ ] provide "dark mode" setting
- [ ] use localStorage to persist statechart(s)
- [ ] add ability to load examples as presets for exploration
- [ ] add mock API functionality for asynchronous event
- [ ] create two-way statechart changes based on UI interaction
- [ ] implement the PWA pattern so the visualizer can be used in no and limited bandwidth circumstances
- [ ] create an Electron app for even more local visualization
- [x] add Travis CI and Coveralls testing
- [ ] add support for better testing
