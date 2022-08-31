import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil'
import { fieldsToOptions } from '../../utils/fields'
import { contexturifyWithoutLoader } from '../../utils/hoc'
import { applyDefaults, inferSchema } from '../../utils/schema'
import { newNodeFromField } from '../../utils/search'
import Header from './Header'
import TableBody from './TableBody'
import HighlightedColumnHeader from './HighlightedColumnHeader'
import ResultTableFooter from './ResultTableFooter'
import { withTheme } from '../../utils/theme'

let getIncludes = (schema, node) =>
  F.when(_.isEmpty, _.map('field', schema))(node.include)

let DefaultRow = withTheme(({ theme: { Tr = 'tr' }, ...props }) => (
  <Tr
    {..._.omit(['record', 'fields', 'visibleFields', 'hiddenFields'], props)}
  />
))

const validateInput = (fields, infer) => {
  if (_.isEmpty(fields) && !infer) throw new Error('Fields are empty')
}

let ResultTable = ({
  fields,
  infer,
  path,
  criteria,
  node = {},
  tree,
  NoResultsComponent = 'No Results Found',
  IntroComponent = null, // Initial component to be shown instead of the grid when no data has been loaded
  Row = DefaultRow, // accept a custom Row component so we can do fancy expansion things
  getRowKey, // allow passing a custom function to generate unique row key
  mapNodeToProps = () => ({}),
  pageSizeOptions, // an array of options to set the # of rows per page (default [20, 50, 100, 250])
  limitedResults,
  stickyColumn,
  hideFooter,
  footerStyle,
  theme: { Table, Thead, Tr, Th },
}) => {
  // If there are no fields, we won't render anything. This is most definitely a
  // user error when it happens
  try {
    validateInput(fields, infer)
  } catch (error) {
    console.info(`Error encountered during validation of fields: ${error.message}`)
    return (
      <>
        <h1>Search Failed</h1>
        <p>Description: {error.message}</p>
      </>
    )
  }
  // From Theme/Components
  let mutate = tree.mutate(path)

  // Account for all providers here (memory provider has results with no response parent)
  let resultsLength = F.cascade(
    ['context.response.results.length', 'context.results.length'],
    node
  )
  let totalRecords = F.cascade(
    ['context.response.totalRecords', 'context.totalRecords'],
    node
  )

  let blankRows =
    limitedResults &&
    resultsLength < node.pageSize &&
    totalRecords > resultsLength

  // NOTE infer + add columns does not work together (except for anything explicitly passed in)
  //   When removing a field, it's not longer on the record, so infer can't pick it up since it runs per render
  let schema = _.flow(
    _.merge(infer && inferSchema(node)),
    applyDefaults,
    _.values,
    _.orderBy('order', 'desc')
  )(fields)
  let includes = getIncludes(schema, node)
  let isIncluded = x => _.includes(x.field, includes)
  let visibleFields = _.flow(
    _.map(field => _.find({ field }, schema)),
    _.compact
  )(includes)
  let hiddenFields = _.reject(isIncluded, schema)

  let headerProps = {
    mapNodeToProps,
    fields,
    visibleFields,
    includes,
    addOptions: fieldsToOptions(hiddenFields),
    addFilter: field => tree.add(criteria, newNodeFromField({ field, fields })),
    tree,
    node,
    mutate,
    criteria,
  }

  let columnGroupsHeight = _.flow(
    _.map('fieldGroup.length'),
    _.max
  )(visibleFields)

  let columnGroups = _.reduce(
    (columnGroups, { fieldGroup, HeaderCell }) => {
      for (let i = 0; i < columnGroupsHeight; i++) {
        let groupRow = columnGroups[i] || (columnGroups[i] = [])
        let groupName = _.getOr('', i, fieldGroup)
        let lastGroup = _.last(groupRow)
        if (_.get('groupName', lastGroup) === groupName) {
          lastGroup.colspan++
          lastGroup.HeaderCell = HeaderCell
        } else groupRow.push({ groupName, colspan: 1, HeaderCell })
      }
      return columnGroups
    },
    [],
    visibleFields
  )

  return (
    <>
      <Table data-path={node.path}>
        <Thead>
          {F.mapIndexed(
            (columnGroupRow, i) => (
              <Tr key={i}>
                {F.mapIndexed(
                  ({ groupName, colspan, HeaderCell = Th }, j) => (
                    <HeaderCell key={j} colSpan={colspan}>
                      <span>{F.autoLabel(groupName)}</span>
                    </HeaderCell>
                  ),
                  columnGroupRow
                )}
              </Tr>
            ),
            columnGroups
          )}
          <Tr>
            {F.mapIndexed(
              (x, i) => (
                <Header
                  key={x.field}
                  field={x}
                  isLastColumn={i === visibleFields.length - 1}
                  isStickyColumn={stickyColumn && x.field === stickyColumn}
                  {...headerProps}
                />
              ),
              visibleFields
            )}
            <HighlightedColumnHeader node={node} />
          </Tr>
        </Thead>
        <TableBody
          {...{
            node,
            fields,
            visibleFields,
            hiddenFields,
            schema,
            Row,
            getRowKey,
            blankRows,
            pageSize: Math.min(node.pageSize, totalRecords),
            stickyColumn,
            NoResultsComponent,
            IntroComponent,
          }}
        />
      </Table>

      {!hideFooter && node.pageSize > 0 && (
        <ResultTableFooter
          {...{
            tree,
            node,
            path,
            pageSizeOptions,
            disabled: blankRows,
            style: footerStyle,
          }}
        />
      )}
    </>
  )
}

export default contexturifyWithoutLoader(ResultTable)
