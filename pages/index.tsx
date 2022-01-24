import {GetServerSideProps} from 'next'
import {ResponsiveCalendar} from '@nivo/calendar'

import Layout from '../components/layout'
import {
  getLifetimeMiles,
} from '../lib/data'
import styles from '../styles/Home.module.css'

export default function Home({
  dailyMiles,
}: {
  dailyMiles: Array<{day: string; value: number}>
}) {
  return (
    <Layout>
      <article>
        <section>
          <h1>In Memorium</h1>
          <img
            src="/honey-cheeks.jpg"
            alt="Picture of Honey the Hamster"
            height="175px"
            className={styles.selfie + ' ' + styles.right + ' ' + styles.tiltRight5}
          />
          <p>
            Honey the Syrian long-haired hamster (full name: Honey the Destroyer of Worlds, 
            Killer of Men, Five-time Olympic Gold Medalist) passed away on January 18th, 2022. An 
            avid runner, Honey clocked more than <strong>1,886 miles</strong> in her hamster 
            wheel in less than two 
            years. When asked if her diet was the  key to her fitness prowess, she was known to 
            remark, "...", with her cheeks full of secrets.
          </p>

          <div className={styles.chart + ' ' + styles.heatmap}>
            <ResponsiveCalendar
              data={dailyMiles}
              from="2020-08-20"
              to="2022-01-18"
              emptyColor="#eeeeee"
              margin={{left: 20}}
              yearSpacing={50}
              monthSpacing={5}
              monthBorderColor="#f8f6f2"
              dayBorderColor="#f8f6f2"
              colors={[
                '#ddd7c7',
                '#cac4b4',
                '#b7b0a1',
                '#a49c8e',
                '#90887b',
                '#7d7468',
                '#696055',
                '#564c42',
                '#42382f',
              ]}
            />
          </div>

          <img
            src="/honey-pullup.jpg"
            alt="Picture of Honey in her food bag"
            height="175px"
            className={styles.selfie + ' ' + styles.right + ' ' + styles.tiltRight5}
          />
          <img
            src="/honey-shot-first.jpg"
            alt="Picture of Honey in her food bag"
            height="175px"
            className={styles.selfie + ' ' + styles.right + ' ' + styles.tiltLeft2}
          />
          <p>
            Honey loved travel as much as she loved working out. Her favorite exotic destinations 
            included Narnia Under the Couch, the Lower Bookcase Shelf Next to the Legos, and Behind 
            the Master Bath Toilet. Never one to miss an opportunity to scratch her back at a 
            baseboard corner, Honey took time to sniff the world while out and about. Her 20 minute 
            forays left her fulfilled and ready to return home at the call of her name to her waiting 
            wheel, snack sticks, water bottle, and soft bedding.
          </p>

          <p>
            Honey now rests in a mossy plot in The Great Backyard. She is survived by her three 
            caretakers. Donations can be made to the <a href="https://www.aspca.org/">ASPCA</a> in 
            lieu of flowers.
          </p>

          <div>
          

          <img
            src="/honey-lap.jpg"
            alt="Picture of Honey in her food bag"
            width="250px"
            className={styles.selfie + ' ' + styles.center + ' ' + styles.tiltRight2}
          />

          </div>
        </section>

        <hr />

        <section>
          <p className={styles.footer}>
            For more photos of the life and times of Honey, visit <a href="https://www.instagram.com/honey_thebesthamster/">honey_thebesthamster</a> on Instagram.
          </p>
        </section>
      </article>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      tz: 'America/New_York',
      dailyMiles: await getLifetimeMiles(),
    },
  }
}
