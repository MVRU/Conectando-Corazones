import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {
  ShieldCheck,
  FileCheck2,
  Database,
  Gauge,
  Lock,
  Rocket,
  UserCheck,
  MessageCircle,
  Upload,
  Bell,
  HeartHandshake,
  Code2,
} from 'lucide-react';
import styles from './styles.module.css';

type LucideIcon = (props: React.SVGProps<SVGSVGElement>) => JSX.Element;

type FeatureItem = {
  title: string;
  description: React.ReactNode;
  href?: string;
  Icon?: LucideIcon;
};

function FeatureCard({ title, description, href, Icon }: FeatureItem) {
  const inner = (
    <>
      <div className={styles.iconWrap} aria-hidden="true">
        {Icon ? <Icon className={styles.icon} /> : <span className={styles.dot} />}
      </div>
      <Heading as="h3" className={styles.cardTitle}>{title}</Heading>
      <p className={styles.cardText}>{description}</p>
    </>
  );

  return (
    <div className={clsx('col', styles.cell)}>
      {href ? (
        <a className={clsx(styles.card, styles.cardLink)} href={href} aria-label={title}>
          {inner}
        </a>
      ) : (
        <div className={styles.card}>{inner}</div>
      )}
    </div>
  );
}

/* ============================
   Contenido: Instituciones
============================ */
const InstitutionFeatures: FeatureItem[] = [
  {
    title: 'Subida de evidencia cuidada',
    Icon: Upload,
    description: <>Cargá fotos y documentos cifrados para cerrar tus proyectos.</>,
    href: '/docs/guia-colaboradores/evidencias',
  },
  {
    title: 'Validaciones oficiales',
    Icon: ShieldCheck,
    description: <>Integraciones opcionales (RENAPER) para reducir fraude y datos duplicados.</>,
    href: '/docs/arquitectura/integraciones',
  },
  {
    title: 'Paneles y KPIs accionables',
    Icon: Gauge,
    description: <>Indicadores clave y alertas para priorizar acciones y medir impacto real.</>,
    href: '/docs/guias/kpis',
  },
  {
    title: 'Privacidad por diseño',
    Icon: Lock,
    description: <>Datos mínimos, consentimiento informado y controles de acceso por rol.</>,
    href: '/docs/seguridad/privacidad',
  },
];

/* ============================
   Contenido: Colaboradores
============================ */
const ContributorFeatures: FeatureItem[] = [
  {
    title: 'Transparencia y trazabilidad',
    Icon: FileCheck2,
    description: <>Cada proyecto mantiene historial y evidencias verificables con auditoría simple.</>,
    href: '/docs/guia-instituciones/transparencia',
  },
  {
    title: 'Chat en tiempo real',
    Icon: MessageCircle,
    description: <>Coordiná con la institución vía mensajería en tiempo real (Firebase).</>,
    href: '/docs/guia-colaboradores/chat',
  },
  {
    title: 'Tu contribución, visible',
    Icon: HeartHandshake,
    description: <>Tu ayuda queda registrada y trazable, con reconocimiento y métricas.</>,
    href: '/docs/guia-colaboradores/impacto',
  },
  {
    title: 'Código abierto y comunidad',
    Icon: Code2,
    description: <>Sumate al proyecto: reportá issues, propone mejoras y participá del roadmap.</>,
    href: '/docs/comunidad/como-participar',
  },
];

export default function HomepageFeatures(): React.ReactElement {
  return (
    <section className={styles.features}>
      <div className={clsx('container', styles.container)}>
        <Heading as="h2" className={styles.sectionTitle}>
          ¿Qué ofrece Conectando Corazones?
        </Heading>

        <p className={styles.sectionSubtitle}>
          Plataforma para coordinar ayuda real, con evidencia verificable y respeto por la privacidad.
        </p>

        <Tabs className={styles.tabs}>
          <TabItem value="instituciones" label="Para instituciones" default>
            <div className={clsx('row', styles.grid)}>
              {InstitutionFeatures.map((f, i) => <FeatureCard key={`inst-${i}`} {...f} />)}
            </div>
          </TabItem>
          <TabItem value="colaboradores" label="Para colaboradores">
            <div className={clsx('row', styles.grid)}>
              {ContributorFeatures.map((f, i) => <FeatureCard key={`col-${i}`} {...f} />)}
            </div>
          </TabItem>
        </Tabs>
      </div>
    </section>
  );
}
