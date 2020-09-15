import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Label} from 'recharts'
import moment from 'moment-timezone'

function getTicks(data): number[] {
  const dayMs = 24 * 60 * 60 * 1000
  const endMs = data[data.length - 1].epochMs
  const startMs = data[0].epochMs
  const ticks: number[] = []
  let currMs = moment(startMs).tz('America/New_York').set({hour: 0, minute: 0, second: 0}).valueOf()
  do {
    if (currMs >= startMs) {
      ticks.push(currMs)
    }
    currMs += dayMs
  } while (currMs < endMs)
  return ticks
}

function AngledAxisTick({x, y, stroke, payload}) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={5}
        fontSize="0.6rem"
        textAnchor="end"
        fill="#666"
        transform="rotate(-25)"
      >
        {moment(payload.value).tz('America/New_York').format('ddd MMM Do')}
      </text>
    </g>
  )
}

export default function RunLog({data}: {data: Array<Object>}) {
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
          tick={<AngledAxisTick />}
          ticks={getTicks(data)}
          interval={0}
        >
          <Label
            value="* Days marked at midnight in Durham, NC"
            style={{fontSize: '0.6rem', fill: '#666'}}
            position="insideBottomLeft"
            offset={-32}
          />
        </XAxis>
        <YAxis name="Miles" unit=" mi" domain={['auto', 'auto']} tick={{fontSize: '0.7rem'}} />
        <Line
          dataKey="miles"
          type="monotone"
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
