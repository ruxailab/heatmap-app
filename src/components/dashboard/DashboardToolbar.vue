<template>
  <v-app-bar app theme="dark" dense>
    <!-- Logo and title -->
    <v-avatar class="ml-4" size="40">
      <v-img src="@/assets/logo.svg" max-height="40" contain></v-img>
    </v-avatar>
    <v-toolbar-title class="text-h5 font-weight-bold">RUXAILAB</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-select
      class="pa-4 w-0"
      :items="languages"
      v-model="selectedLanguage"
      label="Select Language"
      prepend-inner-icon="mdi-earth"
      variant="solo"
      bg-color="white"
      dense
      hide-details
    ></v-select>

    <!-- User Icon and Menu -->
    <v-menu v-model="menu">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" class="pa-0 me-4">
          <v-icon size="x-large">mdi-account-circle</v-icon>
          <v-icon small>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list theme="light">
        <v-list-item>
          <v-list-item-title>Username</v-list-item-title>
          <span> {{ userName }}</span>
        </v-list-item>
        <v-divider class="border-opacity-100" color="gray"></v-divider>
        <v-list-item @click="logout">
          <v-list-item-title>Sign-out</v-list-item-title>
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
      canGoBack: false,
    }
  },
  watch: {
    $route() {
      this.checkCanGoBack()
    },
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
