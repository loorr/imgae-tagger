<template>
    <div class="main">
        <Sidebar class=".container-sidebar"></Sidebar>
        <div class=".container-main">
            <Header></Header>
            <div class="text-3xl">{{message}}</div>
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from 'vue'
    import Header from "../components/Header.vue";
    import Sidebar from "../components/Sidebar.vue";
    export default defineComponent({
        name: 'MainPage',
        components:{
          Header, Sidebar
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

    .container-sidebar {
        width: 30%;
        color: #42b983;
    }

    .container-main {
        /* Take the remaining width */
        flex: 1;

        /* Make it scrollable */
        overflow: auto;
    }
</style>
