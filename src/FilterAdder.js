import _ from 'lodash/fp'
import React from 'react'
import { observer } from 'mobx-react'
import InjectTreeNode from './utils/injectTreeNode'
import { DefaultNodeProps } from './utils/schema'

export let fieldsToOptions = _.map(x => ({ value: x.field, ...x }))

let getGroupFields = node => _.map('field', _.getOr([], 'children', node))

let FilterAdder = ({
  tree,
  node,
  path,
  fields,
  Picker,
  uniqueFields,
  defaultNodeProps = DefaultNodeProps,
}) => {
  let options = fieldsToOptions(fields)
  if (uniqueFields) {
    options = _.reject(x => _.includes(x.field, getGroupFields(node)), options)
  }
  return (
    <Picker
      options={options}
      onChange={field => {
        tree.add(path, {
          key: _.uniqueId('add'),
          field,
          type: fields[field].typeDefault,
          ...defaultNodeProps(field, fields, fields[field].typeDefault, tree),
        })
      }}
    />
  )
}

export default InjectTreeNode({ allowEmptyNode: true })(observer(FilterAdder))
