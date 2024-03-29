import { defaultProps } from 'react-recompose'

// components exported from component library
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  DateInput,
  Icon,
  DropdownItem,
  NestedPicker,
  Modal,
  PagerItem,
  RadioList,
  Select,
  Table,
  TextButton,
  TextHighlight,
  TextInput,
} from '../../greyVest/index.js'

//components used only for theme
import PickerItem from './PickerItem.js'
import TagsInput, { Tag } from './TagsInput.js'
import Root from './Root.js'

export default {
  AlternateButton: TextButton,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  DateInput,
  Root,
  Icon,
  TextInput,
  DropdownItem,
  NestedPicker: defaultProps({ PickerItem })(NestedPicker),
  NumberInput: defaultProps({ type: 'number' })(TextInput),
  TagsInput,
  Tag,
  Modal,
  PagerItem,
  RadioList,
  Select,
  Table,
  TextHighlight,
}
