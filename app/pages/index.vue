<script setup lang="ts">
import { getJakartaDate, getJakartaHour } from "~/utils/time";

const auth = useAuthStore();

const scheduleSlots = [
  {
    hour: 0,
    label: "12:00 AM WIB",
  },
  {
    hour: 3,
    label: "3:00 AM WIB",
  },
  {
    hour: 6,
    label: "6:00 AM WIB",
  },
  {
    hour: 9,
    label: "9:00 AM WIB",
  },
  {
    hour: 12,
    label: "12:00 PM WIB",
  },
  {
    hour: 15,
    label: "3:00 PM WIB",
  },
  {
    hour: 18,
    label: "6:00 PM WIB",
  },
  {
    hour: 21,
    label: "9:00 PM WIB",
  },
];

function isWaitingRoomOpen() {
  const now = getJakartaDate();

  const currentHour = now.getHours();

  return scheduleSlots.some((slot) => {
    const openHour = slot.hour - 1;

    return currentHour >= openHour && currentHour < slot.hour;
  });
}

const waitingRoomOpen = computed(() => isWaitingRoomOpen());

function handleJoin() {
  if (!auth.isLoggedIn) {
    navigateTo("/login");
    return;
  }

  navigateTo("/waiting-room");
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
    <UContainer class="max-w-5xl py-24 md:py-32">
      <div class="flex flex-col items-center text-center space-y-10">
        <!-- Hero -->
        <div class="space-y-5">
          <UBadge size="lg" variant="soft"> ARIRANG LIVE IN JAKARTA TICKET SELECTION </UBadge>

          <h1 class="text-5xl md:text-7xl font-bold tracking-tight">Queue Simulator</h1>

          <p class="max-w-2xl mx-auto text-slate-400 text-lg">Join the waiting room before ticket sale begins. Queue numbers are assigned automatically once the session opens.</p>
        </div>

        <!-- Status -->
        <div class="rounded-2xl px-5 py-3 border" :class="waitingRoomOpen ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-white/5 border-white/10 text-slate-300'">
          {{ waitingRoomOpen ? "🟢 Waiting Room Open" : "⚪ Waiting Room Closed" }}
        </div>

        <!-- Schedule -->
        <UCard class="w-full max-w-3xl rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div class="p-8 space-y-6">
            <div class="space-y-2">
              <h2 class="text-2xl font-semibold">Simulation Schedule</h2>

              <p class="text-sm text-slate-400 leading-relaxed">
                Waiting room opens 1 hour before each session. Each sale session remains open for
                <span class="text-white font-medium"> 30 minutes </span>. All times are shown in WIB (UTC+7).
              </p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="slot in scheduleSlots" :key="slot.hour" class="rounded-2xl bg-white/5 border border-white/10 p-5 text-center font-medium">
                {{ slot.label }}
              </div>
            </div>
          </div>
        </UCard>

        <!-- CTA -->
        <UButton size="xl" @click="handleJoin">
          {{ auth.isLoggedIn ? "Enter Waiting Room" : "Login to Join" }}
        </UButton>
      </div>
    </UContainer>
  </div>
</template>
