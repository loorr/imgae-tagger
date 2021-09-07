<template>
    <div>
        <el-button type="primary" @click="onClick1">刷  新</el-button>
        <canvas id="my-canvas"></canvas>
    </div>
</template>

<script >
    import {defineComponent} from 'vue';

    let canvas= null;

    export default defineComponent({
        name: "CanvasComponent",
        data(){
            return {
                width: 600,
                height: 400,
                imgListIndex:0,
                imgList:[
                    'https://www.thisiscolossal.com/wp-content/uploads/2021/09/yoshida-4-960x588@2x.jpg',
                    "https://n.sinaimg.cn/finance/transform/562/w360h202/20210907/09f1-e8b3191011591725e2ffbf968083d340.jpg"
                ],
                currImgUrl: 'https://www.thisiscolossal.com/wp-content/uploads/2021/09/yoshida-4-960x588@2x.jpg',
            }
        },

        mounted() {
            // 初始化画布
            this.initCanvas();
            // 监听画布事件
            this.fabricObjEvent();
        },

        methods:{
            initCanvas(){
                if (canvas){
                    canvas.clear();
                }

                canvas = new fabric.Canvas(
                    'my-canvas',
                    {
                        width: 600,
                        height: 400,
                        originX: "center",
                        originY: "center",
                        backgroundColor: "#2b2b2b",
                        transparentCorners: false,
                        uniformScaling: false, // 等比例缩放
                        enableRetinaScaling: false,
                        selection: false // 禁止组选择
                    }
                );

                // 当选择画布中的对象时，该对象不出现在顶层
                canvas.preserveObjectStacking = true;

                // 使用本地图片
                // let imgUrl = require('../assets/cc.jpg');
                // 使用网络图片
                let imgUrl = this.currImgUrl;
                fabric.Image.fromURL(imgUrl, (img, err) => {
                    if(err) {
                        canvas.setBackgroundColor('rgba(85, 107, 198, 0.6)',
                            canvas.renderAll.bind(canvas))
                    }else {
                        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                            scaleX: 0.8* canvas.width / img.width,
                            scaleY: 0.8* canvas.height / img.height,
                            crossOrigin: 'anonymous' // 使用的图片跨域时，配置此参数
                        });
                    }
                });
            },
            fabricObjEvent(){
                canvas.on({
                    /** 鼠标按下 */
                    'mouse:down':(e)=> this.handleMouseDown(e),
                    /** 鼠标移动 */
                    'mouse:move':(e)=> this.handleMouseMove(e),
                    /** 鼠标抬起 */
                    'mouse:up':(e) => this.handleMouseUp(e),
                    /** 对象移动 */
                    'object:moving':(e) => this.handleObjectMoving(e),
                    'object:modified':(e) => this.handleObjectModified(e),
                    /** 对象缩放 */
                    'object:scaling':(e) => this.handleObjectScaling(e),
                    /** 对象被选中 */
                    'object:created':(e) => this.handleObjectCreated(e),
                    'object:updated':(e) => this.handleObjectUpdated(e),
                    /** 对象取消选中 */
                    'object:cleared':(e) => this.handleObjectCleared(e),
                });
            },
            onClick1() {
                canvas.clear();
                console.log("121");
            },
            handleMouseDown(e){
                e.pointer.
                console.log("1212");
            },
            handleMouseUp(e){
                console.log("1212");
            },
            handleObjectMoving(e){
                console.log("1212");
            },
            handleObjectModified(e){
                console.log("1212");
            },
            handleObjectScaling(e){
                console.log("1212");
            },
            handleObjectCreated(e){
                console.log("1212");
            },
            handleObjectUpdated(e){
                console.log("1212");
            },
            handleObjectCleared(e){
                console.log("1212");
            }
        }
    })
</script>

<style scoped>
    #my-canvas{
        width:1200px;
        height:800px;
    }
</style>
