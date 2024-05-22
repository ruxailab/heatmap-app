<template>
  <v-app-bar app class="toolbar-menu">
    <v-btn icon>
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-btn icon>
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
}
</script>
