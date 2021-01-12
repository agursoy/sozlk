<template>
  <div class="flex flex-wrap">
    <!--div class="hidden md:block md:w-1/10">
      <div class="w-64 md:w-32 md:h-64">
        <adsbygoogle />
      </div>
 </div-->
    <div class="w-full flex flex-wrap">
      <!-- Login Section -->
      <div class="w-full md:w-1/2 flex flex-col h-screen">
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
      <!--div class="block md:hidden py-3">
        <div class="w-64 md:w-32 md:h-64">
          <adsbygoogle />
        </div>
      </div-->
      <!-- ads on mobile --->
      <div
        class="w-full md:w-1/2 h-auto shadow-2xl px-3 py-6 object-cover"
        style="background-image: url('/bg.jpeg')"
      >
        <nuxt-child :key="$route.params.id" class="result"></nuxt-child>
      </div>
    </div>
    <!-- div class="w-full md:w-1/10 pt-5 md:pt-0">
      <div class="w-64 md:w-32 md:h-64">
        <adsbygoogle />
      </div>
    </div-->
  </div>
</template>

<script>
import slugify from 'slugify'

export default {
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

    if (this.$route.query.word) {
      this.word = this.$route.query.word
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
      this.$store.dispatch('site/setSearch', this.word)
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
