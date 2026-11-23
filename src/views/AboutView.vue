<template>
  <div class="bg-gray-100 text-gray-800 p-6">
    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">
      <h1 class="h1">{{ $t('about.title') }}</h1>
      <p class="text-lg mb-6">
        {{ $t('about.description') }}
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h2 class="text-2xl font-semibold mb-2">{{ $t('about.skills') }}</h2>
          <ul class="list-disc list-inside space-y-1">
            <li>{{ $t('about.skill1') }}</li>
            <li>{{ $t('about.skill2') }}</li>
            <li>{{ $t('about.skill3') }}</li>
            <li>{{ $t('about.skill4') }}</li>
          </ul>
        </div>

        <div>
          <h2 class="text-2xl font-semibold mb-2">{{ $t('about.hobbies') }}</h2>
          <ul class="list-disc list-inside space-y-1">
            <li>{{ $t('about.hobby1') }}</li>
            <li>{{ $t('about.hobby2') }}</li>
            <li>{{ $t('about.hobby3') }}</li>
            <li>{{ $t('about.hobby4') }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script logic needed for static content
</script>