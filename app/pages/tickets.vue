<script setup lang="ts">
import { isSaleLive } from "~/utils/sale-session";

const route = useRoute();
const ticketStore = useTicketStore();
const queue = useQueueStore();

const isDevBypass = computed(() => route.query.dev === "1");

const viewers = ref(Math.floor(Math.random() * 2500) + 1000);

const loadingSection = ref<string | null>(null);

const soldOutModal = ref(false);

onMounted(() => {
  if (isDevBypass.value) {
    startSimulation();
    return;
  }

  if (!isSaleLive()) {
    navigateTo("/waiting-room");
    return;
  }

  const hasAccess = sessionStorage.getItem("queue-access");

  if (hasAccess !== "granted") {
    navigateTo("/waiting-room");
    return;
  }

  startSimulation();
});

function startSimulation() {
  ticketStore.startStockSimulation();

  setInterval(() => {
    viewers.value = Math.floor(Math.random() * 2500) + 1000;
  }, 4000);
}

function getBadge(section: any) {
  if (!section) {
    return {
      label: "",
      color: "neutral",
    };
  }

  if (section.stock <= 0) {
    return {
      label: "Sold Out",
      color: "error",
    };
  }

  if (section.stock <= 20) {
    return {
      label: `Only ${section.stock} left`,
      color: "error",
    };
  }

  if (section.stock <= 100) {
    return {
      label: "Selling Fast",
      color: "warning",
    };
  }

  return {
    label: `${section.stock} available`,
    color: "success",
  };
}

async function selectTicket(section: any) {
  if (!section) return;
  if (section.stock <= 0) return;

  loadingSection.value = section.name;

  await new Promise((resolve) => setTimeout(resolve, 1800));

  const failedChance = isDevBypass.value ? false : Math.random() < 0.35;

  loadingSection.value = null;

  if (failedChance) {
    soldOutModal.value = true;

    section.stock = Math.max(0, section.stock - 1);

    return;
  }

  navigateTo(isDevBypass.value ? "/membership?dev=1" : "/membership");
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
    <UContainer class="max-w-6xl py-16 md:py-20">
      <div class="space-y-10">
        <!-- header -->
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div class="space-y-3">
            <UBadge size="lg" variant="soft"> TICKET SELECTION </UBadge>

            <div>
              <h1 class="text-4xl md:text-5xl font-bold">Select Your Ticket</h1>

              <p class="text-slate-400 mt-2">Choose your preferred section before tickets sell out.</p>
            </div>

            <div class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4 text-center">
              <p class="text-sm font-medium text-emerald-300">SALE IN PROGRESS</p>

              <p class="text-xs text-slate-300 mt-1">This ticket sale session remains open for 30 minutes from the scheduled start time.</p>
            </div>
          </div>

          <div class="rounded-2xl bg-red-500/10 border border-red-500/20 px-5 py-3 text-sm text-red-300">
            🔥
            {{ viewers.toLocaleString("id-ID") }}
            people are viewing this event
          </div>
        </div>

        <!-- grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <UCard v-for="section in ticketStore.sections" :key="section.name" class="rounded-3xl bg-white/5 border border-white/10">
            <div class="p-6 space-y-6">
              <div class="space-y-3">
                <h2 class="text-2xl font-bold">
                  {{ section.name }}
                </h2>

                <p class="text-3xl font-semibold">
                  Rp
                  {{ Number(section.price).toLocaleString("id-ID") }}
                </p>

                <UBadge :color="getBadge(section).color" variant="soft">
                  {{ getBadge(section).label }}
                </UBadge>
              </div>

              <UButton block size="lg" :loading="loadingSection === section.name" :disabled="section.stock <= 0" @click="selectTicket(section)">
                {{ section.stock <= 0 ? "Sold Out" : loadingSection === section.name ? "Checking availability..." : "Select Ticket" }}
              </UButton>
            </div>
          </UCard>
        </div>

        <!-- modal -->
        <UModal v-model:open="soldOutModal">
          <template #content>
            <div class="p-6 space-y-4">
              <h3 class="text-xl font-bold">Category Full Booked</h3>

              <p class="text-sm text-slate-400">Another user completed checkout before you. Please select another section.</p>

              <UButton block @click="soldOutModal = false"> Back to Ticket Selection </UButton>
            </div>
          </template>
        </UModal>
      </div>
    </UContainer>
  </div>
</template>
