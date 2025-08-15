import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Conectando Corazones',
  tagline: 'Plataforma solidaria, transparente y trazable',
  favicon: 'img/logo-1.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://mvru.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/Conectando-Corazones/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Conectando Corazones', // Usually your GitHub org/user name.
  projectName: 'Conectando-Corazones', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    localeConfigs: {
      es: { label: 'Español' },
      en: { label: 'English' },
    },
  },

  markdown: { mermaid: true },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        // Recomendado para GH Pages (mejora cache y evita colisiones)
        hashed: true,

        // Idiomas a indexar (mejor stemming y stopwords)
        language: ['es', 'en'],

        // Qué indexar
        indexDocs: true,
        indexBlog: true, // poné false si no querés indexar el blog

        // UX
        highlightSearchTermsOnTargetPage: true,
        searchBarShortcutHint: true,

        // Rutas base (solo tocá si las cambiaste)
        docsRouteBasePath: '/docs',
        blogRouteBasePath: '/blog',

        // Opcional: limitar resultados o desactivar index de páginas sueltas
        // indexPages: false,
        // searchResultLimits: 20,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/MVRU/Conectando-Corazones/edit/main/docs-site/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/MVRU/Conectando-Corazones/edit/main/docs-site/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',

        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/logo-1.png',
    colorMode: {
      defaultMode: 'dark',
    },
    navbar: {
      title: 'Conectando Corazones',
      logo: {
        alt: 'Logo de Conectando Corazones',
        src: 'img/logo-2.png',
        srcDark: 'img/logo-1.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentación',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/MVRU/Conectando-Corazones',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentación',
          items: [
            {
              label: 'Para usuarios',
              to: '/docs/usuarios',
            },
            {
              label: 'Para desarrolladores',
              to: '/docs/dev',
            },
          ],
        },
        {
          title: 'Comunidad',
          items: [
            {
              label: 'GitHub Issues',
              href: 'https://github.com/MVRU/Conectando-Corazones/issues',
            },
            {
              label: 'Wiki del proyecto',
              href: 'https://github.com/MVRU/Conectando-Corazones/wiki',
            },
          ],
        },
        {
          title: 'Otros',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/MVRU/Conectando-Corazones',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Conectando Corazones. Todos los derechos reservados.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;