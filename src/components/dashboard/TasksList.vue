<template>
  <v-container class="pa-8">
    <!-- Title -->
    <v-row align="center">
      <v-col cols="auto">
        <v-btn icon="mdi-arrow-left" variant="flat" @click="goBack"> </v-btn>
      </v-col>
      <v-col>
        <h1 class="my-2">Choose a Task...</h1>
      </v-col>
    </v-row>

    <!-- Task cards -->
    <v-row>
      <v-col cols="12" v-for="(task, index) in tasks" :key="index">
        <v-card class="pa-4 d-flex flex-column justify-space-between">
          <v-card-title class="headline">
            {{ task.taskName }}
            <v-chip v-if="task.completed" color="success" class="ml-2"
              >Completed !</v-chip
            >
          </v-card-title>
          <v-card-text>
            <FoldableTaskDesc :task="task" />
          </v-card-text>
          <v-card-actions class="d-flex justify-end">
            <v-btn
              v-if="!task.completed"
              @click="startTask(task)"
              variant="tonal"
              color="success"
              :disabled="task.completed"
              append-icon="mdi-arrow-right"
            >
              Start task
            </v-btn>
            <v-btn
              v-else
              @click="startTask(task)"
              variant="tonal"
              color="warning"
              append-icon="mdi-arrow-right"
              >Repeat</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <NoUrlDialog :task="selectedTask" />
    </v-dialog>
  </v-container>
</template>

<script>
import FoldableTaskDesc from './FoldableTaskDesc.vue'
import NoUrlDialog from './NoUrlDialog.vue'

export default {
  components: {
    NoUrlDialog,
    FoldableTaskDesc,
  },
  props: {
    tasks: {
      type: Array,
    },
  },
  data() {
    return {
      errorMessage: '',
      loading: false,
      showFullDescription: null,
      dialog: false,
      selectedTask: {},
    }
  },
  methods: {
    startTask(task) {
      if (!task.initialUrl) {
        this.selectedTask = task
        this.dialog = true
      } else {
        // Logic to start the task
        console.log('Starting task:', task.taskName)
      }
    },
    startTaskWithUrl() {
      // Logic to start the task with the provided URL
      console.log(
        'Starting task:',
        this.selectedTask.taskName,
        'with URL:',
        this.url,
      )
    },
    goBack() {
      this.$emit('onBack')
    },
  },
}
</script>

<style scoped>
.v-card {
  box-shadow:
    0 4px 4px -2px rgba(0, 0, 0, 0.4),
    0 0 2px 0 rgba(0, 0, 0, 0.3),
    0 0 5px 0 rgba(0, 0, 0, 0.2);
}
</style>
