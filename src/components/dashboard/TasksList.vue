<template>
  <v-container class="pa-8">
    <h1 class="my-2">Choose a Task...</h1>
    <v-row>
      <!-- Task cards -->
      <v-col cols="12" v-for="(task, index) in tasks" :key="index">
        <v-card class="pa-4 d-flex flex-column justify-space-between" variant="outlined">
          <v-card-title class="headline">{{ task.taskName }}</v-card-title>
          <v-card-text>
            <div v-if="showFullDescription !== task.taskName" class="text-container">
              {{ task.taskDescription }}
              <div v-if="task.taskDescription.length > 150" class="fade-out"></div>
            </div>
            <div v-else>
              {{ task.taskDescription }}
            </div>
            <span v-if="task.taskDescription.length > 150" @click="toggleDescription(task.taskName)"
              style="text-decoration: underline; cursor: pointer">
              {{
                showFullDescription === task.taskName ? 'Less...' : 'More...'
              }}
            </span>
          </v-card-text>
          <v-card-actions class="d-flex justify-end">
            <v-btn @click="startTask(task)" variant="tonal" color="success" append-icon="mdi-arrow-right">
              Start task
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
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
    }
  },
  methods: {
    startTask(task) {
      // Logic to start the task
      console.log('Starting task:', task.taskName)
    },
    toggleDescription(taskName) {
      this.showFullDescription =
        this.showFullDescription === taskName ? null : taskName
    },
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
