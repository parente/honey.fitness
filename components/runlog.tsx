import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Label} from 'recharts'
import moment from 'moment-timezone'

function DatetimeAxisTick({x, y, stroke, payload}) {
  console.log(payload.value)
  const date = new Date(payload.value)
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
        {'tesT'}
      </text>
    </g>
  )
}

export default function RunLog({data}: {data: Array<Object>}) {
  return (
    <ResponsiveContainer width="100%" aspect={1.618034}>
      <LineChart data={data} margin={{bottom: 25}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          name="Date"
          dataKey="epoch_ms"
          domain={['auto', 'auto']}
          scale="time"
          type="number"
          tick={{fontSize: '0.6rem'}}
          minTickGap={0}
          interval="preserveStartEnd"
          tickFormatter={(unixTime: moment.MomentInput) =>
            moment(unixTime).tz('America/New_York').format('MMM Do, ha z')
          }
        />
        <YAxis name="Miles" unit=" mi" domain={['auto', 'auto']} tick={{fontSize: '0.8rem'}} />
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
