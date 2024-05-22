<template>
  <v-app-bar app class="toolbar-menu">
    <v-btn icon @click="goBack">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-btn icon @click="goForward">
      <v-icon>mdi-arrow-right</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-text-field
      :value="url"
      @input="$emit('update:url', $event)"
      class="hidden-sm-and-down"
      flat
      solo
      hide-details
      readonly
      label="URL"
    ></v-text-field>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: '',
    },
  },
  methods: {
    goBack() {
      if (window.electronAPI) window.electronAPI.send('backAction')
      else console.log('electronAPI not defined in toolbar')
    },
    goForward() {
      if (window.electronAPI) window.electronAPI.send('forwardAction')
      else console.log('electronAPI not defined in toolbar')
    },
  },
}
</script>
