import React from 'react'
import { storiesOf } from '@storybook/react'
import decorator from './decorator'
import { Flex } from './../../src/layout/Flex'
import { Box, ErrorList, ErrorBlock, Input } from './../../src/themes/greyVest'

storiesOf('Components (Grey Vest)|Error', module)
  .addDecorator(decorator)
  .addWithJSX('Text', () => <ErrorList>I am an error</ErrorList>)
  .addWithJSX('Block', () => (
    <ErrorList ErrorComponent={ErrorBlock}>
      {['Error 1', 'Error 2', ['Error 3A', 'Error 3B']]}
    </ErrorList>
  ))
  .addWithJSX('Empty', () => (
    <>
      <ErrorList />
      <ErrorList ErrorComponent={ErrorBlock} />
    </>
  ))
  .addWithJSX('Styled', () => (
    <>
      <ErrorList style={{ color: 'forestgreen' }}>
        Ceci n'est pas une error
      </ErrorList>
      <ErrorList
        ErrorComponent={ErrorBlock}
        style={{
          fontWeight: 800,
          fontSize: '2em',
          textTransform: 'uppercase',
        }}
      >
        Extremely loud error
      </ErrorList>
    </>
  ))
  .addWithJSX('Form Demo', () => (
    <Box>
      <h1 style={{ margin: '15px 0' }}>Header</h1>
      <ErrorList ErrorComponent={ErrorBlock}>Block error</ErrorList>
      <Flex column style={{ marginBottom: 25 }}>
        <Flex as="label" column style={{ flex: 1 }}>
          <div className="filter-field-label" style={{ marginBottom: 14 }}>
            Label
          </div>
          <Input style={{ borderColor: '#D75050' }} />
        </Flex>
        <ErrorList>Text error</ErrorList>
      </Flex>
    </Box>
  ))
  .addWithJSX('Custom Component', () => {
    let MyErrorComponent = ({ children, ...props }) => (
      <li {...props}>{children}</li>
    )
    return (
      <ol>
        <ErrorList ErrorComponent={MyErrorComponent}>
          {['First error', 'Second error', 'Third error']}
        </ErrorList>
      </ol>
    )
  })
