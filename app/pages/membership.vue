<script setup lang="ts">
const route = useRoute();
const auth = useAuthStore();

const membershipCode = ref(auth.membershipCode || "");
const sameAsBooker = ref(false);

const titleOptions = [
  { label: "Mr", value: "Mr" },
  { label: "Mrs", value: "Mrs" },
  { label: "Ms", value: "Ms" },
];

const savedBooker = process.client ? JSON.parse(localStorage.getItem("booker-data") || "{}") : {};

const booker = reactive({
  title: savedBooker.title || "Ms",

  fullName: savedBooker.fullName || auth.fullName || "",

  phone: savedBooker.phone || "",

  email: savedBooker.email || auth.email || "",

  country: savedBooker.country || "Indonesia",

  idCardNumber: savedBooker.idCardNumber || auth.idCardNumber || "",
});

const visitor = reactive({
  title: "Ms",
  fullName: "",
  phone: "",
  email: "",
  country: "Indonesia",
  idCardNumber: "",
});

watch(
  sameAsBooker,
  (checked) => {
    if (checked) {
      Object.assign(visitor, {
        ...booker,
      });
    } else {
      Object.assign(visitor, {
        title: "Ms",
        fullName: "",
        phone: "",
        email: "",
        country: "Indonesia",
        idCardNumber: "",
      });
    }
  },
  {
    immediate: true,
  },
);

watch(
  booker,
  () => {
    if (!sameAsBooker.value) return;

    Object.assign(visitor, {
      ...booker,
    });
  },
  { deep: true },
);

const isFormValid = computed(() => {
  if (sameAsBooker.value) return true;

  return [visitor.fullName, visitor.phone, visitor.email, visitor.country, visitor.idCardNumber].every((value) => String(value || "").trim().length > 0);
});

function submit() {
  auth.saveMembership(membershipCode.value);

  auth.savePassengerData(booker.fullName, booker.idCardNumber);

  localStorage.setItem("booker-data", JSON.stringify(booker));

  localStorage.setItem("visitor-data", JSON.stringify(visitor));

  navigateTo(route.query.dev === "1" ? "/success?dev=1" : "/success");
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white py-8 md:py-12">
    <UContainer class="max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        <!-- LEFT -->
        <div class="lg:col-span-2 space-y-6 md:space-y-8 order-2 lg:order-1">
          <div class="space-y-2">
            <h2 class="text-2xl md:text-3xl font-semibold text-white">Booking Details</h2>

            <p class="text-sm md:text-base leading-relaxed text-slate-400">Please fill out this form carefully</p>
          </div>

          <!-- Membership -->
          <UCard class="rounded-3xl bg-white/5 border border-white/10">
            <div class="p-6 md:p-8">
              <UInput v-model="membershipCode" size="xl" placeholder="Membership Code" class="w-full" />
            </div>
          </UCard>

          <!-- Booker -->
          <UCard class="rounded-3xl bg-white/5 border border-white/10">
            <div class="p-6 md:p-8 space-y-6">
              <h2 class="text-2xl font-semibold">Booking Contact</h2>

              <URadioGroup
                v-model="booker.title"
                :items="titleOptions"
                orientation="horizontal"
                :ui="{
                  fieldset: 'flex gap-6',
                  label: 'text-white font-medium',
                }"
              />
              <div class="space-y-4">
                <UInput v-model="booker.fullName" size="xl" placeholder="Full Name" class="w-full" />

                <UInput v-model="booker.phone" size="xl" placeholder="Phone Number" class="w-full" />

                <UInput v-model="booker.email" size="xl" placeholder="Email Address" class="w-full" />

                <USelect v-model="booker.country" size="xl" :items="['Indonesia']" class="w-full" />

                <UInput v-model="booker.idCardNumber" size="xl" placeholder="ID Card Number" class="w-full" />
              </div>
            </div>
          </UCard>

          <!-- Visitor -->
          <div class="space-y-2">
            <h2 class="text-2xl md:text-3xl font-semibold text-white">Visitor Details</h2>

            <p class="text-sm md:text-base leading-relaxed text-slate-400">Please make sure all visitor information is entered correctly to ensure a smooth check-in and event experience.</p>
          </div>
          <UCard class="rounded-3xl bg-white/5 border border-white/10">
            <div class="p-6 md:p-8 space-y-6">
              <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 class="text-2xl font-semibold">Visitor Details</h2>

                <div class="flex items-center gap-3">
                  <USwitch v-model="sameAsBooker" />

                  <span class="text-sm text-slate-300"> Same as booking contact </span>
                </div>
              </div>

              <URadioGroup
                v-model="booker.title"
                :items="titleOptions"
                orientation="horizontal"
                :ui="{
                  fieldset: 'flex gap-6',
                  label: 'text-white font-medium',
                }"
              />
              <div class="space-y-4">
                <UInput v-model="visitor.fullName" size="xl" placeholder="Full Name" class="w-full" :disabled="sameAsBooker" />

                <UInput v-model="visitor.phone" size="xl" placeholder="Phone Number" class="w-full" :disabled="sameAsBooker" />

                <UInput v-model="visitor.email" size="xl" placeholder="Email Address" class="w-full" :disabled="sameAsBooker" />

                <USelect v-model="visitor.country" size="xl" :items="['Indonesia']" class="w-full" :disabled="sameAsBooker" />

                <UInput v-model="visitor.idCardNumber" size="xl" placeholder="ID Card Number" class="w-full" :disabled="sameAsBooker" />
              </div>
            </div>
          </UCard>

          <p v-if="!isFormValid" class="text-sm text-red-400 text-center">Please complete all visitor details before continuing.</p>
          <UButton :disabled="!isFormValid" block size="xl" class="h-14 rounded-2xl" @click="submit"> Continue </UButton>
        </div>

        <!-- RIGHT -->
        <div class="order-1 lg:order-2 lg:sticky lg:top-8 h-fit">
          <OrderSummary />
        </div>
      </div>
    </UContainer>
  </div>
</template>
