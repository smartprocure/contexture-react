import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { observable } from '../utils/mobx.js'
import ThemePicker from '../stories/themePicker.js'
import { TreePauseButton } from './index.js'
import { SearchTree } from '../index.js'

let pauseWith = action('set paused')

let state = observable({ paused: true })
let tree = {
  pauseNested() {
    pauseWith((state.paused = true))
  },
  unpauseNested() {
    pauseWith((state.paused = false))
  },
  isPausedNested: () => state.paused,
}

storiesOf('Search Components|Internals/TreePauseButton', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('One Tree', () => (
    <TreePauseButton>
      <SearchTree tree={tree} path={['root']} />
    </TreePauseButton>
  ))
  .add('Multiple Trees', () => (
    <TreePauseButton>
      <SearchTree tree={tree} path={['root']} />
      <SearchTree tree={tree} path={['root']} />
    </TreePauseButton>
  ))
  .add('Falsey Trees', () => (
    <TreePauseButton>
      <SearchTree tree={tree} path={['root']} />
      {false && <SearchTree tree={tree} path={['root']} />}
    </TreePauseButton>
  ))
