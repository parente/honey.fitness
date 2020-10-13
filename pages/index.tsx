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
            className={styles.selfie + ' ' + styles.right + ' ' + styles.tiltRight5}
          />
          <p>
            Hi! My name is Honey. I am a{' '}
            <a href="https://en.wikipedia.org/wiki/Golden_hamster">Syrian long-haired hamster</a>.
            Sometimes we are called teddy bear hamsters. Can you see why?
          </p>

          <p>
            My species is nocturnal in captivity. While our caretakers sleep, we like to run up to{' '}
            <em>5 miles</em> a night. That's quite a distance for our pint-sized stature if I may
            say so.
          </p>

          <p>
            True to my kind, I absolutely <em>love</em> to run in my hamster wheel. I use it so much
            that my adoptive family decided to <a href="#about-my-wheel">instrument my wheel</a> to
            calculate how far I run each night.
          </p>
        </section>

        <section>
          <h1>My Running Log</h1>
          <p>
            I've run a total of <strong>{totalMiles.toFixed(1)}</strong> miles in my wheel from
            August 23rd, 2020 to {getUserLocalDatetime().format('MMMM Do, Y [at] h:mm A z')}. Here's
            my recent progress.
          </p>

          <div className={styles.chart}>
            <RunLog data={weekCumulativeMiles} tz={tz} />
          </div>
        </section>

        <section>
          <h1 id="about-my-wheel">About My Wheel</h1>
          <p>
            My exercise wheel has two ball bearings that roll around a central bolt fed through a
            metal stand. The construction keeps the wheel from squeaking and my fur from getting
            caught in an exposed axle. This design also makes it easy to attach a magnet to the back
            of the wheel and a magnetic field sensor to its stand.
          </p>

          <video
            src="wheel-run.mp4"
            autoPlay
            loop
            controls
            className={styles.selfie}
            width="100%"
          ></video>
          <p>
            The magnet passes in front of the sensor once for every full revolution of my wheel. The
            sensor registers the presence of the magnet with a change in voltage on one of the wires
            leading to a computer. A program running on the computer counts how many times the
            sensor registers the magnet every minute. It saves the count to disk at the end of each
            minute.
          </p>

          <img
            src="/back-of-wheel.jpg"
            alt="Picture of the magnet and sensor mounted on my wheel and stand"
            height="400px"
            className={styles.selfie + ' ' + styles.right + ' ' + styles.tiltRight2}
          />

          <p>
            The computer uploads the rotation counts for the past hour to{' '}
            <a href="https://aws.amazon.com/s3/faqs/">Amazon S3</a>. The computer then instructs{' '}
            <a href="https://aws.amazon.com/athena/faqs/">Amazon Athena</a> to add up <em>all</em>{' '}
            the rotations, add up all the rotations prior to 7 days ago, and add up all the
            rotations per hour over the last 7 days. Athena stores these numbers in S3 also.
          </p>

          <p>
            When you visit this website, your browser downloads the numbers computed by Athena and
            uses them to show my running log. Your browser turns the numbers into distances by
            multiplying the rotation counts by the circumference of my wheel,{' '}
            <em>&pi; &times; d = &pi; &times; 8.5 inches = 26.7 inches</em>. That's how far I would
            have traveled in a straight line on the ground for each full turn of my wheel.
          </p>
        </section>

        <section>
          <h1>Parts List</h1>
          <img
            src="/honey-food.jpg"
            alt="Picture of Honey in her food bag"
            height="250px"
            className={styles.selfie + ' ' + styles.right + ' ' + styles.tiltRight5}
          />
          <p>
            Here's everything you need to put together a wheel and website like mine. The upfront
            cost for all the parts is about $80. The cost of running this website can be as low as
            $1 per month but depends on the number of visitors.
          </p>
          <ul>
            <li>
              One{' '}
              <a href="https://www.amazon.com/gp/product/B019RH7PPE/ref=ppx_yo_dt_b_asin_title_o04_s00?ie=UTF8&psc=1">
                9 inch SilentRunner exercise wheel
              </a>
            </li>
            <li>
              One{' '}
              <a href="https://www.acehardware.com/departments/tools/hand-tools/magnets/2108546">
                ceramic disc magnet
              </a>
            </li>
            <li>
              One{' '}
              <a href="https://www.amazon.com/gp/product/B013G5N03O/ref=ppx_yo_dt_b_asin_title_o08_s00?ie=UTF8&psc=1">
                SunFounder switch Hall sensor module
              </a>
            </li>
            <li>
              One{' '}
              <a href="https://www.amazon.com/Square-Double-Strong-Mounting-Adhesive/dp/B07GYMVY41/ref=sr_1_11?dchild=1&keywords=3m+adhesive+strips+double+sided&qid=1602366157&sr=8-11">
                double-sided foam adhesive mounting pad
              </a>
            </li>
            <li>
              Three{' '}
              <a href="https://www.amazon.com/gp/product/B07GJLTHH5/ref=ppx_yo_dt_b_asin_title_o07_s00?ie=UTF8&psc=1">
                breadboard jumper wires
              </a>
            </li>
            <li>
              One (really old){' '}
              <a href="https://www.raspberrypi.org/products/raspberry-pi-1-model-a-plus/">
                Raspberry Pi 1 Model A+
              </a>
            </li>
            <li>
              One <a href="https://github.com/parente/honey.data/">data pipeline</a>
            </li>
            <li>
              One <a href="https://github.com/parente/honey.fitness/">dynamic website</a>
            </li>
          </ul>
        </section>

        <hr />

        <section>
          <img
            src="/honey-cheeks.jpg"
            alt="Picture of Honey in her food bag"
            height="250px"
            className={styles.selfie + ' ' + styles.right + ' ' + styles.tiltRight5}
          />

          <p className={styles.fixedHeight}>
            Phew. That was a lot of explaining. Good thing I pack snacks. Please check back daily
            for my progress and follow me{' '}
            <a href="https://www.instagram.com/honey_thebesthamster/">honey_thebesthamster</a>, one
            of the many{' '}
            <a href="https://www.instagram.com/explore/tags/hamstersofinstagram/">
              #hamstersofinstagram
            </a>
            .
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
      totalMiles: await getTotalMiles(),
      weekCumulativeMiles: await getWeekCumulativeMiles(),
    },
  }
}
