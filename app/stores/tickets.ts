import { defineStore } from "pinia";

export const useTicketStore = defineStore("tickets", () => {
  const sections = ref([
    {
      name: "VIP PACKAGE",
      price: 4500000,
      stock: 350,
      benefits: ["Soundcheck Access", "Priority Entry", "VIP Lanyard"],
    },
    {
      name: "PLATINUM",
      price: 3800000,
      stock: 1400,
      benefits: ["Floor / Tribune Access"],
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

  let interval: ReturnType<typeof setInterval> | null = null;

  function startStockSimulation() {
    if (interval) return;

    interval = setInterval(() => {
      sections.value.forEach((section) => {
        if (section.stock <= 0) return;

        let decrease = 0;

        if (section.name === "VIP PACKAGE") {
          decrease = Math.floor(Math.random() * 6) + 2;
        } else if (section.name === "PLATINUM") {
          decrease = Math.floor(Math.random() * 12) + 4;
        } else {
          decrease = Math.floor(Math.random() * 18) + 6;
        }

        section.stock = Math.max(0, section.stock - decrease);
      });
    }, 2500);
  }

  return {
    sections,
    startStockSimulation,
  };
});
