import axios from 'axios'

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'server',
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
        content: `${process.env.URL}/share.png`,
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
  plugins: [
    { src: '~/plugins/ga.js', ssr: false },
    { src: '~plugins/smoothscroll.js', ssr: false },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/strapi',
    /* [
      '@nuxtjs/google-adsense',
      {
        id: process.env.ADSENSE,
        overlayBottom: true,
      },
    ], */
    ['@nuxtjs/sitemap'],
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: false,
        minifyJS: false,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
      },
    },
  },

  // Strapi
  strapi: {
    url: process.env.API_URL || 'http://localhost:1337',
    entities: ['dictionaries'],
  },

  // Router
  router: {
    trailingSlash: true,
  },

  // Env
  env: {
    googleAnalytics: process.env.GOOGLE_ANALYTICS,
  },

  // Sitemap
  /*
  async sitemap() {
    const sitemaps = []
    const sitemapFunc = function (type, offset, limit) {
      return async () => {
        const base = process.env.GENERATE_URL || 'http://localhost:1337'
        const { data } = await axios.get(
          `${base}/dictionaries?_start=${offset}&_limit=${limit}&mode=sitemap`
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
      `${
        process.env.GENERATE_URL || 'http://localhost:1337'
      }/dictionaries/count`
    )
    console.log(
      `${
        process.env.GENERATE_URL || 'http://localhost:1337'
      }/dictionaries/count`
    )
    const info = {
      counts: {
        words: data,
      },
    }
    const types = ['words']
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
        console.log(
          `/feed/sitemap-${item}-${offset}-${offset + requestLimit}.xml`
        )
        sitemaps.push({
          hostname: process.env.URL,
          path: `/feed/sitemap-${item}-${offset}-${offset + requestLimit}.xml`,
          routes: sitemapFunc(item, offset, requestLimit),
          exclude: ['/**'],
          trailingSlash: true,
        })
      }
    }
    return {
      hostname: process.env.URL,
      path: '/feed/sitemap-index.xml',
      sitemaps,
    }
  },
  */

  // Custom Genereate
  /*
  generate: {
    concurrency: 5000,
    fallback: true,
    async routes(callback) {
      const groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
          ;(rv[x[key]] = rv[x[key]] || []).push(x)
          return rv
        }, {})
      }

      const base = process.env.GENERATE_URL || 'http://localhost:1337'
      const { data } = await axios.get(`${base}/dictionaries/count`)
      const info = {
        counts: {
          words: data,
        },
      }
      const types = ['words']

      const requestLimit = 5000
      const routes = []
      for (const item of types) {
        const count = info.counts[item]
        const repeat =
          Math.ceil(count / requestLimit) > 0
            ? Math.ceil(count / requestLimit)
            : 1
        const contentRequests = []
        for (let i = 0; i < repeat; i++) {
          const offset = i * requestLimit
          contentRequests.push(
            axios.get(
              `${base}/dictionaries?_start=${offset}&_limit=${requestLimit}&mode=full`
            )
          )
        }
        await axios.all(contentRequests).then(
          axios.spread((...responses) => {
            responses.forEach((response) => {
              const array = groupBy(response.data, 'slug')
              for (const property in array) {
                routes.push({
                  route: '/' + property + '/',
                  payload: array[property],
                })
              }
            })
          })
        )
      }
      callback(null, routes)
    },
  },
  */
}
