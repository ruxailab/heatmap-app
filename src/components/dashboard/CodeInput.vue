<template>
  <v-container class="d-flex justify-center align-center h-75">
    <v-row>
      <v-col cols="12" class="text-center">
        <!-- Title and explanation -->
        <h1 class="title">Enter Your Test Code</h1>
        <p class="text-subtitle-1">Enter the test link to get the tasks</p>
        <p class="text-subtitle-2 help-link" @click.prevent="dialog = true">
          Need help?
        </p>
      </v-col>
      <v-col cols="12" class="d-flex justify-center align-center">
        <v-text-field
          :readonly="loading"
          v-model="taskCode"
          label="Enter the test url"
          variant="outlined"
          class="input-field"
          :rules="rules"
          @click="$emit('clearErrors')"
          ref="taskCodeInput"
          @input="valid = $refs.taskCodeInput.validate()"
        ></v-text-field>
      </v-col>

      <!-- Submit button -->
      <v-col cols="12" class="text-center">
        <v-btn
          v-if="!loading"
          @click="emitFetchEvent"
          color="black"
          class="mb-2 w-25"
          :disabled="!valid"
          >Get tasks !</v-btn
        >
        <v-btn v-else color="black" class="mb-2 w-25" disabled
          ><v-progress-circular indeterminate
        /></v-btn>
      </v-col>
    </v-row>

    <!-- More Help -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Help Information</v-card-title>
        <v-card-text>
          Enter the URL of the test to obtain the task to do. It should be
          similar to:
          <v-code class="text-center my-6 example-url"
            >https://ruxailab.com/testview/sW0Tkis6SJawYurG1hGM</v-code
          >
          If you have any issues, please contact support.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  props: {
    errorMessage: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      taskCode: '',

      dialog: false,
      valid: false,
      rules: [
        (value) => !!value || 'Input is required',
        (_value) => {
          if (!this.errorMessage) return true
          return this.errorMessage
        },
      ],
    }
  },
  watch: {
    errorMessage() {
      this.$refs.taskCodeInput.validate()
    },
  },
  methods: {
    emitFetchEvent() {
      this.$emit('fetch', this.taskCode)
    },
  },
}
</script>

<style scoped>
.title {
  font-weight: bold;
  font-size: 32px;
  color: #000;
}

.input-field {
  width: 100%;
  max-width: 500px;
}

.fill-height {
  height: 100vh;
}

.help-link {
  display: inline-block;
  cursor: pointer;
  color: #1976d2;
}

.help-link:hover {
  text-decoration: underline;
}

.example-url {
  display: block;
  font-family: monospace;
  font-size: 12px;
  color: #000;
  background-color: #9999;
  padding: 2px;
}
</style>
