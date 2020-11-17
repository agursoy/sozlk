<template>
  <div class="relative py-3 sm:max-w-xl sm:mx-auto">
    <div
      class="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
    ></div>
    <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-10">
      <div class="max-w-md mx-auto">
        <div class="divide-y divide-gray-200">
          <div
            class="text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
          >
            <div>
              <p
                v-if="showNoResult"
                class="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7"
              >
                Maalesef Aradığınız Kelime Bulunamadı
              </p>

              <div v-else-if="results.length === 0 && suggestions.length > 0">
                <p
                  class="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7"
                >
                  Bunu mu demek istediniz?
                </p>
                <div class="py-5">
                  <span
                    v-for="(suggest, key) in suggestions"
                    :key="key"
                    class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                    ><a :href="`/${suggest.slug}/`"
                      >#{{ suggest.word }}</a
                    ></span
                  >
                </div>
              </div>
            </div>
            <div v-if="results.length > 0">
              <p
                class="pt-6 pb-6 text-base leading-6 font-bold sm:text-lg sm:leading-7"
              >
                Bulunan Kelimeler
              </p>
              <ul class="list-disc space-y-2 max-h-1/3 overflow-scroll">
                <li
                  v-for="(result, key) in results"
                  :key="key"
                  class="flex items-start flex-col md:flex-row"
                >
                  <span class="flex items-center sm:h-7">
                    <svg
                      class="flex-shrink-0 h-5 w-5 text-teal-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <h2 class="ml-2 text-lg">{{ result.word }}:</h2>
                  </span>
                  <p class="ml-0 md:ml-2 pt-3 md:pt-0">
                    {{ result.meaning }}
                  </p>
                </li>
              </ul>
            </div>
            <div v-if="similars.length > 0" class="pb-4">
              <p
                class="pt-3 pb-6 text-base leading-6 font-bold sm:text-lg sm:leading-7"
              >
                Benzer Kelimeler
              </p>
              <ul class="list-disc space-y-2 max-h-1/3 overflow-scroll">
                <li
                  v-for="(similar, key) in similars"
                  :key="key"
                  class="flex items-start flex-col md:flex-row"
                >
                  <span class="flex items-center sm:h-7">
                    <svg
                      class="flex-shrink-0 h-5 w-5 text-teal-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <h2 class="ml-2 text-lg">{{ similar.word }}:</h2>
                  </span>
                  <p class="ml-0 md:ml-2 pt-3 md:pt-0">
                    {{ similar.meaning }}
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div
            class="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7"
          >
            <p class="text-teal-600 hover:text-teal-700">
              Sozlk.com 50.000+ kelimeyi içermektedir.
            </p>
            <p class="pt-4">
              Aradığınız kelimeyi bulamadıysanız farklı şekilde yazarak tekrar
              deneyebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import metaphone from 'double-metaphone'
import { mapGetters } from 'vuex'

export default {
  async asyncData({ route, $strapi, payload }) {
    const similars = []
    if (payload) {
      if (payload.similars && payload.similars.length) {
        for await (const s of payload.similars) {
          if (!similars.map((s) => s._id).includes(s._id)) similars.push(s)
        }
      }

      return {
        results: payload,
        similars,
      }
    } else {
      const results = await $strapi.$dictionaries.find({
        slug: route.params.slug,
      })

      if (results.length) {
        for await (const r of results) {
          if (r.similars && r.similars.length) {
            for await (const s of r.similars) {
              if (!similars.map((s) => s._id).includes(s._id)) similars.push(s)
            }
          }
        }
      }

      return {
        results,
        similars,
      }
    }
  },
  data() {
    return {
      suggestions: [],
      showNoResult: false,
    }
  },
  computed: {
    ...mapGetters({
      search: 'site/search',
    }),
    slug() {
      if (this.$route.params.slug) {
        return this.$route.params.slug
      }
      return null
    },
    headTitle() {
      const word = []
      const meaning = []
      this.results.forEach((r) => {
        word.push(r.word)
        meaning.push(r.meaning)
      })
      return `${word.join(',')} | Anlamı: ${meaning.join(',')}`.substring(0, 55)
    },
    headDescription() {
      const word = []
      const meaning = []
      this.results.forEach((r) => {
        word.push(r.word)
        meaning.push(r.meaning)
      })
      return `Tıklayın ve ${word.join(
        ','
      )} kelimesinin Osmanlıca - Türkçe sözlükte anlamını okuyun: ${meaning.join(
        ','
      )}`
    },
  },
  watch: {
    results: {
      handler(val) {
        if (val.length === 0) {
          this.getSuggestions(this.search)
        }
      },
    },
  },
  mounted() {
    if (this.results.length === 0) {
      this.getSuggestions(this.search)
    }
  },
  methods: {
    async getSuggestions(search) {
      if (search !== null) {
        const meta = metaphone(search)
        this.suggestions = await this.$strapi.$http.$post('similar', {
          word: search,
          meta1: meta[0],
          meta2: meta[1],
        })
        if (this.getSuggestions.length === 0) {
          this.showNoResult = true
        }
      }
    },
  },
  head() {
    return {
      title: this.headTitle ? `${this.headTitle} | Sozlk.` : 'Sozlk.',
      link: [
        {
          rel: 'canonical',
          href: `${process.env.URL}${this.$route.path}`,
        },
      ],
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.headDescription
            ? `${this.headDescription} | Sozlk.`
            : 'Sozlk.',
        },
      ],
    }
  },
}
</script>
