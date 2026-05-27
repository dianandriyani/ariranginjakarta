import { defineStore } from "pinia";

export type QueueStatus = "idle" | "waiting" | "ready";

export const useQueueStore = defineStore("queue", () => {
  const status = ref<QueueStatus>("idle");

  const queueNumber = ref<number | null>(null);

  const position = ref<number | null>(null);

  const estimatedWait = ref(0);

  const hasQueueAccess = ref(false);

  function joinQueue() {
    if (queueNumber.value) return;

    hasQueueAccess.value = false;

    const generated = Math.floor(Math.random() * 78000) + 1;

    queueNumber.value = generated;
    position.value = generated;

    estimatedWait.value = Math.ceil(generated / 500);

    status.value = "waiting";
  }

  function moveQueue() {
    if (!position.value) return;

    const crowdPressure = Math.random();

    let decrease = 0;

    // 25% kemungkinan stuck total
    if (crowdPressure < 0.25) {
      decrease = 0;
    }

    // normal bergerak pelan
    else if (crowdPressure < 0.75) {
      decrease = Math.floor(Math.random() * 35) + 8;
    }

    // burst masuk banyak
    else {
      decrease = Math.floor(Math.random() * 180) + 80;
    }

    position.value = Math.max(0, position.value - decrease);

    // ETA sengaja agak lebay / chaotic
    estimatedWait.value = Math.max(1, Math.ceil(position.value / 120));

    if (position.value <= 0) {
      status.value = "ready";
      hasQueueAccess.value = true;
    }
  }

  function resetQueue() {
    status.value = "idle";
    queueNumber.value = null;
    position.value = null;
    estimatedWait.value = 0;
  }

  return {
    status,
    queueNumber,
    position,
    estimatedWait,
    hasQueueAccess,
    joinQueue,
    moveQueue,
    resetQueue,
  };
});
