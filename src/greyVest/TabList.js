import React from 'react'
import _ from 'lodash/fp.js'
import { observer } from 'mobx-react'

let TabList = ({ value, onChange = () => {}, options }) => (
  <div className="gv-tab-container">
    {_.map(
      (x) => (
        <div
          key={x.value}
          className={`gv-tab ${x.value === value ? 'active' : ''}`}
          onClick={() => onChange(x.value, value)}
        >
          {x.label}
        </div>
      ),
      options
    )}
  </div>
)

export default observer(TabList)
