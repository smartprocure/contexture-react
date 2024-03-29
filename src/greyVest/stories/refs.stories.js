import { storiesOf } from '@storybook/react'
import React from 'react'
import { Button, TextInput, Textarea, Select } from '..'
import decorator from './decorator.js'

let input
let select
let textArea

storiesOf('GreyVest Library|Refs', module)
  .addDecorator(decorator)
  .add('story', () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TextInput ref={(e) => (input = e)} />
      <Textarea ref={(e) => (textArea = e)} />
      <Select ref={(e) => (select = e)} />
      <Button onClick={() => input.focus()}>Focus Input</Button>
      <Button onClick={() => textArea.focus()}>Focus Text Area</Button>
      <Button onClick={() => select.focus()}>Focus Select</Button>
    </div>
  ))
