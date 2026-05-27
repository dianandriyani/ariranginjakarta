<script setup lang="ts">
const route = useRoute();
const auth = useAuthStore();
const queue = useQueueStore();

const isDevBypass = computed(() => route.query.dev === "1");

onMounted(() => {
  if (isDevBypass.value) return;

  if (!auth.membershipCode) {
    navigateTo("/waiting-room");
  }
});

function backHome() {
  sessionStorage.removeItem("queue-access");

  sessionStorage.removeItem("ticket-session");

  queue.resetQueue();

  auth.fullName = "";
  auth.idCardNumber = "";
  auth.membershipCode = "";

  navigateTo("/");
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white flex items-center">
    <UContainer class="max-w-xl gap-10">
      <UCard class="rounded-3xl p-10 text-center bg-white/5 border border-white/10">
        <div class="space-y-6">
          <div class="text-6xl">🎉</div>

          <h1 class="text-4xl font-bold">Purchase Successful</h1>

          <p class="text-slate-400">Your ticket has been reserved successfully.</p>

          <div class="rounded-2xl bg-white/5 p-5 border border-white/10 text-left space-y-2">
            <div>
              <span class="text-slate-400">Name:</span>
              {{ auth.fullName }}
            </div>

            <div>
              <span class="text-slate-400">ID Card:</span>
              {{ auth.idCardNumber }}
            </div>

            <div>
              <span class="text-slate-400">Membership:</span>
              {{ auth.membershipCode }}
            </div>
          </div>

          <OrderSummary />

          <UButton block size="lg" @click="backHome"> Back Home </UButton>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
