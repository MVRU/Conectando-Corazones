import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string; // ruta al SVG/PNG en /static/img/icons
  description: React.ReactNode;
};

const FeatureList: FeatureItem[] = [
  // {
  //   title: 'Transparencia y trazabilidad',
  //   icon: '/img/icons/trace.svg',
  //   description: <>Cada proyecto mantiene historial y evidencias verificables para rendición de cuentas clara.</>,
  // },
  // {
  //   title: 'Evidencias con estándares',
  //   icon: '/img/icons/evidence.svg',
  //   description: <>Guías de evidencia (documentos, recibos, fotos) y checklist para auditorías simples.</>,
  // },
  // {
  //   title: 'Validaciones con APIs oficiales',
  //   icon: '/img/icons/shield.svg',
  //   description: <>Integración opcional con fuentes oficiales para reducir fraude y duplicación de datos.</>,
  // },
  // {
  //   title: 'Flujo sano con PR y revisión',
  //   icon: '/img/icons/branch.svg',
  //   description: <>Reglas de ramas, PR template y ADR documentan decisiones y previenen “bola de nieve”.</>,
  // },
  // {
  //   title: 'Privacidad por diseño',
  //   icon: '/img/icons/lock.svg',
  //   description: <>Datos mínimos, consentimiento informado y controles de acceso para cada rol.</>,
  // },
  // {
  //   title: 'Open Source y comunidad',
  //   icon: '/img/icons/heart.svg',
  //   description: <>Código abierto y docs públicas para que cualquiera pueda aportar de forma responsable.</>,
  // },
];

function Feature({ title, icon, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.card)}>
      <div className={styles.iconWrap}>
        <img src={icon} alt="" aria-hidden="true" />
      </div>
      <Heading as="h3" className={styles.cardTitle}>{title}</Heading>
      <p className={styles.cardText}>{description}</p>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          ¿Qué ofrece Conectando Corazones?
        </Heading>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
