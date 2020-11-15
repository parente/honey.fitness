import csv from 'async-csv'
import moment from 'moment-timezone'

const wheelCircumferenceMiles: number = (8.5 * Math.PI) / 63360

export async function getTotalMiles() {
  const resp = await fetch('https://honey-data-public.s3.amazonaws.com/total-rotations.csv')
  const respText = await resp.text()
  const rows = await csv.parse(respText, {columns: true})
  return rows[0].total * wheelCircumferenceMiles
}

export async function getWeekCumulativeMiles() {
  let resp = await fetch('https://honey-data-public.s3.amazonaws.com/prior-7-day-window.csv')
  let respText: string = await resp.text()
  let rows = await csv.parse(respText, {columns: true})
  const origin: number = rows[0].prior_rotations * wheelCircumferenceMiles

  resp = await fetch('https://honey-data-public.s3.amazonaws.com/7-day-window.csv')
  respText = await resp.text()
  rows = await csv.parse(respText, {columns: true})
  const cumsum = rows.map((row: {cumsum_rotations: number; datetime_hour: string}) => {
    return {
      miles: origin + Number(row.cumsum_rotations) * wheelCircumferenceMiles,
      epochMs: moment(row.datetime_hour).tz('UTC').valueOf(),
    }
  })
  return cumsum
}

export async function getDailyMiles() {
  let resp = await fetch('https://honey-data-public.s3.amazonaws.com/1-year-window.csv')
  let respText: string = await resp.text()
  let rows = await csv.parse(respText, {columns: true})
  rows = await csv.parse(respText, {columns: true})
  return rows.map((row: {day: string; value: number}) => {
    return {day: row.day, value: (row.value * wheelCircumferenceMiles).toFixed(1)}
  })
}

export function getUserLocalDatetime() {
  return moment().tz(moment.tz.guess())
}

export function getTwoYearRange(start: string, end: string) {
  const startYear = moment(start).year()
  const endYear = moment(end).year()
  return {
    start,
    end:
      startYear === endYear
        ? moment(start)
            .set({year: startYear + 1})
            .format('Y-MM-DD')
        : end,
  }
}
