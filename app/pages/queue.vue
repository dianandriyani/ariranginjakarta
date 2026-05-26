<script setup lang="ts">
const route = useRoute();
const queue = useQueueStore();

const isDevBypass = computed(() => route.query.dev === "1");

let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  // generate sekali aja
  if (!queue.queueNumber) {
    queue.joinQueue();
  }

  timer = setInterval(() => {
    if (queue.position === null || queue.position <= 0) {
      if (timer) {
        clearInterval(timer);
      }

      sessionStorage.setItem("queue-access", "granted");

      navigateTo(isDevBypass.value ? "/tickets?dev=1" : "/tickets");

      return;
    }

    const move = Math.floor(Math.random() * 250) + 80;

    queue.position = Math.max(0, queue.position - move);

    queue.estimatedWait = Math.ceil(queue.position / 500);
  }, 1500);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

const progress = computed(() => {
  if (!queue.queueNumber || queue.position === null) {
    return 0;
  }

  return Math.round(((queue.queueNumber - queue.position) / queue.queueNumber) * 100);
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
    <UContainer class="max-w-3xl py-16 md:py-24">
      <div class="space-y-8">
        <!-- header -->
        <div class="text-center space-y-4">
          <UBadge color="neutral" variant="soft" size="lg"> LIVE IN CONCERT </UBadge>

          <div class="space-y-2">
            <h1 class="text-3xl md:text-5xl font-bold tracking-tight">You're in the Queue</h1>

            <p class="text-slate-400 text-sm md:text-base max-w-lg mx-auto">High demand is expected. Please keep this page open while we reserve your access to ticket selection.</p>
          </div>
        </div>

        <!-- queue card -->
        <UCard class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <div class="p-8 md:p-10 space-y-8">
            <!-- queue number -->
            <div class="text-center space-y-3">
              <p class="text-sm uppercase tracking-widest text-slate-400">Your Queue Number</p>

              <div class="text-5xl md:text-7xl font-bold tracking-tight">#{{ queue.queueNumber }}</div>
            </div>

            <!-- progress -->
            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm text-slate-400">
                <span>Queue Progress</span>
                <span> {{ progress }}% </span>
              </div>

              <UProgress :model-value="progress" size="xl" />
            </div>

            <!-- stats -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="rounded-2xl bg-white/5 border border-white/10 p-6">
                <p class="text-sm text-slate-400 mb-2">Current Position</p>

                <p class="text-3xl font-semibold">
                  {{ queue.position }}
                </p>
              </div>

              <div class="rounded-2xl bg-white/5 border border-white/10 p-6">
                <p class="text-sm text-slate-400 mb-2">Estimated Wait</p>

                <p class="text-3xl font-semibold">
                  {{ queue.estimatedWait }}
                  min
                </p>
              </div>
            </div>

            <!-- footer info -->
            <div class="rounded-2xl bg-blue-500/10 border border-blue-400/20 p-5">
              <p class="text-sm text-slate-300 leading-relaxed text-center">Please do not refresh your browser. Refreshing may affect your access to this queue session.</p>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
