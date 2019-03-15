import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { Flex } from '../layout/Flex'

export default observer(
  ({
    tree,
    node,
    NumberInput,
    Button,
    showBestRange = false,
    formatter = _.identity,
  }) => (
    <div className="contexture-number">
      <Flex style={{ alignItems: 'center' }}>
        <NumberInput
          value={formatter(node.min) || ''}
          onChange={e => tree.mutate(node.path, { min: e.target.value })}
        />
        <div className="contexture-number-separator">-</div>
        <NumberInput
          value={formatter(node.max) || ''}
          onChange={e => tree.mutate(node.path, { max: e.target.value })}
        />
      </Flex>
      {showBestRange && (
        <div className="contexture-number-best-range">
          <Button
            style={{ width: '100%' }}
            onClick={async () => {
              // Calculate best range
              await tree.mutate(node.path, { findBestRange: true })
              // Disable best range so the calculation isn't run anymore
              tree.mutate(node.path, {
                findBestRange: false,
                min: _.get('context.bestRange.min', node),
                max: _.get('context.bestRange.max', node),
              })
            }}
          >
            Find best range
          </Button>
        </div>
      )}
    </div>
  )
)
