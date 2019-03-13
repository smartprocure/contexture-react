import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'
import ExpandableTable, { Column } from '../layout/ExpandableTable'
import { Flex } from '../layout/Flex'
import Select from '../layout/Select'

let SimpleLabel = ({ text }) => (
  <label style={{ paddingRight: '5px' }}>{text}</label>
)
let SimpleFilter = observer(({ Input = 'input', ...props }) => (
  <Flex
    style={{
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '75%',
    }}
  >
    <SimpleLabel text="Filter:" />
    <Input type="text" {...props} />
  </Flex>
))
let SelectSize = observer(({ node, tree }) => (
  <Flex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
    <SimpleLabel text="Size:" />
    <Select
      onChange={e => {
        tree.mutate(node.path, { size: e.target.value })
      }}
      value={_.getOr(25, 'size', node)}
      placeholder={null}
      style={{ width: '100px' }}
      options={_.map(x => ({ value: x, label: x }), [25, 50, 100, 500, 1000])}
    />
  </Flex>
))
let TermsStatsTable = injectTreeNode(
  observer(
    ({
      node,
      criteria,
      criteriaField,
      criteriaFieldLabel = '',
      criteriaGetValue = _.identity,
      tree,
      children,
      Button,
      MoreControls = 'div',
      Input = 'input',
      Filter = SimpleFilter,
      ...props
    }) => (
      <div>
        <Flex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Filter
            Input={Input}
            {...F.domLens.value(tree.lens(node.path, 'filter'))}
          />
          <SelectSize node={node} tree={tree} />
        </Flex>
        <ExpandableTable
          {...{
            ...props,
            children: criteria
              ? [
                  ..._.compact(children),
                  <Column
                    label={criteriaFieldLabel}
                    expand={{
                      display: (value, record) => (
                        <div>
                          <Button
                            onClick={async () => {
                              let field = criteriaField || node.key_field
                              let filter =
                                criteria &&
                                _.find(
                                  { field },
                                  tree.getNode(criteria).children
                                )

                              if (!filter) {
                                await tree.add(criteria, {
                                  key: _.uniqueId('add'),
                                  field,
                                  type: 'facet',
                                })
                                filter = _.find(
                                  { field },
                                  tree.getNode(criteria).children
                                )
                              }
                              await tree.mutate(filter.path, {
                                mode: 'include',
                                values: _.uniq([
                                  ..._.getOr([], 'values', filter),
                                  criteriaGetValue(record.key),
                                ]),
                              })
                            }}
                          >
                            Add as Filter
                          </Button>
                          <MoreControls />
                        </div>
                      ),
                    }}
                  />,
                ]
              : _.compact(children),
          }}
          data={node.context.terms}
          sortField={node.order}
          sortDir={node.sortDir}
          columnSort={column => {
            if (column.field !== 'key' && column.enableSort) {
              tree.mutate(node.path, {
                order: column.field,
                sortDir:
                  node.order === column.field && node.sortDir === 'asc'
                    ? 'desc'
                    : 'asc',
              })
            }
          }}
        />
      </div>
    )
  ),
  exampleTypes.TermsStats
)
TermsStatsTable.displayName = 'TermsStatsTable'

export default TermsStatsTable
