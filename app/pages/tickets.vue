<script setup lang="ts">
const route = useRoute();
const ticketStore = useTicketStore();

const viewers = ref(Math.floor(Math.random() * 2500) + 1000);

const expandedSection = ref<string | null>(null);

const loadingSection = ref<string | null>(null);

const quantities = reactive<Record<string, number>>({});

onMounted(() => {
  ticketStore.startStockSimulation();

  setInterval(() => {
    viewers.value = Math.floor(Math.random() * 2500) + 1000;
  }, 4000);
});

function toggleSelect(section: any) {
  if (expandedSection.value === section.name) {
    expandedSection.value = null;
    return;
  }

  expandedSection.value = section.name;

  if (!quantities[section.name]) {
    quantities[section.name] = 1;
  }
}

function increaseQty(sectionName: string) {
  if (quantities[sectionName] < 4) {
    quantities[sectionName]++;
  }
}

function decreaseQty(sectionName: string) {
  if (quantities[sectionName] > 1) {
    quantities[sectionName]--;
  }
}

// async function confirmSelection(section: any) {
//   loadingSection.value = section.name;

//   await new Promise((resolve) => setTimeout(resolve, 1200));

//   ticketStore.selectTicket(section, quantities[section.name]);

//   navigateTo(route.query.dev === "1" ? "/membership?dev=1" : "/membership");
// }
const soldOutModal = ref(false);

const modalTitle = ref("");

const modalDescription = ref("");

async function confirmSelection(section: any) {
  const qty = quantities[section.name] || 1;

  loadingSection.value = section.name;

  await new Promise((resolve) => setTimeout(resolve, 1200));

  // stock insufficient
  if (section.stock < qty) {
    loadingSection.value = null;

    modalTitle.value = "Not Enough Tickets";

    modalDescription.value = `Only ${section.stock} ticket(s) remaining in ${section.name}.`;

    soldOutModal.value = true;

    return;
  }

  // simulate war / someone faster checkout
  const failedChance = Math.random() < 0.25;

  if (failedChance) {
    loadingSection.value = null;

    section.stock = Math.max(0, section.stock - qty);

    modalTitle.value = "Category Full Booked";

    modalDescription.value = "Another user completed checkout before you. Please select another section.";

    soldOutModal.value = true;

    return;
  }

  // success reserve stock
  section.stock -= qty;

  ticketStore.selectTicket(section, qty);

  loadingSection.value = null;

  navigateTo(route.query.dev === "1" ? "/membership?dev=1" : "/membership");
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
    <UContainer class="max-w-6xl py-16 md:py-20">
      <div class="space-y-10">
        <!-- header -->
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div class="space-y-3">
            <UBadge size="lg" variant="soft"> ARIRANG LIVE IN JAKARTA TICKET SELECTION </UBadge>

            <div>
              <h1 class="text-4xl md:text-5xl font-bold">Select Your Ticket</h1>

              <p class="text-slate-400 mt-2">Choose your preferred section before tickets sell out.</p>
            </div>

            <div class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4">
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

        <!-- ticket grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <UCard v-for="section in ticketStore.sections" :key="section.name" class="rounded-3xl bg-white/5 border border-white/10">
            <div class="p-6 space-y-6">
              <div class="space-y-3">
                <h2 class="text-2xl font-bold">
                  {{ section.name }}
                </h2>

                <p class="text-3xl font-semibold">
                  Rp
                  {{ section.price.toLocaleString("id-ID") }}
                </p>

                <p class="text-sm text-slate-400">
                  {{ section.stock }}
                  available
                </p>
              </div>

              <UButton v-if="expandedSection !== section.name" block size="lg" @click="toggleSelect(section)"> Select Ticket </UButton>

              <Transition enter-active-class="transition-all duration-300" leave-active-class="transition-all duration-200">
                <div v-if="expandedSection === section.name" class="pt-5 border-t border-white/10 space-y-5">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-slate-300"> Quantity </span>

                    <div class="flex items-center gap-3">
                      <UButton icon="i-lucide-minus" variant="soft" color="neutral" @click="decreaseQty(section.name)" />

                      <span class="w-8 text-center font-semibold">
                        {{ quantities[section.name] }}
                      </span>

                      <UButton icon="i-lucide-plus" variant="soft" color="neutral" @click="increaseQty(section.name)" />
                    </div>
                  </div>

                  <UButton block size="lg" color="primary" :loading="loadingSection === section.name" @click="confirmSelection(section)"> Book Now </UButton>
                </div>
              </Transition>
            </div>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
  <UModal v-model:open="soldOutModal">
    <template #content>
      <div class="p-6 space-y-4">
        <h3 class="text-xl font-bold">
          {{ modalTitle }}
        </h3>

        <p class="text-sm text-slate-400">
          {{ modalDescription }}
        </p>

        <UButton block @click="soldOutModal = false"> Back to Ticket Selection </UButton>
      </div>
    </template>
  </UModal>
</template>
