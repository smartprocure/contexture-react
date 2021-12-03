import F from 'futil'
import React from 'react'
import { observer } from 'mobx-react'

export let DropdownItem = ({ style = {}, ...props }) => {
  let hovering = React.useState(false)
  return (
    <div
      data-testid="div-DropdownItem"
      style={{
        cursor: 'pointer',
        padding: '2.5px 5px',
        whiteSpace: 'nowrap',
        fontSize: 13,
        color: 'initial',
        display: 'grid',
        gridGap: '5px',
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'center',
        ...(F.view(hovering) && { color: '#0076de' }),
        ...style,
      }}
      {...F.domLens.hover(hovering)}
      {...props}
    />
  )
}

export default observer(DropdownItem)
