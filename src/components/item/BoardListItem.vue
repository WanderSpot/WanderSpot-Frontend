<script setup>
import { defineProps } from 'vue';

const props = defineProps({ article: Object }); 
</script>

<template>
  <tr class="text-center">
    <th scope="row">{{ article.articleNo }}</th>
    <td class="text-start">
      <router-link
        :to="{ name: 'notice-view', params: { articleno: article.articleNo } }"
        class="article-title link-dark"
      >
        {{ article.subject }}
      </router-link>
    </td>
    <td>{{ article.userId }}</td>
    <td>{{ article.hit }}</td>
    <td>{{ `${article.registerTime[0]}-${article.registerTime[1]}-${article.registerTime[2]}` }}</td>
  </tr>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>
