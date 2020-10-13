import Head from 'next/head'
import styles from './layout.module.css'

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Honey the Hamster Fitness Tracker</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
          rel="stylesheet"
        />
        <meta property="og:title" content="Honey the Hamster Fitness Tracker" />
        <meta
          property="og:description"
          content="Track how far Honey the Hamster runs in her exercise wheel."
        />
        <meta property="og:url" content="https://honey.fitness" />
        <meta property="og:image" content="https://honey.fitness/honey.jpg" />
      </Head>
      <main>{children}</main>
    </div>
  )
}
