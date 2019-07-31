import _ from 'lodash/fp'
import F from 'futil-js'
import { observer } from 'mobx-react'
import React from 'react'
import DefaultIcon from '../DefaultIcon'
import { Flex } from './Flex'

// Observes node, so we can activate the Continue button if it (or any child) has a value.
// We don't observe on Step because then it would rerender its children when `node`
// changes, which unfocuses query inputs as soon as the first character is entered.
let Buttons = observer(
  ({ step, totalSteps, currentStep, theme, onSubmit }) => (
    <>
      {step > 0 && (
        <theme.Button onClick={F.sets(step - 1, currentStep)} className="back-button">
          <theme.Icon icon="PreviousPage" />
          Back
        </theme.Button>
      )}
      {step < totalSteps - 1 ? (
        <theme.Button
          primary
          onClick={F.sets(step + 1, currentStep)}
          disabled={false}
        >
          Continue
        </theme.Button>
      ) : (
        <theme.Button primary onClick={onSubmit}>
          View Results
        </theme.Button>
      )}
    </>
  )
)

export let AccordionStep = ({
  theme,
  style,
  className,
  step,
  totalSteps,
  currentStep,
  title,
  isRequired = false,
  onSubmit,
  children,
}) => {
  let isOpen = F.view(currentStep) === step
  return (
    <div
      className={`accordion-step ${className ? className : ''}`}
      style={style}
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        onClick={F.sets(isOpen ? -1 : step, currentStep)}
        style={{ cursor: 'pointer' }}
      >
        <Flex alignItems="center">
          <div className="accordion-step-title">
            {F.callOrReturn(title, step)}
          </div>
          {!isRequired && <em style={{ marginLeft: 6 }}>(Optional)</em>}
        </Flex>
        <div className="filter-field-label-icon">
          <theme.Icon icon={isOpen ? 'FilterListCollapse' : 'FilterListExpand'} />
        </div>
      </Flex>
      {isOpen && (
        <>
          <div className="step-contents">{children}</div>
          <Buttons
            {...{ step, totalSteps, currentStep, onSubmit, theme }}
          />
        </>
      )}
    </div>
  )
}

let StepsAccordion = ({
  theme = {
    Button: 'button',
    Icon: DefaultIcon,
  },
  onSubmit = _.noop,
  children,
  ...props
}) => {
  let currentStep = F.stateLens(React.useState(0))
  return (
    <div {...props}>
      {React.Children.map(children, (child, i) => (
        <child.type
          {...{ theme, currentStep, onSubmit }}
          key={i}
          step={i}
          totalSteps={_.size(children)}
          {...child.props}
        />
      ))}
    </div>
  )
}

StepsAccordion.displayName = 'StepsAccordion'
export default StepsAccordion
