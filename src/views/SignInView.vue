<template>
  <div class="background-grey">
    <v-row justify="center" style="height: 90%" align="center">
      <v-col cols="12" md="8">
        <v-card color="#f5f7ff" rounded="xl" flat>
          <v-row>
            <v-col cols="10" md="5" align-self="center" class="ma-8">
              <div class="card-title">
                {{ $t('SIGNIN.sign-in') }}
              </div>

              <div class="divider" />

              <v-form class="mx-3" @keyup.enter="onSignIn()">
                <v-text-field
                  v-model="email"
                  :label="$t('SIGNIN.email')"
                  outlined
                  prepend-inner-icon="mdi-account-circle"
                  dense
                />

                <v-text-field
                  v-model="password"
                  :label="$t('SIGNIN.password')"
                  prepend-inner-icon="mdi-lock"
                  outlined
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  dense
                  @click:append="showPassword = !showPassword"
                />
              </v-form>

              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="text-center"
              >
                {{ error }}
              </v-alert>
              <v-card-actions class="justify-center mt-4">
                <v-btn
                  data-testid="sign-in-button"
                  color="#F9A826"
                  rounded
                  class="white--text"
                  :loading="loading"
                  @click="onSignIn()"
                >
                  {{ $t('SIGNIN.sign-in') }}
                </v-btn>
              </v-card-actions>
              <v-card-actions class="justify-center mt-1">
                <p>
                  <a
                    style="color: #f9a826; text-decoration: underline"
                    @click="redirectToSignup"
                    >{{ $t('SIGNIN.dont-have-account') }}</a
                  >
                </p>
              </v-card-actions>
            </v-col>

            <v-col cols="6" class="hidden-sm-and-down" align-self="center">
              <v-img src="@/assets/signIn.svg" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
export default {
  data: () => ({
    showPassword: false,
    email: '',
    password: '',
    loading: false,
    error: null,
  }),
  methods: {
    async onSignIn() {
      this.loading = true
      const auth = useAuthStore()
      try {
        await auth.signIn(this.email, this.password)
        if (auth.user) {
          this.$router.push('/dashboard')
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    redirectToSignup() {
      this.$router.push('/signup')
    },
  },
}
</script>

<style scoped>
.background-grey {
  background-color: #e8eaf2;
  height: 100vh;
  align-content: center;
}

.card-title {
  font-style: normal;
  font-weight: 300;
  font-size: 48px;
  line-height: 56px;
  margin-left: 12px;
  margin-bottom: 20px;
}

.divider {
  margin-bottom: 40px;
  margin-left: 8px;
  background: linear-gradient(
    90deg,
    #c4c4c4,
    rgba(196, 196, 196, 0)
  ) !important;
  height: 0.5px;
}
</style>
