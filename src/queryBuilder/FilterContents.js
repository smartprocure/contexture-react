import * as F from 'futil-js'
import _ from 'lodash/fp'
import React from 'react'
import { observer } from 'mobx-react'
import { ModalPicker, Dynamic, Grid } from '../layout/'
import { fieldsToOptions } from '../FilterAdder'
import DefaultMissingTypeComponent from '../DefaultMissingTypeComponent'
import { get } from '../utils/mobx-utils'
import {
  newNodeFromType,
  transformNodeFromField,
  getTypeLabelOptions,
} from '../utils/search'
import { withTheme } from '../utils/theme'

let FilterContents = _.flow(
  observer,
  withTheme(
    {
      Picker: ModalPicker,
      MissingTypeComponent: DefaultMissingTypeComponent,
    },
    'FilterContents'
  )
)(({ node, tree, fields, theme, mapNodeToProps = _.noop }) => {
  // `get` allows us to create a dependency on field before we know it
  // exists (because the client will only add it if it's a type that uses it
  // as it wouldn't make sense for something like `results`)
  let nodeField = get(node, 'field')
  let typeOptions = _.get([nodeField, 'typeOptions'], fields) || []
  if (node.type && !_.includes(node.type, typeOptions))
    typeOptions = [...typeOptions, node.type]
  let nodeLabel = _.get([nodeField, 'label'], fields) || nodeField
  return (
    <Grid columns="auto auto 1fr" style={{ width: '100%' }}>
      <theme.Picker
        theme={theme}
        label={nodeField ? nodeLabel : 'Pick a Field'}
        options={fieldsToOptions(fields)}
        onChange={field =>
          tree.replace(node.path, transformNodeFromField({ field, fields }))
        }
      />
      {nodeField && (
        <div style={{ margin: '0 5px' }}>
          <select
            onChange={({ target: { value: type } }) => {
              tree.replace(node.path, newNodeFromType(type, fields, node))
            }}
            value={F.when(_.isNil, undefined)(node.type)} // fix null value issue...
          >
            {_.map(
              x => (
                <option key={x.value} value={x.value} disabled={x.disabled}>
                  {x.label}
                </option>
              ),
              [
                {
                  value: null,
                  label: 'Select Type',
                  disabled: node.type,
                },
                ...getTypeLabelOptions(tree, typeOptions),
              ]
            )}
          </select>
        </div>
      )}
      {node.type && (
        <div
          style={{
            display: 'inline-block',
            verticalAlign: 'top',
            width: '100%',
            marginRight: '5px',
          }}
        >
          <Dynamic
            component={theme.MissingTypeComponent}
            tree={tree}
            node={node}
            {...mapNodeToProps(node, fields)}
          />
        </div>
      )}
    </Grid>
  )
})

export default observer(FilterContents)
