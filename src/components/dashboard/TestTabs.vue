<template>
  <v-container fluid class="mt-8">
    <v-row justify="center" class="fill-height">
      <v-col cols="10">
        <v-divider class="mb-1" />
        <v-tabs
          v-model="mainIndex"
          background-color="transparent"
          color="black"
          class="hidden-sm-and-down mt-4"
        >
          <v-tab>{{ $t('Dashboard.tests') }}</v-tab>
          <v-spacer />
        </v-tabs>
        <v-divider class="hidden-sm-and-down" />

        <!-- Desktop Tests/Answers Sub tabs -->
        <v-tabs
          v-if="mainIndex === 0"
          v-model="subIndex"
          background-color="transparent"
          color="black"
          class="hidden-sm-and-down"
        >
          <v-tab>{{ $t('Dashboard.myTests') }}</v-tab>
          <v-tab>{{ $t('Dashboard.sharedWithMe') }}</v-tab>
          <v-tab>{{ $t('Dashboard.publicTests') }}</v-tab>

          <v-spacer />
        </v-tabs>
        <v-divider class="hidden-sm-and-down" />

        <!-- Desktop Templates Sub tabs -->
        <v-tabs
          v-if="mainIndex == 1"
          v-model="subIndex"
          background-color="transparent"
          color="black"
          class="hidden-sm-and-down"
        >
          <v-tab>{{ $t('Dashboard.personal') }}</v-tab>
          <v-tab>{{ $t('Dashboard.explore') }}</v-tab>

          <v-spacer />
        </v-tabs>
        <v-divider class="hidden-sm-and-down" />
      </v-col>
    </v-row>
    <!-- Mobile Bottom Navigation -->
    <v-bottom-navigation v-model="mainIndex" class="hidden-md-and-up" grow>
      <v-btn icon>
        <v-icon>mdi-home</v-icon>
        <span>{{ $t('Dashboard.myTests') }}</span>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account-group</v-icon>
        <span>{{ $t('Dashboard.sharedWithMe') }}</span>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-earth</v-icon>
        <span>{{ $t('Dashboard.publicTests') }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    mainIndex: 0,
    subIndex: 0,
    searching: false,
    buttonItems: [{ text: 'Tests', value: 0 }],
    testButtonItems: [
      { text: 'My Tests', value: 0 },
      { text: 'Shared With Me', value: 1 },
      { text: 'Public Tests', value: 2 },
    ],
    templateButtonItems: [
      { text: 'Personal', value: 0 },
      { text: 'Explore', value: 1 },
    ],
    exploreTemplates: [],
    disableNext: false,
    disablePrevious: true,
    tempDialog: false,
    temp: {},
  }),

  computed: {
    tests() {
      return this.$store.state.Tests.tests
    },

    loading() {
      return this.$store.getters.loading
    },
  },

  watch: {
    async mainIndex(val) {
      this.subIndex = 0
      if (val == 0) await this.getMyPersonalTests()
    },

    async subIndex(val) {
      if (this.mainIndex == 0) {
        // If it is on tab tests
        if (val == 0) await this.getMyPersonalTests()

        // If it is on tab templates
        if (val == 1) await this.getSharedWithMeTests()

        if (val == 2) await this.getPublicTests()
      }
    },
  },

  async created() {
    await this.getMyPersonalTests()
    await this.cleanTestStore()
  },

  methods: {
    async cleanTestStore() {
      await this.$store.dispatch('cleanTest')
    },
    async getMyPersonalTests() {
      await this.$store.dispatch('getTestsAdminByUser')
    },

    async getPublicTests() {
      await this.$store.dispatch('getPublicTests')
    },

    async getPublicTemplates() {
      await this.$store.dispatch('getPublicTemplates')
    },

    async getMyTemplates() {
      await this.$store.dispatch('getTemplatesOfUser')
    },

    async getSharedWithMeTests() {
      await this.$store.dispatch('getSharedWithMeTests', this.user.id)
    },

    goToCreateTestRoute() {
      this.$router.push('/createtest')
    },

    goTo(test) {
      // if it is from the my tests tab
      if (this.mainIndex === 0) {
        if (this.subIndex === 0) {
          this.$router.push({
            name: 'ManagerView',
            params: { id: test.testDocId },
          })
        }
        // if it is the shared with me tests
        else if (this.subIndex === 1) {
          if (test.accessLevel >= 2) {
            this.$router.push({
              name: 'TestView',
              params: { id: test.testDocId },
            })
          } else {
            this.$router.push({
              name: 'ManagerView',
              params: { id: test.testDocId },
            })
          }
        } else if (this.subIndex === 2) {
          this.$router.push({
            name: 'ManagerView',
            params: { id: test.id },
          })
        }
      }
    },

    setupTempDialog(temp) {
      this.temp = Object.assign({}, temp)
      this.tempDialog = true
    },
  },
}
</script>

<style scoped>
.titleText {
  font-size: 40px;
  font-weight: 300;
}
</style>
