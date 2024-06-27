<template>
  <v-container class="pa-8">
    <h1 class="my-2">Choose a Task...</h1>
    <v-row>
      <!-- Task cards -->
      <v-col cols="12" v-for="(task, index) in tasks" :key="index">
        <v-card class="pa-4 d-flex flex-column justify-space-between" variant="outlined">
          <v-card-title class="headline">{{ task.taskName }}</v-card-title>
          <v-card-text>
            <FoldableTaskDesc :task="task" />
          </v-card-text>
          <v-card-actions class="d-flex justify-end">
            <v-btn @click="startTask(task)" variant="tonal" color="success" append-icon="mdi-arrow-right">
              Start task
            </v-btn>
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
    // toggleDescription(taskName) {
    //   this.showFullDescription =
    //     this.showFullDescription === taskName ? null : taskName
    // },
  },
}
</script>
<style scoped>
.text-container {
  position: relative;
  max-height: 4.5em;
  overflow: hidden;
}

.fade-out {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 1.5em;
  background: linear-gradient(to right, transparent, white 99%);
}
</style>
