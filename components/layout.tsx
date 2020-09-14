import Head from 'next/head'
import styles from './layout.module.css'

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Honey the Hamster Fitness Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </div>
  )
}
