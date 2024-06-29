<template>
  <v-container fluid class="pa-0 h-100">
    <CodeInput
      v-if="tasks.length < 1"
      :loading="loading"
      :error-message="errorMessage"
      @fetch="handleFetch"
      @clearErrors="handleClear"
    />
    <TasksList v-else @onBack="goBack" :tasks="tasks" />
  </v-container>
</template>

<script>
import { auth, db } from '@/firebase'
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
      tasks: [],
    }
  },
  methods: {
    goBack() {
      this.tasks = []
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
      this.tasks = []

      const trimmedSearch = search?.trim()

      const docRef = doc(db, 'tests', trimmedSearch)

      try {
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
          this.errorMessage = 'No such document!'
          return
        }

        const data = docSnap.data()

        if (data?.testType !== 'User')
          this.errorMessage = 'Only User tests allowed.'

        if (data?.testStructure?.userTasks) {
          const userTasks = data.testStructure.userTasks
          const answersTasks = await this.getAnswersOfTest(data.answersDocId)
          console.log(answersTasks)

          // Get if they are completed
          this.tasks = userTasks.map((task, index) => {
            return {
              ...task,
              completed: answersTasks[index]
                ? answersTasks[index].completed
                : false,
            }
          })
          console.log(this.tasks)
        } else {
          this.errorMessage = 'No tasks available in the document structure.'
        }
      } catch (error) {
        this.errorMessage = 'Error fetching document: ' + error.message
      } finally {
        this.loading = false
      }
    },
    async getAnswersOfTest(answersId) {
      console.log(answersId)
      const docRef = doc(db, 'answers', answersId)

      try {
        const docSnap = await getDoc(docRef)

        const data = docSnap.data()

        const useruid = auth.currentUser.uid
        console.log(useruid)
        const answers = data?.taskAnswers?.[useruid]?.tasks
        if (answers) {
          return answers
        }
      } catch (error) {
        this.errorMessage = 'Error fetching answers document: ' + error.message
      }
    },
  },
}
</script>

