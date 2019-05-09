import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { Flex } from '../../'
import LinkButton from './LinkButton'
import TreePauseButton from './TreePauseButton'
import ToggleFiltersButton from './ToggleFiltersButton'

let SearchEditor = ({ mode, setMode, children, QueryBuilder, FiltersBox }) => {
  let trees = _.flow(
    React.Children.toArray,
    _.map(x => x.props || x)
  )(children)
  let SearchGroupComponent = mode === 'builder' ? QueryBuilder : FiltersBox
  let marginTop = { marginTop: 15 }
  return mode === 'resultsOnly' ? null : (
    <div>
      <Flex style={{ alignItems: 'center' }}>
        <h1>Filters</h1>
        {mode === 'basic' ? (
          <>
            <TreePauseButton children={children} />
            <ToggleFiltersButton onClick={() => setMode('resultsOnly')} />
          </>
        ) : (
          <LinkButton onClick={() => setMode('basic')}>
            Back to Regular Search
          </LinkButton>
        )}
      </Flex>
      {F.mapIndexed(
        ({ label, ...props }, i) => (
          <React.Fragment key={i}>
            {label && <h3>{label}</h3>}
            <SearchGroupComponent {...props} />
          </React.Fragment>
        ),
        trees
      )}
      {mode === 'basic' && (
        <LinkButton onClick={() => setMode('builder')} style={marginTop}>
          Switch to Advanced Search Builder
        </LinkButton>
      )}
    </div>
  )
}

export default observer(SearchEditor)