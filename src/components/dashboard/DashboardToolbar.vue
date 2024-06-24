<template>
  <v-app-bar app dark dense>
    <v-avatar class="ml-4" size="40">
      <v-img src="@/assets/logo.svg" max-height="40" contain></v-img>
    </v-avatar>
    <v-toolbar-title class="text-h5 font-weight-bold">RUXAILAB</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-select class="pa-4 w-0" :items="languages" v-model="selectedLanguage" label="Select Language"
      prepend-inner-icon="mdi-earth" variant="solo" bg-color="white" dense hide-details></v-select>

    <!-- User Icon and Menu -->
    <v-menu v-model="menu">
      <template v-slot:activator="{ props }">
        <v-card v-bind="props" class="pa-4 me-4" elevation="0">
          <v-icon class="mr-2">mdi-account-circle</v-icon>
          <span>{{ userName }}</span>
        </v-card>
      </template>
      <v-list>
        <v-list-item @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
export default {
  data() {
    return {
      menu: false,
      selectedLanguage: this.$i18n.locale,
      languages: this.$i18n.availableLocales,
      userName: '',
    }
  },
  created() {
    this.getUserName()
  },
  methods: {
    toggleMenu() {
      this.menu = !this.menu
    },
    logout() {
      useAuthStore().logout()
    },
    getUserName() {
      const user = useAuthStore().user
      if (user) {
        this.userName = user.displayName || user.email
      }
    },
  },
}
</script>

<style scoped></style>
