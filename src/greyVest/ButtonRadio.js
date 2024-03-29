import React from 'react'
import _ from 'lodash/fp.js'
import Button from './Button.js'
import { Flex } from '../greyVest/index.js'

let ButtonRadio = ({ value, onChange = () => {}, options, style = {} }) => (
  <Flex className="gv-button-radio" style={{ alignItems: 'baseline' }}>
    {_.map(
      (x) => (
        <Button
          key={x.value}
          isActive={x.value === value}
          onClick={() => onChange(x.value)}
          style={style}
        >
          {x.label}
        </Button>
      ),
      options
    )}
  </Flex>
)
export default ButtonRadio
