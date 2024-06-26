<template>
  <v-container fluid class="pa-0 h-100">
    <CodeInput @fetch="handleFetch" />
  </v-container>
</template>

<script>
import CodeInput from '@/components/dashboard/CodeInput.vue'

export default {
  components: {
    CodeInput,
  },
  data() {
    return {
      taskCode: '',
    }
  },
  methods: {
    handleFetch(taskCode) {
      // Logic to handle the task fetching with the provided task code
      this.taskCode = taskCode
      console.log(`Fetching task with code: ${this.taskCode}`)
      this.$router.push({ path: '/tasks', query: { code: taskCode } })
    },
  },
}
</script>
