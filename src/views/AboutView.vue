<template>
<<<<<<< src/views/AboutView.vue
  <div class="parent flex">
    parent
    <div class="child relative w-10 h-10">child1</div>
    <div id="child2" class="child relative w-10 h-10">child2</div>
    <div id="child3" class="child child3 absolute w-10 h-10">child3</div>
  </div>
</template>

<style scoped>
.parent {
  background-color: lightcoral;
  display: flex; /* Flexbox를 사용하여 자식 요소 배치 */
  align-items: center; /* 수직 정렬 */
  position: relative; /* 기준점 설정 */
}

.child {
  background-color: blue;
  color: white;
}

.child3 {
  background-color: green;
  position: absolute; /* 부모 기준으로 절대 위치 */
  top: 0;
  left: calc(100% + 10px); /* child2 바로 옆에 배치 (10px 간격) */
}

#child2 {
  position: relative; /* 기준점이 될 요소 */

}
</style>
