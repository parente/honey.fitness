import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Label} from 'recharts'
import moment from 'moment-timezone'

const sessionMs = 4 * 60 * 60 * 1000

/**
 * Compute tick marks at midnight in the given timezone within the data domain
 * @param data Datetime mile marks
 * @param tz Timezone of the rendered plot
 */
function getTicks(data: Array<{miles: number; epochMs: number}>, tz: string): number[] {
  const dayMs = 24 * 60 * 60 * 1000
  const endMs = data[data.length - 1].epochMs
  const startMs = data[0].epochMs
  const ticks: number[] = []
  let currMs = moment(startMs).tz(tz).set({hour: 0, minute: 0, second: 0}).valueOf()
  do {
    if (currMs >= startMs) {
      ticks.push(currMs)
    }
    currMs += dayMs
  } while (currMs < endMs)
  return ticks
}

/**
 * Compute the increase in miles between each running session
 * @param data Datetime mile marks
 */
export function getDeltaMiles(data: Array<{miles: number; epochMs: number}>): Map<number, number> {
  const deltas = new Map()
  let lastSession = null
  for (var i = 0; i < data.length - 1; i++) {
    const curr = data[i]
    const next = data[i + 1]
    const delta = curr.miles - lastSession
    if (next.epochMs > curr.epochMs + sessionMs && delta >= 0.1) {
      if (lastSession !== null) {
        deltas[curr.epochMs] = curr.miles - lastSession
      }
      lastSession = curr.miles
    }
  }
  return deltas
}

/**
 * Render a delta miles label
 */
function DeltaLabel({
  x,
  y,
  index,
  data,
  deltas,
}: {
  x: number
  y: number
  index: number
  data: Array<{miles: number; epochMs: number}>
  deltas: Map<number, number>
}) {
  const deltaMiles = deltas[data[index].epochMs]
  return deltaMiles ? (
    <text x={x} y={y} dy={-5} dx={-10} fontSize="0.6rem">
      +{deltaMiles.toFixed(1)}
    </text>
  ) : null
}

/**
 * Render a cumulative run log plot
 */
export default function RunLog({
  data,
  tz,
}: {
  data: Array<{epochMs: number; miles: number}>
  tz: string
}) {
  // Forward fill current time to the end of the dataset to show progress of time, even if it gets
  // replaced with values in the future
  const last = data[data.length - 1]
  data.push({
    epochMs: moment().tz('UTC').valueOf(),
    miles: last.miles,
  })

  return (
    <ResponsiveContainer width="100%" aspect={1.618034}>
      <LineChart data={data} margin={{bottom: 35}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          name="Date"
          dataKey="epochMs"
          domain={['auto', 'auto']}
          scale="time"
          type="number"
          tick={{fontSize: '0.65rem'}}
          ticks={getTicks(data, tz)}
          interval={0}
          angle={-25}
          textAnchor="end"
          tickFormatter={(epochMs: moment.MomentInput) =>
            moment(epochMs).tz(tz).format('ddd MMM Do')
          }
        >
          <Label
            value={'* Days marked at midnight in ' + tz}
            style={{fontSize: '0.6rem', fill: '#666'}}
            position="insideBottomLeft"
            offset={-32}
          />
        </XAxis>
        <YAxis
          name="Miles"
          unit=" mi"
          domain={['auto', 'dataMax + 5']}
          tick={{fontSize: '0.65rem'}}
        />
        <Line
          dataKey="miles"
          type="linear"
          dot={false}
          stroke="#383037"
          strokeWidth={1.5}
          animationDuration={750}
          connectNulls
          label={<DeltaLabel x={1} y={1} index={1} data={data} deltas={getDeltaMiles(data)} />}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
