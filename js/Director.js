//导演类 控制游戏的逻辑
import {DataStore} from "./base/DataStore.js";
import {UpPencil} from "./runtime/UpPencil.js";
import {DownPencil} from "./runtime/DownPencil.js";

export class Director {
    constructor(){
        this.dataStore = DataStore.getInstances();
        this.landSpeed = 2;
    }

    createPencil(){
        const minTop = window.innerHeight / 8;
        const maxTop = window.innerHeight / 2;
        const top = minTop + Math.random()*(maxTop - minTop);
        this.dataStore.get('pencils').push(new UpPencil(top));
        this.dataStore.get('pencils').push(new DownPencil(top));
    }

    static getInstance(){
        if(!Director.instance){
            Director.instance = new Director();
        }
        return Director.instance;
    }

    birdsEvent(){
        for(let i=0; i<=2; i++){
            this.dataStore.get('birds').y[i] = this.dataStore.get('birds').birdsY[i];
        }
        this.dataStore.get('birds').time = 0;
    }

    //判断小鸟是否撞击铅笔
    static isStrike(bird,pencil){
        let s = false;
        if(bird.top > pencil.bottom ||
            bird.bottom < pencil.top ||
            bird.right < pencil.left ||
            bird.left > pencil.right
        ){
            s = true;
        }
        return s;
    }

    //判断小鸟是否撞击地板和铅笔
    check(){
        const birds = this.dataStore.get('birds');
        const land = this.dataStore.get('land');
        const pencils = this.dataStore.get('pencils');

        //地板的判断
        if(birds.birdsY[0]+birds.birdsHeight[0]>=land.y){
            // console.log("撞击地板");
            this.isGameOver = true;
            return;
        }

        //小鸟边框模型
        const birdsBorder = {
            top:birds.y[0],
            bottom:birds.birdsY[0]+birds.birdsHeight[0],
            left:birds.birdsX[0],
            right:birds.birdsX[0]+birds.birdsWidth[0]
        };

        const length = pencils.length;
        for(let i=0; i<length; i++){
            const pencil = pencils[i];
            const pencilBorder = {
                top:pencil.y,
                bottom:pencil.y+pencil.height,
                left:pencil.x,
                right:pencil.x+pencil.width
            };

            if(Director.isStrike(birdsBorder,pencilBorder)){
                // console.log("撞到铅笔");
                // this.isGameOver = true;
                return;
            }
        }
    }

    /* **
        逻辑是没问题的，只有两根铅笔在屏幕上的问题的原因是
        已经画出来了另两根铅笔，只不过因为屏幕长宽的问题没有出现在屏幕内

     */

    run(){
        this.check();
        if(!this.isGameOver){
            this.dataStore.get('background').draw();

            // console.log(this.dataStore.get('pencils').length);
            this.dataStore.get('pencils').forEach(function (value) {
                value.draw();
            });

            const pencils = this.dataStore.get('pencils');
            if(pencils[0].x+pencils[0].width <= 0 &&
                pencils.length === 4){
                //shift()把数据的第一个元素推出数组，并且把数组的个数减一
                pencils.shift();
                pencils.shift();
            }

            if(pencils[0].x <= (window.innerWidth-pencils[0].width)/2 &&
                pencils.length === 2){
                this.createPencil();
            }

            this.dataStore.get('land').draw();

            this.dataStore.get('birds').draw();

            //根据浏览器的要求自动进行帧率的设置，也就是run()方法回调的频率
            let timer = requestAnimationFrame(()=>this.run());

            this.dataStore.put('timer',timer);
        }else{
            console.log("游戏结束");

            this.dataStore.get('startButton').draw();

            cancelAnimationFrame(this.dataStore.get('timer'));
            this.dataStore.destroy();
        }
    }
}