import axios from 'axios'

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Sozlk. | 50.000+ fazla Osmanlıca Kelime',
    meta: [
      { charset: 'utf-8' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.DESCRIPTION,
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: process.env.KEYWORDS,
      },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=2.0, user-scalable=0',
      },
      {
        name: 'msapplication-TileImage',
        content: '/icon-192x192.png',
      },
      {
        property: 'og:url',
        hid: 'og:url',
        content: process.env.URL,
      },
      {
        property: 'og:type',
        hid: 'og:type',
        content: 'website',
      },
      {
        property: 'og:title',
        hid: 'og:title',
        content: 'Sozlk.',
      },
      {
        property: 'og:description',
        hid: 'og:description',
        content: process.env.DESCRIPTION,
      },
      {
        property: 'og:image',
        hid: 'og:image',
        content: `${process.env.URL}/share.png`,
      },
      {
        property: 'og:locale',
        hid: 'og:locale',
        content: 'tr_TR',
      },
      {
        property: 'og:site_name',
        hid: 'og:site_name',
        content: 'Sozlk.',
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        hid: 'twitter:creator',
        name: 'twitter:creator',
        content: process.env.TWITTER,
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Sozlk.',
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: process.env.DESCRIPTION,
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: `${process.env.URL}/share.jpg`,
      },
      {
        hid: 'twitter:site',
        name: 'twitter:site',
        content: process.env.TWITTER,
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [{ src: '~plugins/smoothscroll.js', ssr: false }],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://github.com/nuxt-community/google-adsense-module#readme
    '@nuxtjs/google-adsense',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/strapi',
    '@nuxtjs/sitemap',
    [
      '@nuxtjs/google-adsense',
      {
        test: true,
      },
    ],
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  // Strapi
  strapi: {
    url: process.env.API_URL || 'http://localhost:1337',
    entities: ['dictionaries'],
  },

  // Sitemap
  async sitemap() {
    const sitemaps = []
    const sitemapFunc = function (type, offset, limit) {
      return async () => {
        const base = process.env.API_URL || 'http://localhost:1337'
        const { data } = await axios.get(
          `${base}/dictionaries?_start=${offset}&_limit=${limit}`
        )
        if (data) {
          return data.map((item) => {
            return {
              url: item.slug || null,
              lastmod: item.updatedAt || null,
            }
          })
        } else {
          return []
        }
      }
    }
    const { data } = await axios.get(
      `${process.env.API_URL || 'http://localhost:1337'}/dictionaries/count`
    )
    const info = {
      counts: {
        words: data,
      },
    }
    const types = ['words']
    // push pages sitemap
    sitemaps.push({
      path: '/feed/sitemap-pages.xml',
      exclude: ['/404', '/500'],
    })
    // push content's sitemaps
    const requestLimit = 5000
    for (const item of types) {
      const count = info.counts[item]
      const repeat =
        Math.ceil(count / requestLimit) > 0
          ? Math.ceil(count / requestLimit)
          : 1
      for (let i = 0; i < repeat; i++) {
        const offset = i * requestLimit
        const limit = i * requestLimit + requestLimit
        sitemaps.push({
          path: `/feed/sitemap-${item}-${offset}-${limit}.xml`,
          routes: sitemapFunc(item, offset, limit),
          exclude: ['/**'],
        })
      }
    }
    return {
      path: '/feed/sitemap-index.xml',
      sitemaps,
    }
  },

  // Custom Genereate
  generate: {
    async routes(callback) {
      const base = process.env.API_URL || 'http://localhost:1337'
      const { data } = await axios.get(`${base}/dictionaries/count`)
      const info = {
        counts: {
          words: data,
        },
      }
      const types = ['words']

      const requestLimit = 5000
      for (const item of types) {
        const count = info.counts[item]
        const repeat =
          Math.ceil(count / requestLimit) > 0
            ? Math.ceil(count / requestLimit)
            : 1
        for (let i = 0; i < repeat; i++) {
          const offset = i * requestLimit
          const limit = i * requestLimit + requestLimit
          const { data } = await axios.get(
            `${base}/dictionaries?_start=${offset}&_limit=${limit}`
          )
          console.log(
            `fetched: ${base}/dictionaries?_start=${offset}&_limit=${limit}`
          )
          let routes = []
          if (data) {
            routes = data.map((item) => {
              return `/${item.slug}`
            })
            callback(null, routes)
          }
        }
      }
    },
  },
}
