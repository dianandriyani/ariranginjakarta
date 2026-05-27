<script setup lang="ts">
import { getJakartaDate, getJakartaHour } from "~/utils/time";

const route = useRoute();

const isDevBypass = computed(() => route.query.dev === "1");

const scheduleHours = [0, 3, 6, 9, 12, 15, 18, 21];

const countdown = ref(0);
const isOpen = ref(false);

function getSessionState() {
  const now = getJakartaDate();

  for (const hour of scheduleHours) {
    const saleTime = new Date(now);

    saleTime.setHours(hour, 0, 0, 0);

    // midnight fix
    if (hour === 0 && now.getHours() >= 23) {
      saleTime.setDate(saleTime.getDate() + 1);
    }

    const openTime = new Date(saleTime);

    openTime.setHours(saleTime.getHours() - 1);

    const saleEnd = new Date(saleTime);

    saleEnd.setMinutes(45);

    // waiting room
    if (now >= openTime && now < saleTime) {
      return {
        type: "waiting",
        saleTime,
      };
    }

    // sale live
    if (now >= saleTime && now < saleEnd) {
      return {
        type: "live",
        saleTime,
      };
    }
  }

  return null;
}

onMounted(() => {
  if (isDevBypass.value) {
    navigateTo("/queue?dev=1");
    return;
  }

  const session = getSessionState();

  if (!session) {
    isOpen.value = false;
    return;
  }

  // sale sedang berlangsung
  if (session.type === "live") {
    navigateTo("/queue");
    return;
  }

  isOpen.value = true;

  const timer = setInterval(() => {
    const now = getJakartaDate();

    countdown.value = Math.max(0, Math.floor((session.saleTime.getTime() - now.getTime()) / 1000));

    if (countdown.value <= 0) {
      clearInterval(timer);

      navigateTo("/queue");
    }
  }, 1000);
});

const formattedCountdown = computed(() => {
  const hrs = Math.floor(countdown.value / 3600);

  const mins = Math.floor((countdown.value % 3600) / 60);

  const secs = countdown.value % 60;

  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
});
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white flex items-center">
    <UContainer class="max-w-xl">
      <UCard class="rounded-3xl p-10 text-center bg-white/5 border border-white/10">
        <template v-if="isOpen">
          <div class="space-y-6">
            <UBadge size="lg"> WAITING ROOM OPEN </UBadge>

            <h1 class="text-4xl font-bold">Sale starts in</h1>

            <p class="text-6xl font-bold tracking-tight">
              {{ formattedCountdown }}
            </p>

            <p class="text-slate-400">You will be assigned a random queue number once sale begins.</p>
          </div>
        </template>

        <template v-else>
          <div class="space-y-6">
            <h2 class="text-3xl font-bold">Waiting Room Closed</h2>

            <p class="text-slate-400">Please come back 1 hour before the next session.</p>
          </div>
        </template>
      </UCard>
    </UContainer>
  </div>
</template>
