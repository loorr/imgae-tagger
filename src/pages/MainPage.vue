<template>
    <div class="main">
        <CanvasComponent></CanvasComponent>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from 'vue'
    import CanvasComponent from "../components/CanvasComponent.vue";

    export default defineComponent({
        name: 'MainPage',
        components:{
            CanvasComponent
        },
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
    .main{
        display: flex;
    }
</style>
