// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Mevera Studios',
  tagline: 'Documents for the Mevera Studios projects',
  favicon: 'img/favicon.ico',

  markdown: {
    mermaid: true,
  },

  themes: [
    '@docusaurus/theme-mermaid',
  ],

  // Set the production url of your site here
  url: 'https://docs.mevera.studio',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'MeveraStudios', // Usually your GitHub org/user name.
  projectName: 'Documentation', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'fa'],
    localeConfigs: {
      en: {
        htmlLang: 'en-GB',
      },
      // You can omit a locale (e.g. fr) if you don't need to override the defaults
      fa: {
        direction: 'rtl',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/MeveraStudios/Documentation/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/social-card.png',
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'Mevera Studios',
        logo: {
          alt: 'Mevera Studios Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: '/Imperat',
            position: 'left',
            label: 'Imperat',
          },
          {
            href: 'https://github.com/MeveraStudios',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction',
                to: '/',
              },
              {
                label: 'Imperat',
                to: '/Imperat',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.mevera.studio',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/MeveraStudios',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/MeveraStudios/Documentation',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Mevera Studios.`,
      },
      prism: {
        additionalLanguages: ['java'],
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      algolia: {
        appId: '60D19IKM2J',
        apiKey: '84d1524809ed9f3f2f92d2a88571ed7b',
        indexName: 'velix',
      }
    }),
};

export default config;
