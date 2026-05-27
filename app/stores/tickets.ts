import { defineStore } from "pinia";

export const useTicketStore = defineStore("tickets", () => {
  const sections = ref([
    {
      name: "VIP PACKAGE",
      price: 4500000,
      stock: 350,
      benefits: ["Soundcheck Access", "Priority Entry"],
    },
    {
      name: "PLATINUM",
      price: 3800000,
      stock: 1400,
      benefits: [],
    },
    {
      name: "CAT 1",
      price: 2800000,
      stock: 6500,
      benefits: [],
    },
    {
      name: "CAT 2",
      price: 2300000,
      stock: 12000,
      benefits: [],
    },
    {
      name: "CAT 3",
      price: 1800000,
      stock: 20000,
      benefits: [],
    },
  ]);

  const selectedTicket = ref<any>(null);
  const selectedQuantity = ref(1);

  let interval: ReturnType<typeof setInterval> | null = null;

  function selectTicket(section: any, qty = 1) {
    selectedTicket.value = section;
    selectedQuantity.value = qty;
  }

  function startStockSimulation() {
    if (interval) return;

    interval = setInterval(() => {
      sections.value.forEach((section) => {
        if (section.stock <= 0) return;

        const decrease = Math.floor(Math.random() * 8) + 1;

        section.stock = Math.max(0, section.stock - decrease);
      });
    }, 2500);
  }

  return {
    sections,
    selectedTicket,
    selectedQuantity,
    selectTicket,
    startStockSimulation,
  };
});
