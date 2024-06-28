<template>
  <v-container fluid class="pa-0 h-100">
    <CodeInput
      v-if="userTasks.length < 1"
      :loading="loading"
      :error-message="errorMessage"
      @fetch="handleFetch"
      @clearErrors="handleClear"
    />
    <TasksList v-else @onBack="goBack" :tasks="userTasks" />
  </v-container>
</template>

<script>
import { db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'

import CodeInput from '@/components/dashboard/CodeInput.vue'
import TasksList from '@/components/dashboard/TasksList.vue'

export default {
  components: {
    CodeInput,
    TasksList,
  },
  data() {
    return {
      taskCode: '',
      loading: false,
      errorMessage: '',
      userTasks: [],
    }
  },
  methods: {
    goBack() {
      this.userTasks = []
    },
    handleClear() {
      this.errorMessage = ''
    },
    handleFetch(input) {
      const code = this.extractTestId(input)

      if (code) this.fetchData(code)
      else this.errorMessage = 'Invalid url format'
    },
    extractTestId(url) {
      const regex = /testview\/([^/?]+)/
      const match = url.match(regex)
      return match ? match[1] : null
    },
    async fetchData(search) {
      this.loading = true
      this.errorMessage = ''
      this.userTasks = []

      const trimmedSearch = search?.trim()

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
