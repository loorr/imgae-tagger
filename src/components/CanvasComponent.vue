<template>
    <div>
        <div class="introduce">
          <p>1. 默认进入画布是 移动 这个状态</p>
          <p>2. 移动和图形操作是互斥的</p>
        </div>
        <div class="menu">
            <el-button type="primary" plain @click="drawTypeChange('SELECT')">移动</el-button>
            <el-button type="primary" plain @click="drawTypeChange('RECT')">矩形(Rect)</el-button>
            <el-button type="primary" plain @click="drawTypeChange('CIRCLE')">圆形(Circle)</el-button>
            <el-button type="primary" plain @click="drawTypeChange('POLYGO')">多边形</el-button>

            <el-button type="primary" plain>放大</el-button>
            <el-button type="primary" plain>缩小</el-button>
            <el-button type="primary" plain @click="onClick1">刷  新</el-button>
            <el-button type="primary" plain @click="cancelBefore">向前撤销</el-button>
            <el-button type="primary" plain @click="cancelAfter">向后撤销</el-button>

            <el-button type="primary" plain @click="backImageAdaptWindow">图片适应窗口(默认)</el-button>
            <el-button type="primary" plain @click="backImageAdaptMax">图片最大化</el-button>
        </div>
        <div class="canvas">
            <img id="img"  v-show="false" :src="currImgUrl" />
            <canvas id="my-canvas"></canvas>
        </div>
    </div>
</template>

<script >
    import {defineComponent} from 'vue';
    import {adaptFatherSize, adaptMaxSize, checkMember, DrawMode, ImageAdaptMode} from "../common/canvas";
    let canvas= null;
    let currDrawingRect = null;
    let leableModel = {

    };

    export default defineComponent({
        name: "CanvasComponent",
        data(){
            return {
                // 当前操作的状态
                menuState: DrawMode.SELECT,
                imageAdaptState: ImageAdaptMode.ADAPT_WINDOW,
                // 画布的长宽
                width: 600,
                height: 500,
                // 图像的宽高
                picWidth:0,
                picHeight:0,

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
            this.initImage();
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
                        width: this.width,
                        height: this.height,
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
                const center = canvas.getCenter();
                canvas.setBackgroundColor('rgba(241,55,92,0.07)', canvas.renderAll.bind(canvas))
                // fabric.Image.fromURL(imgUrl, (img, err) => {
                //     if(err) {
                //         canvas.setBackgroundColor('rgba(85, 107, 198, 0.6)', canvas.renderAll.bind(canvas))
                //     }else {
                //         const backImage = canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                //             scaleX: (canvas.width / img.width),
                //             scaleY: (canvas.height / img.height),
                //             top: center.top,
                //             left: center.left,
                //             originX: 'center',
                //             originY: 'center',
                //             crossOrigin: 'anonymous' // 使用的图片跨域时，配置此参数
                //         });
                //         // console.log(backImage)
                //         const m = canvas.backgroundImage;
                //
                //
                //     }
                // });

            },
            initImage(){
                const imgElement = document.getElementById("img");
                imgElement.onload = () => {
                    this.picWidth = imgElement.width;
                    this.picHeight = imgElement.height;
                    const size = adaptFatherSize(this.width,this.height, this.picWidth, this.picHeight)
                    const center = canvas.getCenter();
                    const imgInstance = new fabric.Image(imgElement, {
                        zIndex: -1,
                        selectable: false,
                        scaleX:size.rate,
                        scaleY:size.rate,
                        top: center.top,
                        left: center.left,
                        originX: 'center',
                        originY: 'center',
                    });
                    canvas.add(imgInstance);
                };
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

            onClick1() {
                // canvas.js.clear();
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
                console.log("handleMouseDown ", e.pointer.x, e.pointer.y);
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

            },

            // 非核心函数
            /** 获取绘制图层数量
             *  相当于绘制的元素下标从1开始
             */
            getLayerSize(){
                return canvas.size() - 1;
            },
            cancelBefore(){
                let size = this.getLayerSize();
                if (size == 0) return;
                let rectTemp = canvas.item(size);
                this.afterRect = rectTemp;
                canvas.remove(rectTemp);
            },
            cancelAfter(){
                if (this.afterRect == null) return;
                canvas.add(this.afterRect);
                this.afterRect = null;
            },
            backImageAdaptWindow(){
                if (ImageAdaptMode.ADAPT_WINDOW === this.imageAdaptState) return;
                let image = canvas.item(0);
                let size = adaptFatherSize(this.width,this.height, this.picWidth, this.picHeight)
                canvas.remove(image);
                image.scale(size.rate);
                canvas.add(image);
                canvas.sendToBack(image);
                this.imageAdaptState = ImageAdaptMode.ADAPT_WINDOW;
            },
            backImageAdaptMax(){
                if (ImageAdaptMode.ADAPT_MAX === this.imageAdaptState) return;
                let size = adaptMaxSize(this.width,this.height, this.picWidth, this.picHeight)
                let image = canvas.item(0);
                canvas.remove(image);
                image.scale(size.rate);
                canvas.add(image);
                canvas.sendToBack(image);
                this.imageAdaptState = ImageAdaptMode.ADAPT_MAX;
            },
            drawTypeChange(e){
                if (this.menuState === e) return;
                if (!checkMember(DrawMode, e)) return;
                this.menuState = e;
                console.log(this.menuState)
            }
        }
    })
</script>

<style scoped>
    #my-canvas{
        /*width:1200px;*/
        /*height:800px;*/
        border-color: #42b983;
        border-width: 3px;
        margin-top: 20px;
        margin-left: 20%;
    }
    .introduce{
        margin-top: 20px;
        text-align: left;
        margin-bottom: 20px;
    }
</style>
