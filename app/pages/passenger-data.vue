<script setup lang="ts">
const auth = useAuthStore();

const fullName = ref("");
const idCardNumber = ref("");

function submit() {
  if (!fullName.value.trim() || !idCardNumber.value.trim()) {
    return;
  }

  auth.savePassengerData(fullName.value.trim(), idCardNumber.value.trim());

  navigateTo("/waiting-room");
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white flex items-center">
    <UContainer class="max-w-lg">
      <UCard class="rounded-3xl p-8 bg-white/5 border border-white/10">
        <div class="space-y-5">
          <h1 class="text-3xl font-bold">Passenger Details</h1>

          <UInput v-model="fullName" placeholder="Full Name" size="xl" />

          <UInput v-model="idCardNumber" placeholder="ID Card Number" size="xl" />

          <UButton block size="xl" @click="submit"> Save & Continue </UButton>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
