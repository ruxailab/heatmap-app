<script>
export default {
  name: 'UrlForm',
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
        window.electronAPI.send('urlToGo', this.inputUrl)
      } else {
        console.error('electronAPI is not defined')
      }
    },
  },
}
</script>

<template>
  <v-container>
    <v-form v-model="validUrl">
      <v-text-field
        class="mx-auto"
        min-width="400"
        label="Url"
        v-model="inputUrl"
        variant="solo"
        :rules="urlRules"
      ></v-text-field>
    </v-form>
    <v-btn class="bg-green" :disabled="!validUrl" @click="sendUrl">Go</v-btn>
  </v-container>
</template>

<style scoped></style>
