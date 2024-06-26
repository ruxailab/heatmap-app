<template>
  <v-container class="pa-8">
    <v-alert
      v-if="errorMessage"
      type="error"
      dense
      dismissible
      @input="errorMessage = ''"
    >
      {{ errorMessage }}
    </v-alert>

    <v-row>
      <!-- Loading indicator -->
      <v-col cols="12" v-if="loading" class="d-flex justify-center">
        <v-progress-circular
          :size="70"
          :width="7"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>

      <!-- Task cards -->
      <v-col cols="12" v-for="(task, index) in userTasks" :key="index">
        <v-card class="pa-4" outlined>
          <v-card-title class="headline">{{ task.taskName }}</v-card-title>
          <v-card-text>{{ task.taskDescription }}</v-card-text>
        </v-card>
      </v-col>

      <!-- No tasks message -->
      <v-col
        cols="12"
        v-if="userTasks.length === 0 && !errorMessage && !loading"
      >
        <v-alert type="info"> No tasks found </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default {
  data() {
    return {
      taskCode: '',
      userTasks: [],
      errorMessage: '',
      loading: false,
    }
  },
  created() {
    this.taskCode = this.$route.query.code || ''
    if (this.taskCode) {
      this.fetchData(this.taskCode)
    }
  },
  methods: {
    async fetchData(search) {
      this.loading = true
      this.errorMessage = ''
      this.userTasks = []

      const trimmedSearch = search.trim()

      if (!trimmedSearch) {
        this.errorMessage = 'Search field is empty'
        this.loading = false
        return
      }

      const docRef = doc(db, 'tests', trimmedSearch)

      try {
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
          this.errorMessage = 'No such document!'
          return
        }

        const data = docSnap.data()

        if (data?.testStructure?.userTasks) {
          this.userTasks = data.testStructure.userTasks
        } else {
          this.errorMessage = 'No tasks available in the document structure.'
        }
      } catch (error) {
        this.errorMessage = 'Error fetching document: ' + error.message
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
<style scoped></style>
