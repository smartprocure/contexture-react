import F from 'futil'
import _ from 'lodash/fp.js'
import React from 'react'
import { observer } from 'mobx-react'
import { Dynamic, Flex } from './greyVest/index.js'
import { CheckButton, ModalPicker } from './purgatory/index.js'
import styles from './styles/index.js'
import { newNodeFromField } from './utils/search.js'
import { unusedOptions } from './FilterAdder.js'
import { fieldsToOptions } from './utils/fields.js'
import { useNode, useTheme } from './utils/hooks.js'

let FilterButtonItem = ({
  node,
  tree,
  fields,
  mapNodeToProps,
  mapNodeToLabel,
  theme,
}) => {
  let mappedProps = mapNodeToProps(node, fields)
  let modal = React.useState(false)
  let title = // we really need a title, so here's every possible fallback
    mapNodeToLabel(node, fields) ||
    _.get('label', mappedProps) ||
    _.get([node.field, 'label'], fields) ||
    node.field ||
    node.key
  let description = _.get('description', mappedProps)
  return (
    <div>
      <CheckButton
        primary={node.hasValue}
        checked={node.hasValue}
        onClick={() => {
          F.on(modal)()
          tree.mutate(node.path, { paused: false })
        }}
      >
        {title}
      </CheckButton>
      <theme.Modal open={modal}>
        <Flex column className="filter-button-modal">
          <h1>{title}</h1>
          {description && (
            <div className="filter-description">{description}</div>
          )}
          <div className="filter-component">
            <Dynamic
              {...{
                component: theme.UnmappedNodeComponent,
                tree,
                node,
                path: _.toArray(node.path),
                ...mappedProps,
              }}
            />
          </div>
          <Flex style={{ justifyContent: 'flex-end' }}>
            <theme.Button onClick={() => tree.clear(node.path)}>
              Clear Filter
            </theme.Button>
            <theme.Button
              primary
              onClick={() => {
                F.off(modal)()
                tree.mutate(node.path, { paused: true })
              }}
              style={{ marginLeft: '10px' }}
            >
              Done
            </theme.Button>
          </Flex>
        </Flex>
      </theme.Modal>
    </div>
  )
}

let GroupBox = ({ nodeJoinColor, children, nested, className, style }) => (
  <Flex
    wrap
    className={`${className} ${nested ? 'nested' : ''}`}
    alignItems="center"
    style={{ borderColor: nodeJoinColor, ...style }}
  >
    {children}
  </Flex>
)

let FilterButtonList = ({
  node,
  tree,
  path,
  fields = {},
  mapNodeToProps = _.noop,
  mapNodeToLabel = _.noop,
  allowDuplicateFields = false,
  className = '',
  addFilters = false,
  nested = false,
  style,
  children,
  theme,
}) => {
  node = useNode(node, path, tree)
  theme = useTheme(theme)
  let options = allowDuplicateFields
    ? fieldsToOptions(fields)
    : unusedOptions(fields)
  return (
    <GroupBox
      className={`filter-button-list ${className}`}
      {...{ nested, style }}
      nodeJoinColor={node && styles.joinColor(node)}
    >
      {children}
      {_.map((child) => {
        let Component = child.children ? FilterButtonList : FilterButtonItem
        return (
          <Component
            key={child.path}
            nested
            {...{
              tree,
              node: child,
              fields,
              mapNodeToProps,
              mapNodeToLabel,
              className,
              theme,
            }}
          />
        )
      }, _.get('children', node))}
      {addFilters && !nested && (
        <div>
          <ModalPicker
            options={options}
            className="check-button"
            onChange={(addedFields) =>
              _.each(
                ({ field }) =>
                  tree.add(node.path, newNodeFromField({ field, fields })),
                addedFields
              )
            }
            label={
              <Flex alignItems="center" justifyContent="center">
                <theme.Icon icon="AddColumn" />
                {addFilters !== true && <>&nbsp;{addFilters}</>}
              </Flex>
            }
            theme={theme}
          />
        </div>
      )}
    </GroupBox>
  )
}

export default observer(FilterButtonList)
