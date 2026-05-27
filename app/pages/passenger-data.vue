<script setup lang="ts">
const auth = useAuthStore();
const route = useRoute();

const titleOptions = [
  {
    label: "Mr",
    value: "Mr",
  },
  {
    label: "Mrs",
    value: "Mrs",
  },
  {
    label: "Ms",
    value: "Ms",
  },
];

const booker = reactive({
  title: "Ms",
  fullName: auth.fullName || "",
  phone: "",
  email: auth.email || "",
  country: "Indonesia",
  idCardNumber: auth.idCardNumber || "",
});

function submit() {
  if (!booker.fullName.trim() || !booker.idCardNumber.trim()) {
    return;
  }

  auth.fullName = booker.fullName;

  auth.idCardNumber = booker.idCardNumber;

  auth.email = booker.email;

  localStorage.setItem("booker-data", JSON.stringify(booker));

  navigateTo("/waiting-room");
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white py-8 md:py-12">
    <UContainer class="max-w-4xl">
      <div class="space-y-8">
        <div class="space-y-2">
          <h1 class="text-3xl md:text-5xl font-bold tracking-tight">Booking Details</h1>

          <p class="text-sm md:text-base leading-relaxed text-slate-400">
            Please fill out this form carefully. Your e-ticket will be sent to the email address registered under the booking contact details.
          </p>
        </div>

        <UCard class="rounded-3xl bg-white/5 border border-white/10">
          <div class="p-6 md:p-8 space-y-6">
            <URadioGroup
              v-model="booker.title"
              :items="titleOptions"
              orientation="horizontal"
              :ui="{
                label: 'text-slate-200',
              }"
            />

            <div class="space-y-4">
              <UInput v-model="booker.fullName" size="xl" placeholder="Full Name" class="w-full" />

              <UInput v-model="booker.phone" size="xl" placeholder="Phone Number" class="w-full" />

              <UInput v-model="booker.email" size="xl" placeholder="Email Address" class="w-full" />

              <USelect v-model="booker.country" :items="['Indonesia']" size="xl" class="w-full" />

              <UInput v-model="booker.idCardNumber" size="xl" placeholder="ID Card Number" class="w-full" />
            </div>
          </div>
        </UCard>

        <UButton block size="xl" class="h-14 rounded-2xl" @click="submit"> Save & Continue </UButton>
      </div>
    </UContainer>
  </div>
</template>
