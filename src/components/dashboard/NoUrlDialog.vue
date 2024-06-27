<template>
  <!-- Inside a VDialog -->
  <v-card class="pa-4">
    <v-card-title class="headline"> Missing Initial URL </v-card-title>
    <v-card-text>
      <p>
        The selected task does not have a default URL to begin. Please enter a
        URL to initiate the task. The starting URL should be in the task
        description:
      </p>
      <br />
      <FoldableTaskDesc :task="task" />
      <v-divider class="my-4 border-opacity-100" />
      <v-form v-model="validUrl">
        <v-text-field variant="outlined" v-model="url" label="Initial URL" required :rules="urlRules"></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn variant="tonal" color="red" append-icon="mdi-close" class="me-4" @click="dialog = false">Close</v-btn>
      <v-btn variant="elevated" color="green" append-icon="mdi-test-tube" :disabled="!validUrl"
        @click="startTaskWithUrl">Start Task</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import FoldableTaskDesc from './FoldableTaskDesc.vue'

export default {
  components: {
    FoldableTaskDesc,
  },
  props: {
    task: Object,
  },
  data() {
    return {
      validUrl: false,
      url: '',
      urlRules: [
        (value) => !!value || 'Url required.',
        (value) => {
          const urlRegex =
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/
          return urlRegex.test(value) || 'Invalid url.'
        },
      ],
    }
  },
  methods: {
    startTaskWithUrl() {
      if (this.url) {
      this.$router.push({ name: 'TaskStart', query: { url: this.url} });
      }
    },
  },
}
</script>
