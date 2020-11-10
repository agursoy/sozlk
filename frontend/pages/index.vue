<template>
  <div class="flex flex-wrap">
    <div class="hidden md:block md:w-1/10">
      <div class="w-64 md:w-32 md:h-64">
        <adsbygoogle />
      </div>
    </div>
    <div class="w-full md:w-8/10 flex flex-wrap pr-0 md:pr-3">
      <!-- Login Section -->
      <div class="w-full md:w-1/2 h-screen flex flex-col">
        <div
          class="flex justify-center md:justify-start pt-12 md:pl-12 md:-mb-24"
        >
          <ul class="flex">
            <li>
              <nuxt-link
                :to="'/'"
                class="bg-black text-white font-bold text-xl p-4"
                >Sozlk.</nuxt-link
              >
            </li>
          </ul>
        </div>

        <div
          class="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32"
        >
          <h1 class="text-center text-3xl">Osmanlıca-Türkçe Sözlük</h1>
          <form
            class="flex flex-col pt-3 md:pt-8"
            onsubmit="event.preventDefault();"
          >
            <div class="flex flex-col pt-4">
              <input
                id="word"
                v-model="word"
                type="text"
                placeholder="Aramak istediğiniz kelimeyi giriniz."
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <input
              type="submit"
              value="Ara"
              class="bg-black text-white font-bold text-lg hover:bg-gray-700 p-2 mt-8"
              @click="search"
            />
          </form>
        </div>
      </div>
      <!-- ads on mobile --->
      <div class="block md:hidden py-3">
        <div class="w-64 md:w-32 md:h-64">
          <adsbygoogle />
        </div>
      </div>
      <!-- ads on mobile --->
      <div
        class="w-full md:w-1/2 h-screen shadow-2xl px-3 py-6 object-cover"
        style="background-image: url('/bg.jpeg')"
      >
        <nuxt-child :key="$route.params.id" class="result"></nuxt-child>
      </div>
    </div>
    <div class="w-full md:w-1/10 pt-5 md:pt-0">
      <div class="w-64 md:w-32 md:h-64">
        <adsbygoogle />
      </div>
    </div>
    <div class="container my-12 mx-auto px-4 md:px-12">
      <div class="px-4 pt-3 text-3xl">Sözlükten:</div>
      <div class="flex flex-wrap -mx-1 lg:-mx-4">
        <!-- Column -->
        <div
          v-for="(searchItem, key) in mostSearch"
          :key="key"
          class="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3"
        >
          <div class="max-w-sm rounded shadow-lg">
            <div class="px-6 py-4">
              <div class="font-bold text-teal-500 text-xl mb-2">
                <a target="_blank" :href="`/${searchItem[0].slug}/`">
                  {{ searchItem[0].word }}
                </a>
              </div>
              <p
                class="text-gray-700 text-base h-12 md:h-24 overflow-hidden break-all"
              >
                {{ searchItem[0].meaning }}
              </p>
            </div>
            <div class="px-6 pt-4 pb-2 flex justify-center">
              <a target="_blank" :href="`/${searchItem[0].slug}/`">
                <span
                  class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  >Tamamını Gör</span
                >
              </a>
            </div>
            <!-- div class="px-6 pt-4 pb-2">
              <span
                class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >#photography</span
              >
              <span
                class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >#travel</span
              >
              <span
                class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >#winter</span
              >
            </div -->
          </div>
          <!-- END Article -->
        </div>
        <!-- END Column -->
      </div>
    </div>
  </div>
</template>

<script>
import slugify from 'slugify'

export default {
  async asyncData({ $strapi, payload }) {
    let mostSearch = []
    const itemCount = 24
    const max = 50000

    if (payload) {
      for (let i = 0; i < itemCount; i++) {
        const random = Math.floor(Math.random() * (max + 1))
        if (payload[random]) {
          mostSearch.push([payload[random]])
        }
      }
    } else {
      try {
        const promises = []
        for (let i = 0; i < itemCount; i++) {
          const random = Math.floor(Math.random() * (max + 1))
          promises.push(
            $strapi.$http.$get(
              `dictionaries?_start=${random - itemCount}&_limit=1`
            )
          )
        }
        const result = await Promise.all(promises)
        if (result.length) {
          mostSearch = result
        }
      } catch (e) {}
    }

    return {
      mostSearch,
    }
  },
  data() {
    return {
      word: null,
    }
  },
  mounted() {
    if (
      window.innerWidth &&
      window.innerWidth < 1024 &&
      this.$route.params.slug
    ) {
      this.scrollToResult()
    }
  },
  methods: {
    slugify,
    search() {
      const slug = slugify(this.word, {
        replacement: '-',
        lower: true,
        strict: true,
        locale: 'tr',
      })
      this.$router.push(`/${slug}/`)
      this.scrollToResult()
    },
    scrollToResult() {
      const el = this.$el.getElementsByClassName('result')[0]

      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    },
  },
}
</script>

<style>
ins {
  background: #bbb;
}
</style>
