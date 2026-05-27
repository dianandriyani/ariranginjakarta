<!-- <script setup lang="ts">
const ticketStore = useTicketStore();

const selectedTicket = computed(() => ticketStore.selectedTicket);

const selectedDate = computed(() => ticketStore.selectedDate);
</script>

<template>
  <UCard class="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
    <div class="p-6 md:p-8 space-y-6">
      <div class="space-y-2">
        <h3 class="text-2xl font-semibold text-white">ARIRANG IN JAKARTA</h3>

        <p class="text-slate-300">
          {{ selectedTicket?.name || "VIP" }}
        </p>

        <p class="text-sm text-slate-400">1 Ticket • Pax 1</p>
      </div>

      <UDivider class="border-white/10" />

      <div class="space-y-2">
        <p class="text-sm uppercase tracking-wider text-slate-400">Selected Date</p>

        <p class="text-lg font-medium text-white">
          {{
            selectedDate
              ? new Date(selectedDate).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "-"
          }}
        </p>
      </div>

      <UDivider class="border-white/10" />

      <div class="flex items-center justify-between">
        <span class="text-slate-300 text-base"> Total Payment </span>

        <span class="text-2xl font-bold text-white">
          IDR
          {{ selectedTicket?.price?.toLocaleString("id-ID") || "0" }}
        </span>
      </div>
    </div>
  </UCard>
</template> -->

<script setup lang="ts">
const ticketStore = useTicketStore();

const totalPrice = computed(() => {
  if (!ticketStore.selectedTicket) return 0;

  return ticketStore.selectedTicket.price * ticketStore.selectedQuantity;
});
</script>

<template>
  <UCard class="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
    <div class="p-6 space-y-6">
      <div class="space-y-2">
        <h3 class="text-2xl font-bold text-white">ARIRANG IN JAKARTA</h3>

        <p class="text-slate-300">
          {{ ticketStore.selectedTicket?.name || "-" }}
        </p>

        <p class="text-sm text-slate-400">
          {{ ticketStore.selectedQuantity }}
          Ticket • Pax
          {{ ticketStore.selectedQuantity }}
        </p>
      </div>

      <UDivider class="border-white/10" />

      <div class="flex items-center justify-between">
        <span class="text-slate-400"> Total Payment </span>

        <span class="text-xl font-bold text-white">
          IDR
          {{ totalPrice.toLocaleString("id-ID") }}
        </span>
      </div>
    </div>
  </UCard>
</template>
