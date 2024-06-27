<template>
  <v-dialog v-model="isLoading" persistent max-width="200">
    <v-card>
      <v-card-title> Loading... </v-card-title>
      <v-card-text class="text-center">
        <v-progress-circular indeterminate></v-progress-circular>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Error dialog -->
  <v-dialog v-model="errorDialog" persistent max-width="300">
    <v-card>
      <v-card-title class="headline">Error</v-card-title>
      <v-card-text>
        {{ errorMessage }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="goBack()"> OK </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-container v-if="!isLoading && !errorDialog" class="w-75 text-center">
    <h1 class="error">Oops!</h1>
    <p>Looks like something's missing.</p>
    <p>If the problem persists, please let us know.</p>
    <v-row class="mt-10 justify-center">
      <v-col cols="12">
        <v-btn prepend-icon="mdi-arrow-left" @click="goBack">Go Back</v-btn>
      </v-col>
      <v-col cols="12" class="mx-auto px-auto text-center">
        <span>or</span>
      </v-col>
      <v-col cols="12">
        <v-btn variant="text" @click="contactSupport">Contact Support</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  inject: ['startChronometer'],
  props: {
    toolbarHeight: Number,
    inputUrl: String,
  },
  data() {
    return {
      isLoading: true,
      errorDialog: false,
    }
  },
  created() {
    const { electronAPI } = window
    if (electronAPI) {
      electronAPI.on('webview-load-finished', () => {
        console.log('WEB LOAD FINISH')
        this.startChronometer()
        this.isLoading = false
      })
      electronAPI.on('webview-load-failed', (errorMessage) => {
        this.errorMessage = 'Failed while loading the url: ' + errorMessage
        this.errorDialog = true
      })

      electronAPI.send('urlToGo', [this.inputUrl, this.toolbarHeight])
    }
  },
  methods: {
    goBack() {
      // TODO: send to electron to end
      this.$router.push('/')
      this.errorDialog = false
    },
    contactSupport() {
      //TODO
    },
  },
}
</script>

<style scoped>
h1 .error {
  color: #de5246;
  font-size: 8em;
}
</style>
