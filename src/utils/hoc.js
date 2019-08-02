import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp'
import StripedLoader from './StripedLoader'

export let withNode = Component => props => {
  let { tree, node, path } = props
  node = node || (tree && path && tree.getNode(path))

  if (!node) throw Error(`Node not provided, and couldn't find node at ${path}`)

  return <Component {...props} node={node} />
}

export let withLoader = Component =>
  observer(({ Loader = StripedLoader, node, ...props }) => (
    <Loader loading={node && node.updating}>
      <Component node={node} {...props} />
    </Loader>
  ))

// I am a band-aid, please rip me off as quickly as possible
export let withInlineLoader = Component =>
  observer(({ Loader = StripedLoader, node, ...props }) => (
    <Loader loading={node && node.updating} style={{ display: 'inline-block' }}>
      <Component node={node} {...props} />
    </Loader>
  ))

export let contexturify = _.flow(
  observer,
  withNode,
  withLoader
)

// this is used for the text components
export let withTreeLens = Component => ({ prop = 'value', ...props }) => (
  <Component {...{ lens: props.tree.lens(props.node.path, prop), ...props }} />
)

// quick n' dirty substitute for defaultProps to support theme objects (not production code!!)
export let defaultTheme = defaultTheme => Component => ({ theme, ...props }) =>
  <Component {...props} theme={_.merge(defaultTheme, theme)} />
