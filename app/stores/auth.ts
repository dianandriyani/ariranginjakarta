import { defineStore } from "pinia";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const email = ref("");
    const isLoggedIn = ref(false);

    const fullName = ref("");
    const idCardNumber = ref("");

    const membershipCode = ref("");

    function login(userEmail: string) {
      email.value = userEmail;
      isLoggedIn.value = true;
    }

    function savePassengerData(name: string, idCard: string) {
      fullName.value = name;
      idCardNumber.value = idCard;
    }

    function saveMembership(code: string) {
      membershipCode.value = code;
    }

    return {
      email,
      isLoggedIn,
      fullName,
      idCardNumber,
      membershipCode,
      login,
      savePassengerData,
      saveMembership,
    };
  },
  {
    persist: true,
  },
);
