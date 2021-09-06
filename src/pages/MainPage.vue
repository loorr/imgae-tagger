<template>
    <div>{{message}}</div>
</template>

<script lang="ts">
    import {defineComponent} from 'vue'
    export default defineComponent({
        name: 'MainPage',
        data(){
            return {
                message:"test"
            }
        },
        mounted() {
            console.log("first");
        }
    })
</script>

<style scoped>

</style>
