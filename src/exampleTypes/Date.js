import React from 'react'
import { Flex } from '../greyVest'
import { contexturifyWithoutLoader } from '../utils/hoc'
import F from 'futil'
import _ from 'lodash/fp'
import moment from 'moment'

let allRollingOpts = [
  { type: 'all', range: 'allDates' },
  { type: 'all', range: 'allPastDates' },
  { type: 'all', range: 'allFutureDates' },
  { type: 'past', range: 'last3Days' },
  { type: 'past', range: 'last7Days' },
  { type: 'past', range: 'last30Days' },
  { type: 'past', range: 'last90Days' },
  { type: 'past', range: 'last180Days' },
  { type: 'past', range: 'last12Months' },
  { type: 'past', range: 'last15Months' },
  { type: 'past', range: 'last18Months' },
  { type: 'past', range: 'last24Months' },
  { type: 'past', range: 'last36Months' },
  { type: 'past', range: 'last48Months' },
  { type: 'past', range: 'last60Months' },
  { type: 'past', range: 'lastCalendarMonth' },
  { type: 'past', range: 'lastCalendarQuarter' },
  { type: 'past', range: 'lastCalendarYear' },
  { type: 'present', range: 'thisCalendarMonth' },
  { type: 'present', range: 'thisCalendarQuarter' },
  { type: 'present', range: 'thisCalendarYear' },
  { type: 'future', range: 'nextCalendarMonth' },
  { type: 'future', range: 'nextCalendarQuarter' },
  { type: 'future', range: 'nextCalendarYear' },
  { type: 'future', range: 'next30Days' },
  { type: 'future', range: 'next60Days' },
  { type: 'future', range: 'next90Days' },
  { type: 'future', range: 'next6Months' },
  { type: 'future', range: 'next12Months' },
  { type: 'future', range: 'next18Months' },
  { type: 'future', range: 'next24Months' },
  { type: 'future', range: 'next36Months' },
]

let endOfDay = date => date && moment(date).endOf('day').toDate()

let DateComponent = ({
  tree,
  node,
  excludeRollingRanges = [],
  theme: { DateInput, RadioList, Select },
}) => {
  let [to, setTo] = React.useState(node.to)
  let [from, setFrom] = React.useState(node.from)
  let [dateRange, setDateRange] = React.useState(node.range)
  let [range, setRange] = React.useState(
    node.range !== 'exact' ? 'rolling' : 'exact'
  )

  // We need the hook to deal with the `clear/reset` case where the node.range is changed but the range remains unchanged
  React.useEffect(() => {
    if (node.range !== range && node.range === 'exact') setRange('exact')
  }, [node.range])

  let rollingOpts = _.reject(
    opt => _.includes(opt.type, excludeRollingRanges),
    allRollingOpts
  )

  return (
    <div>
      <RadioList
        options={F.autoLabelOptions(['exact', 'rolling'])}
        value={range}
        style={{ marginBottom: 10 }}
        onChange={value => {
          // Deal with the reset of the values
          if (value !== 'exact') {
            setTo(null)
            setFrom(null)
          } else {
            setDateRange(null)
          }
          setRange(value)
        }}
      />
      {range === 'exact' ? (
        <Flex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <DateInput
            value={from}
            onChange={date => {
              setFrom(date)
              tree.mutate(node.path, { range, from: date })
            }}
          />
          <div>-</div>
          <DateInput
            value={to}
            onChange={date => {
              setTo(date)
              tree.mutate(node.path, { range, to: endOfDay(date) })
            }}
          />
        </Flex>
      ) : (
        <Select
          value={dateRange}
          onChange={e => {
            setDateRange(e.target.value)
            tree.mutate(node.path, {
              range: e.target.value,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
          }}
          options={F.map(
            ({ range }) => ({
              label: _.startCase(range),
              value: range,
              selected: node.range === range,
            }),
            rollingOpts
          )}
        />
      )}
    </div>
  )
}

export default contexturifyWithoutLoader(DateComponent)
