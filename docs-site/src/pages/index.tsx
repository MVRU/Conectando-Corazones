import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Conectando Corazones"
      description="Un puente digital entre quienes quieren ayudar y quienes lo necesitan"
    >
      <header className={clsx('hero hero--primary', styles.hero)}>
        <div className="container">
          <p className={styles.kicker}>Cada acción cuenta, empezá la tuya</p>
          <h1 className={clsx('hero__title', styles.title)}>
            <span className="cc-gradient-text">Cambiá una vida con un clic.</span>
          </h1>
          <p className={clsx('hero__subtitle', styles.subtitle)}>
            Plataforma solidaria para coordinar proyectos, subir evidencias y rendir cuentas con
            transparencia.
          </p>
          <div className={styles.ctaRow}>
            <Link className="button button--primary button--lg" to="https://conectando-corazones.vercel.app/signin">
              Registrarse
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/dev">
              Guía para desarrolladores
            </Link>

          </div>
        </div>
      </header>

      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
