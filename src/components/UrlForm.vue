<template>
  <v-form v-model="validUrl">
    <v-row align="center">
      <v-col>
        <v-text-field
          class="pt-5"
          label="Url"
          v-model="inputUrl"
          variant="solo"
          :rules="urlRules"
          required
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn class="bg-green" :disabled="!validUrl" @click="sendUrl"
          >Go</v-btn
        >
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  name: 'UrlForm',
  inject: ['startChronometer'],
  props: {
    toolbarHeight: Number,
  },
  data() {
    return {
      inputUrl: '',
      validUrl: false,
      urlRules: [
        (value) => !!value || 'Url required.',
        (value) => {
          const urlRegex =
            /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/
          return urlRegex.test(value) || 'Invalid url.'
        },
      ],
    }
  },
  methods: {
    sendUrl() {
      if (window.electronAPI) {
        window.electronAPI.send('urlToGo', [this.inputUrl, this.toolbarHeight])
        this.startChronometer()
      } else {
        console.error('electronAPI is not defined')
      }
    },
  },
}
</script>

<style scoped></style>
