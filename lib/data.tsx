import csv from 'async-csv'
import moment from 'moment-timezone'

const wheelCircumference: number = (8.5 * Math.PI) / 63360 // miles

export async function getTotalMiles() {
  const resp = await fetch('https://honey-data-public.s3.amazonaws.com/total-rotations.csv')
  const respText = await resp.text()
  const rows = await csv.parse(respText, {columns: true})
  return rows[0].total * wheelCircumference
}

export async function getWeekCumulativeMiles() {
  let resp = await fetch('https://honey-data-public.s3.amazonaws.com/prior-7-day-window.csv')
  let respText: string = await resp.text()
  let rows = await csv.parse(respText, {columns: true})
  const origin: number = rows[0].prior_rotations * wheelCircumference

  resp = await fetch('https://honey-data-public.s3.amazonaws.com/7-day-window.csv')
  respText = await resp.text()
  rows = await csv.parse(respText, {columns: true})
  const cumsum = rows.map((row: {cumsum_rotations: number; datetime_hour: string}) => {
    console.log(row.datetime_hour)
    return {
      miles: origin + Number(row.cumsum_rotations) * wheelCircumference,
      epoch_ms: moment(row.datetime_hour).tz('UTC').valueOf(),
    }
  })
  return cumsum
}
