import React from 'react'
import { configure } from 'mobx'
import greyVest from '../src/themes/greyVest/index.js'
import { ThemeProvider } from '../src/utils/theme.js'

configure({ enforceActions: 'never', useProxies: 'never' })

export const parameters = {
  options: {
    storySort: {
      order: ['Docs', 'Theming', 'Example Types', 'Search Components'],
    },
  },
}

export const decorators = [
  (Story) => (
    <ThemeProvider theme={greyVest}>
      <Story />
    </ThemeProvider>
  ),
]
