<template>
  <div class="bg-gray-100 text-gray-800 p-6">
    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">
      <h1 class="h1">About Me</h1>
      <p class="text-lg mb-6">
        Hello! I'm Lukas, a passionate developer who loves building user-friendly web applications.
        I enjoy working with modern tools like Vue 3 and Tailwind CSS to create clean and responsive UIs.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h2 class="text-2xl font-semibold mb-2">Skills</h2>
          <ul class="list-disc list-inside space-y-1">
            <li>Vue 3 & Composition API</li>
            <li>Tailwind CSS</li>
            <li>JavaScript / TypeScript</li>
            <li>REST APIs</li>
          </ul>
        </div>

        <div>
          <h2 class="text-2xl font-semibold mb-2">Hobbies</h2>
          <ul class="list-disc list-inside space-y-1">
            <li>Learning new tech</li>
            <li>Designing UI/UX</li>
            <li>Gaming</li>
            <li>Exploring the web</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script logic needed for static content
</script>
