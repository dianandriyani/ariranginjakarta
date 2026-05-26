<script setup lang="ts">
const auth = useAuthStore();

const email = ref("");
const error = ref("");

const isValidEmail = computed(() => {
  const value = email.value.trim();

  // cukup validasi format email umum
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
});

function submit() {
  error.value = "";

  if (!email.value.trim()) {
    error.value = "Email is required";
    return;
  }

  if (!isValidEmail.value) {
    error.value = "Please enter a valid email address";
    return;
  }

  auth.login(email.value.trim());

  navigateTo("/passenger-data");
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white flex items-center">
    <UContainer class="max-w-md w-full">
      <UCard class="rounded-3xl p-8 md:p-10 bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
        <div class="space-y-6">
          <div class="text-center space-y-2">
            <UBadge size="lg" variant="soft"> SIGN IN </UBadge>

            <h1 class="text-3xl font-bold tracking-tight">Enter your email</h1>

            <p class="text-slate-400 text-sm">Use your email address to enter the waiting room.</p>
          </div>

          <div class="space-y-2 w-full">
            <UInput v-model="email" size="xl" type="email" autocomplete="email" placeholder="your@email.com" icon="i-lucide-mail" class="w-full" @keydown.enter="submit" />

            <p v-if="error" class="text-sm text-red-400">
              {{ error }}
            </p>
          </div>

          <UButton block size="xl" :disabled="!isValidEmail" @click="submit"> Continue </UButton>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
