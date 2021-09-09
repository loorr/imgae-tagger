/** 绘图状态枚举 */
export const DrawMode =  {
    SELECT:0,
    RECT:1,
    CIRCLE:2,
    POLYGO:3
}
Object.freeze(DrawMode);

export const ImageAdaptMode = {
    /** 图像适应窗口 */
    ADAPT_WINDOW:0,
    /** 图像最大化 */
    ADAPT_MAX:1
}

/**
 * 适应父亲
 * TODO 可以删掉部分代码
 */
export function adaptFatherSize(containerWidth, containerHeight, picWidth, picHeight) {
    let containerRate = containerWidth/containerHeight;
    let picRate = picWidth/picHeight;

    let width, height, rate;
    if (containerRate < picRate){
        width = containerWidth;
        height = containerWidth/picRate;
        rate = containerWidth/picWidth;
    }else {
        width = containerHeight*picRate;
        height = containerHeight;
        rate = containerHeight/picHeight;
    }
    return {width, height, rate};
}

/**
 * 自己最大化
 */
export function adaptMaxSize(containerWidth, containerHeight, picWidth, picHeight) {
    let containerRate = containerWidth/containerHeight;
    let picRate = picWidth/picHeight;

    let width, height, rate;
    if (containerRate < picRate){
        width = containerHeight*picRate;
        height = containerHeight;
        rate = containerHeight/picHeight;
    }else {
        width = containerWidth;
        height = containerWidth/picRate;
        rate = containerWidth/picWidth;
    }
    return {width, height, rate};
}


