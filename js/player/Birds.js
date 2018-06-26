//小鸟类 三张图片循环渲染
import {Sprite} from "../base/Sprite.js";

export class Birds extends Sprite{
    constructor(){
        const image = Sprite.getImage('birds');
        super(image,0,0,image.width,image.height,
            0,0,image.width,image.height);

        //小鸟的三种状态需要一个数据去存储
        //小鸟的宽是34，高度是24，上下边距是10，小鸟左右边距是9
        this.clippingX = [9,9+34+18,9+34+18+34+18];
        this.clippingY = [10,10,10];
        this.clippingWidth = [34,34,34];
        this.clippingHeight = [24,24,24];
        this.birdX = window.innerWidth / 4;
        this.birdsX = [this.birdX,this.birdX,this.birdX];
        this.birdY = window.innerHeight/2;
        this.birdsY = [this.birdY,this.birdY,this.birdY];
        this.birdWidth = 34;
        this.birdsWidth = [this.birdWidth,this.birdWidth,this.birdWidth];
        this.birdHeight = 24;
        this.birdsHeight = [this.birdHeight,this.birdHeight,this.birdHeight];
        this.y = [this.birdY,this.birdY,this.birdY];
        this.index = 0;
        this.count = 0;
        this.time = 0;
    }

    draw() {
        //切换三只小鸟的速度
        const speed = 0.2;
        this.count = this.count + speed;
        //0,1,2
        if (this.index >= 2) {
            this.count = 0;
        }
        //减速器的作用
        this.index = Math.floor(this.count);

        //模拟重力加速度
        const g = 0.98 / 2.4;
        //向上移动一丢丢的偏移量
        const offsetUp = 30;
        //小鸟的位移
        const offsetY = (g * this.time * (this.time - offsetUp)) / 2;

        // for(let i=0; i<=2; i++){
        //     console.log("this.y[i] = " + this.y[i]);
        // }
        // console.log("this.time = " + this.time);
        // console.log(g*this.time*(this.time-offsetUp));
        // const offsetY = 0;

        for (let i = 0; i <= 2; i++) {
            this.birdsY[i] = this.y[i] + offsetY;
        }
        this.time++;

        super.draw(
            this.img,
            this.clippingX[this.index], this.clippingY[this.index],
            this.clippingWidth[this.index], this.clippingHeight[this.index],
            this.birdsX[this.index], this.birdsY[this.index],
            this.birdsWidth[this.index], this.birdsHeight[this.index]
        );
    }
}