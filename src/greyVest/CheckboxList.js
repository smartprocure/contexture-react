import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import { observer } from 'mobx-react'
import Checkbox from './Checkbox.js'

let CheckboxList = ({ options, value, onChange, ...props }) => (
  <div {...props}>
    {_.map(
      (option) => (
        <label
          key={option.value}
          style={{ display: 'flex', cursor: 'pointer', marginRight: 25 }}
        >
          <Checkbox
            {...F.domLens.checkboxValues(option.value, {
              get: () => value,
              set: onChange,
            })}
          />
          <div style={{ paddingLeft: 15 }}>{option.label}</div>
        </label>
      ),
      options
    )}
  </div>
)

export default observer(CheckboxList)
