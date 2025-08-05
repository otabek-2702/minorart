<script lang="ts" setup>
import { useGenerateImageVariant } from "@/@core/composable/useGenerateImageVariant";
// import type { Actions, Subjects } from "@/plugins/casl/AppAbility";
// import { useAppAbility } from "@/plugins/casl/useAppAbility";
// eslint-disable-next-line import/no-duplicates
import axios from "@axios";
import boyWithRocketDark from "@images/illustrations/boy-with-rocket-dark.png";
import boyWithRocketLight from "@images/illustrations/boy-with-rocket-light.png";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const boyWithRocket = useGenerateImageVariant(
  boyWithRocketLight,
  boyWithRocketDark
);
const isPasswordVisible = ref(false);
const route = useRoute();
const router = useRouter();
// const ability = useAppAbility();

const refForm = ref();
const isLoading = ref(false);
const username = ref();
const password = ref();

const BASE_URL = import.meta.env.VITE_BASE_URL


const login = async () => {
  try {
    isLoading.value = true;


    const response = await fetch(`${BASE_URL}/api/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    const {token}: {
      token: string;
      token_type: number;
    } = await response.json();

    // // Abilities
    // let userAbilities = user.permissions_all?.map((item) => {
    //   const [action, subject] = item.split("-");
    //   return {
    //     action: action as Actions,
    //     subject: subject as Subjects,
    //   };
    // });
    // localStorage.setItem("userAbilities", JSON.stringify(userAbilities));
    // ability.update(userAbilities);

    // const datas = {
    //   name: user.name,
    //   roles: user.roles,
    //   branches: user.branches,
    // };
    // localStorage.setItem("userData", JSON.stringify(datas));
    // localStorage.setItem("expires_at", expires_at);

    localStorage.setItem("accessToken", token);

    // Redirect to `to` query if exist or redirect to index route
    router.replace(route.query.to ? String(route.query.to) : "/");
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = async () => {
  const { valid } = await refForm.value?.validate();
  if (valid) login();
};
</script>
<template>
  <VRow no-gutters class="auth-wrapper">
    <VCol lg="8" class="d-none d-lg-flex">
      <!-- иллюстрация -->
      <div class="position-relative w-100 pa-8">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg max-width="700" :src="boyWithRocket" class="auth-illustration" />
        </div>
      </div>
    </VCol>

    <VCol cols="12" lg="4" class="auth-card-v2 d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface))">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-6">
        <VCardItem class="justify-start">
          <template #prepend>
            <div class="d-flex">
              <VNodeRenderer :nodes="themeConfig.app.logo" />
            </div>
          </template>

          <VCardTitle class="auth-title">
            {{ themeConfig.app.title }}
          </VCardTitle>
        </VCardItem>

        <VCardText style="width: 400px">
          <!-- <VSnackbar
            v-model="error"
            location="top right"
            variant="flat"
            transition="fade-transition"
            color="error"
          >
            Логин или пароль не совпадают
          </VSnackbar> -->

          <VForm ref="refForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- логин -->
              <VCol cols="12">
                <VTextField v-model="username" label="Foydalanuvchi nomi" type="text" autofocus />
              </VCol>

              <!-- пароль -->
              <VCol cols="12">
                <VTextField v-model="password" label="Parol" :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                <VBtn block :loading="isLoading" :disabled="isLoading" type="submit" class="mb-1 mt-3">
                  Войти
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
name: Login
meta:
  layout: blank
  action: read
  subject: Auth
</route>
