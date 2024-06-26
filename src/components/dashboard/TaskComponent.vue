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
      <v-col cols="12" v-for="(task, index) in userTasks" :key="index">
        <v-card class="pa-4" outlined>
          <v-card-title class="headline">{{ task.taskName }}</v-card-title>
          <v-card-text>{{ task.taskDescription }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" v-if="userTasks.length === 0 && !errorMessage">
        <v-alert type="info"> No tasks found </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default {
  props: {
    search: {
      type: [String, null],
      required: true,
    },
  },
  data() {
    return {
      userTasks: [],
      errorMessage: '',
    }
  },
  watch: {
    search() {
      if (this.search) this.fetchData()
      else this.userTasks = []
    },
  },
  methods: {
    async fetchData() {
      this.errorMessage = ''
      if (!this.search.trim()) {
        this.errorMessage = 'Search field is empty'
        this.userTasks = []
        return
      }
      const docRef = doc(db, 'tests', this.search)

      try {
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.testStructure && data.testStructure.userTasks) {
            this.userTasks = data.testStructure.userTasks
          } else {
            this.errorMessage = 'No tasks available in the document structure.'
            this.userTasks = []
          }
        } else {
          this.errorMessage = 'No such document!'
          this.userTasks = [] // Clear previous data
        }
      } catch (error) {
        this.errorMessage = 'Error fetching document: ' + error.message
        this.userTasks = []
      }
    },
  },
}
</script>
<style scoped></style>
