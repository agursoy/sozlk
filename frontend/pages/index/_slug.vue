<template>
  <div class="relative py-3 sm:max-w-xl sm:mx-auto">
    <div
      class="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
    ></div>
    <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
      <div class="max-w-md mx-auto">
        <div class="divide-y divide-gray-200">
          <div
            class="text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
          >
            <div v-if="$fetchState.pending && slug">
              <p
                class="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7"
              >
                Aranıyor..
              </p>
            </div>
            <div
              v-else-if="!$fetchState.pending && slug && results.length === 0"
            >
              <p
                class="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7"
              >
                Maalesef Aradığınız Kelime Bulunamadı
              </p>
            </div>
            <div v-else-if="results.length > 0">
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
export default {
  async fetch() {
    if (this.slug) {
      this.results = await this.$strapi.$dictionaries.find({
        slug: this.slug,
      })
    }
  },
  data() {
    return {
      results: [],
    }
  },
  computed: {
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
    '$route.params'(val) {
      this.$fetch()
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
