import {GetServerSideProps} from 'next'
import Link from 'next/link'

import Layout from '../components/layout'
import RunLog from '../components/runlog'
import {getTotalMiles, getUserLocalDatetime, getWeekCumulativeMiles} from '../lib/data'
import styles from '../styles/Home.module.css'

export default function Home({
  totalMiles,
  tz,
  weekCumulativeMiles,
}: {
  totalMiles: number
  tz: string
  weekCumulativeMiles: Array<{miles: number; epochMs: number}>
}) {
  return (
    <Layout>
      <article>
        <section>
          <h1>About Me</h1>
          <img
            src="/honey.jpg"
            alt="Picture of Honey the Hamster"
            height="250px"
            className={styles.selfie + ' ' + styles.selfieRight}
          />
          <p>
            Hi! My name is Honey. I am a{' '}
            <a href="https://en.wikipedia.org/wiki/Golden_hamster">Syrian long-haired hamster</a>.
            Sometimes we are called teddy bear hamsters. Can you see why?
          </p>

          <p>
            My species is nocturnal in captivity. While our caretakers sleep, we like to run up to{' '}
            <em>5 miles</em> a night. That's quite a distance for our petite bodies if I may say so.
          </p>

          <p>
            True to my kind, I absolutely <em>love</em> to run in my{' '}
            <a href="https://www.amazon.com/gp/product/B019RH7PPE/ref=ppx_yo_dt_b_asin_title_o04_s00?ie=UTF8&psc=1">
              hamster wheel
            </a>
            . I use it so much that my adoptive family decided to{' '}
            <Link href="/how">
              <a>instrument my wheel</a>
            </Link>{' '}
            to calculate how far I run each night.
          </p>
        </section>

        <section>
          <h1>My Running Log</h1>
          <p>
            I've run a total of <strong>{totalMiles.toFixed(1)}</strong> miles in my wheel from
            August 23rd, 2020 to {getUserLocalDatetime().format('MMMM Do, Y [at] h:mm A z')}. Here's
            my recent progress.
          </p>

          <RunLog data={weekCumulativeMiles} tz={tz} />

          <p>
            <img
              src="/honey-food.jpg"
              alt="Picture of Honey in her food bag"
              height="250px"
              className={styles.selfie + ' ' + styles.selfieLeft}
            />
          </p>
        </section>

        <section>
          <h1>About My Wheel</h1>
          <iframe
            src="https://giphy.com/embed/TtIOES7JmywDBkEHRD"
            width="320"
            height="186"
            frameBorder="0"
            className={styles.selfie + ' ' + styles.selfieLeft}
          ></iframe>

          <h2>Parts List</h2>
          <ul>
            <li>
              <a href="https://www.acehardware.com/departments/tools/hand-tools/magnets/2108546">
                Master Magnetics .197 in. Ceramic Disc Magnets 0.7 lb. pull 3.5 MGOe
              </a>
            </li>
            <li></li>
            <li></li>
          </ul>
        </section>
      </article>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      tz: 'America/New_York',
      totalMiles: await getTotalMiles(),
      weekCumulativeMiles: await getWeekCumulativeMiles(),
    },
  }
}
