import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import Popup from 'reactjs-popup'
import { openBinding } from './utils'
import { explodeProp } from '../utils/react'

/**
 * Self-contained state management:
 * <Popover trigger={<Button/>} />
 *
 * External state management:
 * <Popover isOpen={bool} onClose={fn} />
 *
 * Also with openBinding for a state lens
 * <Popover open={lens} />
 **/
let Popover = ({
  trigger,
  isOpen,
  onClose,
  arrow,
  position,
  closeOnPopoverClick = true,
  style,
  children,
  ...props
}) => (
  <Popup
    // always passing trigger, otherwise it opens as fullscreen modal
    trigger={open => <span>{F.callOrReturn(trigger, open)}</span>}
    open={isOpen}
    onClose={onClose}
    arrow={arrow}
    position={position || 'bottom left'}
    closeOnDocumentClick
    contentStyle={{
      borderRadius: 3,
      boxShadow: '0 2px 10px 0 rgba(39, 44, 65, 0.1)',
      border: '1px solid rgb(235, 235, 235)',
      ...style,
    }}
    {...props}
  >
    {close => (
      <div onClick={closeOnPopoverClick ? close : null}>
        {_.isFunction(children) ? children(close) : children}
      </div>
    )}
  </Popup>
)

export default explodeProp('open', openBinding)(Popover)
