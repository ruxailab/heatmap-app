<template>
  <div class="background-grey">
    <v-row justify="center" style="height: 90%" align="center">
      <v-col cols="12" md="8">
        <v-card color="#f5f7ff" rounded="xl" flat>
          <v-row>
            <v-col cols="10" md="5" align-self="center" class="ma-8">
              <div class="card-title">
                {{ $t('SIGNIN.sign-up') }}
              </div>

              <div class="divider" />

              <v-form v-model="valid" class="mx-3" @keyup.enter="onSignUp()">
                <v-text-field
                  v-model="email"
                  dense
                  outlined
                  :label="$t('SIGNIN.email')"
                  :rules="emailRules"
                  prepend-inner-icon="mdi-account-circle"
                />

                <v-text-field
                  v-model="password"
                  dense
                  outlined
                  :label="$t('SIGNIN.password')"
                  prepend-inner-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="passwordRules"
                  @click:append="showPassword = !showPassword"
                />

                <v-text-field
                  v-model="confirmpassword"
                  dense
                  outlined
                  :label="$t('SIGNIN.confirmPassword')"
                  prepend-inner-icon="mdi-lock"
                  :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :rules="[comparePassword]"
                  @click:append="showConfirmPassword = !showConfirmPassword"
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
                  color="#F9A826"
                  rounded
                  class="white--text"
                  :loading="loading"
                  @click="onSignUp()"
                >
                  {{ $t('SIGNIN.sign-up') }}
                </v-btn>
              </v-card-actions>
              <v-card-actions class="justify-center mt-1">
                <p>
                  <a
                    style="color: #f9a826; text-decoration: underline"
                    @click="redirectToSignin"
                    >{{ $t('SIGNIN.alreadyHaveAnAccount') }}</a
                  >
                </p>
              </v-card-actions>
            </v-col>

            <v-col cols="6" class="hidden-sm-and-down" align-self="center">
              <v-img src="@/assets/signUp.svg" />
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
    email: '',
    password: '',

    valid: true,

    confirmpassword: '',
    showPassword: false,
    showConfirmPassword: false,

    loading: false,
    error: null,
  }),
  computed: {
    emailRules() {
      return [
        (v) => !!v || this.$i18n.t('errors.emailIsRequired'),
        (v) => /.+@.+\..+/.test(v) || this.$i18n.t('errors.invalidEmail'),
      ]
    },
    passwordRules() {
      return [
        (v) => !!v || this.$i18n.t('errors.passwordRequired'),
        (v) => v.length >= 6 || this.$i18n.t('errors.passwordValidate'),
      ]
    },
    comparePassword() {
      return () =>
        (this.confirmpassword == this.password &&
          this.confirmpassword !== '') ||
        this.$i18n.t('errors.differentPasswords')
    },
  },
  methods: {
    async onSignUp() {
      this.loading = true
      const auth = useAuthStore()
      try {
        await auth.signUp(this.email, this.password)
        if (auth.user) this.$router.push('/dashboard')
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    redirectToSignin() {
      this.$router.push('/signin')
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
