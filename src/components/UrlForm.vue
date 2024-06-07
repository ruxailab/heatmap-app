<template>
  <v-form v-model="validUrl">
    <v-row align="center">
      <v-col>
        <v-text-field class="pt-5" label="Url" v-model="inputUrl" variant="solo" :rules="urlRules"
          required></v-text-field>
      </v-col>
      <v-col>
        <v-btn class="bg-green" :disabled="!validUrl" @click="sendUrl">Go</v-btn>
        <v-progress-circular v-if="isLoading" indeterminate color="green"></v-progress-circular>
      </v-col>
    </v-row>
  </v-form>
  <v-dialog v-model="errorDialog" persistent max-width="300">
    <v-card>
      <v-card-title class="headline">Error</v-card-title>
      <v-card-text>
        {{ errorMessage }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="errorDialog = false">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
      isLoading: false,
      errorDialog: false,
      errorMessage: '',
      urlRules: [
        (value) => !!value || 'Url required.',
        (value) => {
          const urlRegex =
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
          return urlRegex.test(value) || 'Invalid url.'
        },
      ],
    }
  },
  created() {
    const { electronAPI } = window
    if (electronAPI) {
      electronAPI.on('webview-load-finished', () => {
        this.startChronometer()
        this.isLoading = false
      })
      electronAPI.on('webview-load-failed', (errorMessage) => {
        this.errorMessage = 'Failed while loading the url: ' + errorMessage
        this.errorDialog = true
        this.isLoading = false
      })
    }
  },
  methods: {
    sendUrl() {
      if (window.electronAPI) {
        this.isLoading = true
        window.electronAPI.send('urlToGo', [this.inputUrl, this.toolbarHeight])
      } else {
        console.error('electronAPI is not defined')
      }
    },
  },
}
</script>

<style scoped></style>
