import _ from 'lodash/fp.js'
import F from 'futil'
import React from 'react'
import { fromPromise } from 'mobx-utils'
import Contexture, { updateSchemas } from './utils/contexture.js'
import {
  Flex,
  Awaiter,
  SpacedList,
  FilterList,
  componentForType,
  FilterAdder,
} from '../../index.js'
import theme, { Button } from '../DemoControls.js'
import {
  Query,
  ResultCount,
  ResultTable,
  DateHistogram,
  TermsStats,
  TypeMap,
} from '../../exampleTypes/index.js'
import { ThemeProvider } from '../../utils/theme.js'

let formatYear = (x) => new Date(x).getUTCFullYear()

let tree = Contexture({
  key: 'searchRoot',
  type: 'group',
  schema: 'movies',
  children: [
    {
      key: 'searchQuery',
      type: 'query',
      field: 'title',
    },
    {
      key: 'criteria',
      type: 'group',
      children: [
        {
          key: 'searchNumber',
          type: 'number',
          field: 'metaScore',
          min: 0,
          max: 100,
        },
        {
          key: 'searchFacet',
          type: 'facet',
          field: 'genres',
        },
        {
          key: 'searchActors',
          type: 'facet',
          field: 'actors',
        },
      ],
    },
    {
      key: 'results',
      type: 'results',
    },
    {
      key: 'releases',
      type: 'dateHistogram',
      key_field: 'released',
      value_field: 'imdbVotes',
      interval: '3650d',
    },
    {
      key: 'genreScores',
      type: 'terms_stats',
      key_field: 'genres',
      value_field: 'metaScore',
      order: 'sum',
    },
  ],
})
tree.disableAutoUpdate = true

let schemas = fromPromise(
  updateSchemas().then(
    _.merge(_, {
      movies: {
        fields: {
          poster: {
            display: (x) => <img src={x} width="180" height="270" />,
            order: 1,
          },
          released: { label: 'Release Date' },
        },
      },
    })
  )
)

let blueBar = {
  background: '#2a4466',
  boxShadow: '0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28)',
  padding: '10px',
}
let whiteBox = {
  boxShadow: '0 1px 3px 0 rgba(0,0,0,.08)',
  background: '#fff',
  padding: '15px',
  margin: '15px',
}

let Story = () => (
  <Awaiter promise={schemas}>
    {(schemas) => (
      <div style={{ background: '#f4f4f4' }}>
        <SpacedList>
          <Flex style={{ alignItems: 'center', ...blueBar }}>
            <div style={{ flex: 4 }}>
              <Query tree={tree} path={['searchRoot', 'searchQuery']} />
            </div>
            <div style={{ flex: 1, marginLeft: '5px', display: 'flex' }}>
              <input
                type="checkbox"
                checked={!tree.disableAutoUpdate}
                onChange={F.flip('disableAutoUpdate', tree)}
              />
              {tree.disableAutoUpdate && (
                <Button onClick={tree.triggerUpdate}>Search</Button>
              )}
            </div>
          </Flex>
          <Flex>
            <div style={{ flex: 1, ...whiteBox }}>
              <FilterList
                tree={tree}
                path={['searchRoot', 'criteria']}
                fields={schemas.movies.fields}
                mapNodeToProps={componentForType(TypeMap)}
              />
              <FilterAdder
                tree={tree}
                path={['searchRoot', 'criteria']}
                fields={schemas.movies.fields}
                uniqueFields
              />
            </div>
            <div style={{ flex: 4, maxWidth: '80%', ...whiteBox }}>
              <ResultCount tree={tree} path={['searchRoot', 'results']} />
              <DateHistogram
                tree={tree}
                path={['searchRoot', 'releases']}
                format={formatYear}
              />
              <TermsStats tree={tree} path={['searchRoot', 'genreScores']} />
              <div style={{ overflowX: 'auto' }}>
                <ResultTable
                  tree={tree}
                  path={['searchRoot', 'results']}
                  fields={schemas.movies.fields}
                />
              </div>
            </div>
          </Flex>
        </SpacedList>
      </div>
    )}
  </Awaiter>
)

export default () => (
  <ThemeProvider theme={theme}>
    <Story />
  </ThemeProvider>
)
