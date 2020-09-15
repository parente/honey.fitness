import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Label} from 'recharts'
import moment from 'moment-timezone'

function getTicks(data: Array<{epochMs: number}>, tz: string): number[] {
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

export default function RunLog({
  data,
  tz,
}: {
  data: Array<{epochMs: number; miles: number}>
  tz: string
}) {
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
          tick={{fontSize: '0.6rem'}}
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
        <YAxis name="Miles" unit=" mi" domain={['auto', 'auto']} tick={{fontSize: '0.7rem'}} />
        <Line
          dataKey="miles"
          type="linear"
          dot={false}
          stroke="#383037"
          strokeWidth={1.5}
          animationDuration={750}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
