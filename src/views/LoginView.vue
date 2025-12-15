<script setup>
import LoginForm from '@/components/auth/LoginForm.vue'
</script>

<template>
  <div class="flex min-h-screen w-full relative overflow-hidden bg-[#143d2e] animate-enter">

    <div class="absolute inset-0 z-0">
      <img 
        src="@/assets/HJ_Photo.png" 
        alt="Background Pattern" 
        class="w-full h-full object-cover opacity-40 mix-blend-overlay"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-[#143d2e]/95 to-[#1e5c45]/95"></div>
    </div>

    <div class="relative z-10 flex w-full h-full min-h-screen">

      <div class="hidden lg:flex relative w-[65%] overflow-hidden">
        
        <img 
          src="@/assets/HJ_Photo.png" 
          alt="Habi Jaya Background" 
          class="absolute inset-0 w-full h-full object-cover object-center"
        />
        
        <div class="absolute inset-0 bg-gradient-to-br from-[#143d2e]/90 to-[#1e5c45]/80 mix-blend-multiply"></div>

        <div class="relative z-10 flex flex-col justify-between p-16 w-full h-full text-white">
          <div class="flex items-center gap-4">
            <img src="@/assets/HJ_dark.png" alt="Habi Jaya Logo" class="w-14 h-14 brightness-0 invert" />
            <div>
              <h1 class="text-3xl font-black tracking-tight leading-none">HABI JAYA</h1>
              <p class="text-xs font-bold text-green-300 uppercase tracking-widest mt-1">Management System</p>
            </div>
          </div>
          
          <div class="max-w-2xl">
            <h2 class="text-5xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-sm">
              Excellence in <br/> Every Drop.
            </h2>
            <p class="text-green-100 text-xl font-medium leading-relaxed max-w-lg drop-shadow-sm">
              Sistem terintegrasi untuk pemantauan operasional SPBU yang presisi, efisien, dan transparan.
            </p>
          </div>

          <p class="text-sm text-green-200/60 font-medium">
            © {{ new Date().getFullYear() }} PT. Habi Jaya. All rights reserved.
          </p>
        </div>
      </div>

      <div class="flex-1 lg:w-[35%] flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 w-full lg:bg-white transition-all duration-300">
        
        <div class="w-full max-w-sm space-y-10">
          
          <div class="lg:hidden text-center space-y-2">
            <img src="@/assets/HJ_dark.png" alt="Logo" class="w-20 h-20 mx-auto brightness-0 invert opacity-90" />
            <h1 class="text-3xl font-black text-white tracking-tight drop-shadow-md">HABI JAYA</h1>
            <p class="text-xs font-bold text-green-200 uppercase tracking-widest">Operator Console</p>
          </div>

          <div class="text-center lg:text-left space-y-2">
            <h2 class="text-3xl md:text-4xl font-extrabold text-white lg:text-gray-900 tracking-tight drop-shadow-md lg:drop-shadow-none">
              Selamat Datang
            </h2>
            <p class="text-green-100/90 lg:text-gray-500 text-sm font-medium">
              Masukan kredensial Anda untuk melanjutkan.
            </p>
          </div>

          <div class="py-2">
            <LoginForm />
          </div>

          <p class="text-center text-sm text-green-200/80 lg:text-gray-400 font-medium">
            Butuh bantuan akses? 
            <a href="#" class="font-bold text-white lg:text-[#143d2e] hover:underline transition-all">
              Hubungi Admin
            </a>
          </p>

        </div>
      </div>

    </div>

  </div>
</template>