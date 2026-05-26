<script setup lang="ts">
const route = useRoute();
const auth = useAuthStore();

const isDevBypass = computed(() => route.query.dev === "1");

const membershipCode = ref("");

const usePassengerData = ref(false);

const fullName = ref("");
const idCardNumber = ref("");

watch(
  usePassengerData,
  (checked) => {
    if (checked) {
      fullName.value = auth.fullName || "";

      idCardNumber.value = auth.idCardNumber || "";
    } else {
      fullName.value = "";
      idCardNumber.value = "";
    }
  },
  {
    immediate: true,
  },
);

function submit() {
  auth.saveMembership(membershipCode.value);

  navigateTo("/success");
}

onMounted(() => {
  if (isDevBypass.value) return;

  if (!auth.fullName || !auth.idCardNumber) {
    navigateTo("/waiting-room");
  }
});
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white flex items-center">
    <UContainer class="max-w-lg">
      <UCard class="rounded-3xl p-8 bg-white/5 border border-white/10">
        <div class="space-y-6">
          <h1 class="text-3xl font-bold">Membership Details</h1>

          <UInput v-model="membershipCode" placeholder="Membership Code" size="xl" />

          <UCheckbox v-model="usePassengerData" label="Same as passenger data" />

          <UInput v-model="fullName" placeholder="Full Name" :disabled="usePassengerData" size="xl" />

          <UInput v-model="idCardNumber" placeholder="ID Card Number" :disabled="usePassengerData" size="xl" />

          <UButton block size="xl" @click="submit"> Continue </UButton>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
