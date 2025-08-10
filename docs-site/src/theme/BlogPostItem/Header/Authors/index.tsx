import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type Author = {
  name?: string;
  title?: string;
  url?: string;
  imageURL?: string;
  image_url?: string;
};

type AnyProps = Record<string, any>;

function coerceAuthors(props: AnyProps): Author[] {
  // 1) caso típico: ya viene resuelto
  if (Array.isArray(props.authors) && props.authors.length && (props.authors[0].name || props.authors[0].imageURL || props.authors[0].image_url)) {
    return props.authors;
  }
  // 2) metadata.authors (algunas versiones)
  if (Array.isArray(props.metadata?.authors)) {
    return props.metadata.authors;
  }
  // 3) frontMatter.authors = ['alexis', 'marina']  (no resuelto)
  //    -> en este caso, no podemos resolver aquí sin acceso al authorsMap del plugin.
  //    si llegamos acá, probablemente falta blog/authors.yml o la ruta no coincide.
  return [];
}

export default function BlogPostAuthors(rawProps: AnyProps): React.ReactElement | null {
  const authors = coerceAuthors(rawProps);
  if (!authors || authors.length === 0) return null;

  return (
    <div className={styles.authorsGrid}>
      {authors.map((author: Author, idx: number) => {
        const imageUrl = author.imageURL ?? author.image_url;
        const name = author.name ?? author.title ?? 'Autor';
        const title = author.title;
        const url = author.url;

        const Avatar = (
          <div className={styles.card}>
            {imageUrl && <img className={styles.avatar} src={imageUrl} alt={name} loading="lazy" />}
            <div className={styles.meta}>
              <div className={styles.name}>{name}</div>
              {title && <div className={styles.role}>{title}</div>}
            </div>
          </div>
        );

        return (
          <div key={idx} className={styles.cell}>
            {url ? (
              <Link to={url} className={styles.link} aria-label={`Perfil de ${name}`}>
                {Avatar}
              </Link>
            ) : (
              Avatar
            )}
          </div>
        );
      })}
    </div>
  );
}
