//初始化整个游戏的精灵，作为游戏开始的入口
import {ResourceLoader} from "./base/ResourceLoader.js";
import {BackGround} from "./runtime/BackGround.js";
import {DataStore} from "./base/DataStore.js";
import {Director} from "./Director.js";
import {Land} from "./runtime/Land.js";
import {Birds} from "./player/Birds.js";
import {StartButton} from "./player/StartButton.js";

export class Main {
    constructor(){
        this.canvas = document.getElementById('game_canvas');
        this.ctx = this.canvas.getContext('2d');
        this.dataStore = DataStore.getInstances();
        const loader = ResourceLoader.create();
        this.director = Director.getInstance();

        loader.onLoaded(map=>this.onResourceFirstLoaded(map));
    }

    //资源加载的回调函数
    onResourceFirstLoaded(map){
        this.dataStore.ctx = this.ctx;
        this.dataStore.res = map;
        //console.log(map);
        this.init();
    }

    init(){
        //首先重置游戏是没有结束的
        this.director.isGameOver = false;

        this.dataStore
            .put('background',BackGround)
            .put('land', Land)
            .put('pencils',[])
            .put('birds',Birds)
            .put('startButton',StartButton);

        this.registerEvent();
        //创建铅笔要在游戏逻辑运行之前
        this.director.createPencil();

        this.director.run();
    }

    registerEvent(){
        // console.log("haha");
        this.canvas.addEventListener('touchstart',e => {
            //屏蔽掉JS的时间冒泡
            e.preventDefault();
            if(this.director.isGameOver){
                console.log("游戏开始");
                this.init();
            }else{
                this.director.birdsEvent();
            }
        });
    }
}