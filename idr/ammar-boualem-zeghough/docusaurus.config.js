const config = {
  title: 'Ammar Boualem Zeghough IDR',
  tagline: 'Individual Development Roadmap',
  favicon: 'https://www.skunkworksacademy.com/favicon.ico',
  url: 'https://www.skunkworksacademy.com',
  baseUrl: '/idr/ammar-boualem-zeghough/',
  trailingSlash: true,
  organizationName: 'skunkworks-academy',
  projectName: 'www',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: 'plan',
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateTime: true
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true
    },
    navbar: {
      title: 'Skunkworks Academy | IDR',
      items: [
        {to: '/', label: 'Dashboard', position: 'left'},
        {to: '/plan/overview/', label: 'Overview', position: 'left'},
        {to: '/plan/12-week-sprint/', label: '12-Week Sprint', position: 'left'},
        {to: '/plan/projects/', label: 'Projects', position: 'left'},
        {href: 'https://www.skunkworksacademy.com/', label: 'Academy', position: 'right'},
        {href: 'https://github.com/zeghoughdz-ship-it', label: 'GitHub', position: 'right'}
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {title: 'IDR', items: [
          {label: 'Roadmap', to: '/plan/roadmap/'},
          {label: 'Curriculum', to: '/plan/curriculum/'},
          {label: 'Download PDF', href: '/idr/ammar-boualem-zeghough/downloads/Ammar_Boualem_Zeghough_Individual_Development_Roadmap.pdf'}
        ]},
        {title: 'Profiles', items: [
          {label: 'LinkedIn', href: 'https://www.linkedin.com/in/ammar-boualem-zeghough-89981a219/'},
          {label: 'GitHub', href: 'https://github.com/zeghoughdz-ship-it'}
        ]}
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Skunkworks Academy.`
    },
    prism: {additionalLanguages: ['bash', 'javascript', 'python']}
  }
};
module.exports = config;
