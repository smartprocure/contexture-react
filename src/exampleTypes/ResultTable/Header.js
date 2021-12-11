import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil'
import { observer } from 'mobx-react'
import { Dynamic } from '../../greyVest'
import { withTheme } from '../../utils/theme'

const moveColumn = (
  mutate,
  computeNextIndex,
  field,
  visibleFields,
  includes
) => {
  let visibleFieldIndex = _.findIndex({ field }, visibleFields)
  let nextField = _.flow(
    _.nth(computeNextIndex(visibleFieldIndex)),
    _.get('field')
  )(visibleFields)
  mutate({
    include: F.moveIndex(
      _.indexOf(field, includes),
      _.indexOf(nextField, includes),
      includes
    ),
  })
}

let popoverStyle = {
  userSelect: 'none',
  width: 'auto',
}

let Header = ({
  field: fieldSchema,
  includes,
  addOptions,
  addFilter,
  tree,
  node,
  mutate,
  criteria,
  mapNodeToProps,
  fields,
  visibleFields,
  isStickyColumn,
  isLastColumn,
  theme: {
    Th,
    Button,
    DropdownItem,
    Icon,
    Popover,
    Modal,
    NestedPicker,
    UnmappedNodeComponent,
  },
}) => {
  let adding = React.useState(false)
  let {
    disableFilter,
    disableSort,
    field,
    sortField = field,
    label,
    hideRemoveColumn,
    hideMenu,
    typeDefault,
  } = fieldSchema
  let HeaderCell = fieldSchema.HeaderCell || Th
  let filterNode =
    criteria &&
    _.find({ field }, _.getOr([], 'children', tree.getNode(criteria)))
  let filtering = React.useState(!!filterNode && !_.get('paused', filterNode))
  let filter = () => {
    if (!filterNode) addFilter(field)
    filterNode =
      criteria &&
      _.find({ field }, _.getOr([], 'children', tree.getNode(criteria)))
    tree.mutate(filterNode.path, { paused: false })
    F.flip(filtering)()
  }
  let Label = label
  return (
    <HeaderCell
      className={`${isStickyColumn ? 'sticky-column-header' : ''}
        ${_.get('hasValue', filterNode) ? 'active-filter' : ''}`}
      style={{
        cursor: hideMenu ? 'default' : 'pointer',
        left: isStickyColumn ? 0 : '',
      }}
    >
      <span data-testid={`column-header-${label}`}>
        {_.isFunction(label) ? <Label /> : label}{' '}
        {field === node.sortField && (
          <Icon
            icon={node.sortDir === 'asc' ? 'SortAscending' : 'SortDescending'}
          />
        )}
        <Popover
          trigger={hideMenu ? null : <Icon icon="TableColumnMenu" />}
          position={`bottom ${isLastColumn ? 'right' : 'center'}`}
          closeOnPopoverClick={false}
          style={popoverStyle}
        >
          {!disableSort && (
            <DropdownItem
              data-testid="dropdown-sort-ascending"
              onClick={() => {
                mutate({ sortField, sortDir: 'asc' })
              }}
            >
              <Icon icon="SortAscending" />
              Sort Ascending
            </DropdownItem>
          )}
          {!disableSort && (
            <DropdownItem
              data-testid="dropdown-sort-descending"
              onClick={() => {
                mutate({ sortField, sortDir: 'desc' })
              }}
            >
              <Icon icon="SortDescending" />
              Sort Descending
            </DropdownItem>
          )}
          <DropdownItem
            data-testid="dropdown-move-left"
            onClick={() =>
              moveColumn(mutate, i => i - 1, field, visibleFields, includes)
            }
          >
            <Icon icon="MoveLeft" />
            Move Left
          </DropdownItem>
          <DropdownItem
            data-testid="dropdown-move-right"
            onClick={() =>
              moveColumn(mutate, i => i + 1, field, visibleFields, includes)
            }
          >
            <Icon icon="MoveRight" />
            Move Right
          </DropdownItem>
          {!hideRemoveColumn && (
            <DropdownItem
              data-testid="dropdown-remove-column"
              onClick={() => mutate({ include: _.without([field], includes) })}
            >
              <Icon icon="RemoveColumn" />
              Remove Column
            </DropdownItem>
          )}
          {!!addOptions.length && (
            <DropdownItem
              data-testid="dropdown-add-column"
              onClick={F.on(adding)}
            >
              <Icon icon="AddColumn" />
              Add Column
            </DropdownItem>
          )}
          {criteria && (typeDefault || filterNode) && !disableFilter && (
            <div>
              <DropdownItem data-testid="dropdown-filter" onClick={filter}>
                <Icon
                  icon={
                    filterNode
                      ? F.view(filtering)
                        ? 'FilterCollapse'
                        : 'FilterExpand'
                      : 'FilterAdd'
                  }
                />
                Filter
              </DropdownItem>
              {F.view(filtering) && filterNode && !filterNode.paused && (
                <>
                  <Dynamic
                    {...{
                      component: UnmappedNodeComponent,
                      tree,
                      path: _.toArray(filterNode.path),
                      ...mapNodeToProps(filterNode, fields),
                    }}
                  />
                  {tree.disableAutoUpdate && node.markedForUpdate && (
                    <Button
                      primary
                      style={{ width: '100%' }}
                      onClick={e => {
                        e.stopPropagation()
                        tree.triggerUpdate()
                      }}
                    >
                      Search
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
          <Modal open={adding}>
            <NestedPicker
              itemType="column"
              options={addOptions}
              onChange={selectedFields => {
                _.each(({ field: addedField }) => {
                  let index = includes.indexOf(field)
                  if (index >= 0 && addedField) {
                    includes.splice(index + 1, 0, addedField)
                    mutate({ include: includes })
                  }
                }, selectedFields)
                F.off(adding)()
              }}
            />
          </Modal>
        </Popover>
      </span>
    </HeaderCell>
  )
}

export default _.flow(observer, withTheme)(Header)
