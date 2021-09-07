<template>
    <div>
        <el-button type="primary" @click="onClick1">刷  新</el-button>
        <el-button type="primary" @click="cancelBefore">向前撤销</el-button>
        <el-button type="primary" @click="cancelAfter">向后撤销</el-button>
        <canvas id="my-canvas"></canvas>
    </div>
</template>

<script >
    import {defineComponent} from 'vue';

    let canvas= null;
    let currDrawingRect = null;
    let leableModel = {

    };

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
                // 存储标签位置
                labelList:[

                ],
                mouseFrom:{
                    x:0,
                    y:0
                },
                mouseTo:{
                    x:0,
                    y:0
                },

                doDrawing: false,
                moveCount: 1,
                actions:{
                    drag: false,
                    select: false,
                },
                preRect:null,
                afterRect:null
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
                        // transparentCorners: false,
                        uniformScaling: false, // 等比例缩放
                        enableRetinaScaling: false,
                        selection: false // 禁止组选择
                    }
                );

                // 当选择画布中的对象时，该对象不出现在顶层
                canvas.preserveObjectStacking = false;

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
                    'mouse:move':(e)=> this.handleObjectMoving(e),
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
            cancelBefore(){
                if (canvas.size() == 0) return;
                console.debug("cancelBefore " + canvas.size() + " " + canvas.item(1))
                let beforeIndex = canvas.size() -1;
                let rectTemp = canvas.item(beforeIndex);
                this.afterRect = rectTemp;
                canvas.remove(rectTemp);
            },
            cancelAfter(){
                if (this.afterRect == null) return;
                canvas.add(this.afterRect);
                this.afterRect = null;
            },
            onClick1() {
                // canvas.clear();
                const objects = canvas.getObjects('rect');
                for (let i in objects) {
                    canvas.remove(objects[i]);
                }
                console.log("121");
                this.moveCount = 1;
                this.doDrawing = false;
                this.actions.select = false;
            },
            handleMouseDown(e){
                console.log("handleMouseDown");
                this.doDrawing = true;
                this.mouseFrom = this.limitPoint(e.pointer.x, e.pointer.y);
            },
            handleMouseUp(e){
                console.log("1212");
                // 判断本次绘制的大小
                // let position = currDrawingRect.get('position')
                console.debug("position s " + currDrawingRect);

                if (currDrawingRect != null){
                    if (currDrawingRect.width < 10 || currDrawingRect.height < 10) {
                        this.cancelBefore();
                    }
                }

                // console.debug("position e " + currDrawingRect.width  + " " + currDrawingRect.height);
                this.moveCount = 1;
                this.doDrawing = false;
                this.afterRect = null;
                this.preRect = currDrawingRect;
                currDrawingRect = null;
                this.actions.select = false;
                console.debug("对象取消选中，置为false");
            },
            handleObjectMoving(e){
                if (this.actions.select) return;
                if (this.moveCount%10 != 0 && !this.doDrawing) return;
                console.log("handleObjectMoving");
                this.moveCount++;
                this.mouseTo = this.limitPoint(e.pointer.x, e.pointer.y);
                this.drawingRect();
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
            },
            drawingRect(){
                if (currDrawingRect){
                    canvas.remove(currDrawingRect);
                }
                let newRect = null;
                let x = this.mouseFrom.x < this.mouseTo.x ? this.mouseFrom.x : this.mouseTo.x;
                if (x < 0) x = 0;
                let y = this.mouseFrom.y < this.mouseTo.y ? this.mouseFrom.y : this.mouseTo.y;
                if (y < 0) y = 0;

                let width = Math.abs(this.mouseTo.x - this.mouseFrom.x);
                let height = Math.abs(this.mouseTo.y - this.mouseFrom.y);

                newRect = this.setRect(x, y, width, height);
                newRect.setControlsVisibility({mtr: false})
                // 绘制
                if (newRect){
                    canvas.add(newRect);
                    currDrawingRect = newRect;
                    let position = {
                        x:x,
                        y:y,
                        width:width,
                        height:height
                    }
                    currDrawingRect.set('position', position)
                };
            },
            limitPoint(x, y){
                return {x:x, y:y};
            },
            setRect(left, top, width, height, color, lineWidth){
                let rect = new fabric.Rect(
                    {
                        left: left,
                        top: top,
                        width: width,
                        height: height,
                        fill:'rgba(232,103,103,0.4)',
                        stroke: color || '#FD9D91',
                        strokeUniform: true,
                        strokeWidth: lineWidth || 3,
                        transparentCorners: false,
                        cornerColor:'rgba(255,255,255,1)',
                        cornerStrokeColor:'#409eff',
                        borderColor:'#409eff',
                        padding:0,
                        cornerStyle:'circle'
                    }
                );
                rect.on('selected',(e)=>{
                    console.debug("对象被选中")
                    if (this.actions.select) return;
                    this.actions.select = true;
                });
                rect.on('scaling',(e)=>{
                    console.debug("对象被scaling")
                    if (this.actions.select) return;
                    this.actions.select = true;
                });

                rect.on('moving', (e)=>{
                    console.debug("对象移动")
                    if (this.actions.select) return;
                    this.actions.select = true;
                });
                return rect;
            },
            drag(e){
                if (!this.actions.drag) return;

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
