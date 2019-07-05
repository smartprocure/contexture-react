import React from 'react'
import { Flex } from './Flex'

let CheckboxDefault = ({ checked, ...props }) => (
  <input
    type="checkbox"
    disabled
    checked={!!checked} // prevent react "uncontrolled component" warning when `checked` prop is undefined
    {...props}
  />
)

let CheckButton = ({
  Button = 'button',
  Checkbox = CheckboxDefault,
  checked = false,
  onClick,
  children,
  ...props
}) => (
  <Button onClick={onClick} {...props}>
    <Flex alignItems="center" justifyContent="center">
      <Checkbox checked={!!checked} />
      {children}
    </Flex>
  </Button>
)
export default CheckButton
