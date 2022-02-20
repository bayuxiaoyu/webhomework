
window.onload = function(){
    //以下为轮播图代码  参考来源CSDN博客 
    const pr = document.getElementById("pr");
    const ne = document.getElementById("ne");
    const redPoints = document.querySelectorAll(".point");
    const items = document.querySelectorAll(".item");

    let time = 0;
    let index = 0;

    //清除active
    function clearActive(){
        for(let i = 0; i < items.length; i++){
            items[i].className = "item";
            redPoints[i].className = "point"
        }
    }


    //跳到索引页
    function goIndex() {
        clearActive();
        items[index].className = 'item active';
        redPoints[index].className = 'point active';
    }

    //跳到下一页
    function goNext() {
        if (index < items.length - 1) {
            index++;
        } else {
            index = 0;
        }

        goIndex();
    }

    //跳到上一页
    function goPrev() {
        if (index == 0) {
            index = items.length - 1;
        } else {
            index--;
        }

        goIndex();
    }

    //绑定next点击事件
    ne.addEventListener('click', function () {
        goNext();
        time = 0;
    });

    //绑定prev点击事件
    pr.addEventListener('click', function () {
        goPrev();
        time = 0;
    });

    //点击圆点跳转到对应图片
    for (let i = 0; i < items.length; i++) {
        redPoints[i].addEventListener('click', function () {
            let pointIndex = redPoints[i].getAttribute('data-index');
            index = pointIndex;
            goIndex();
            time = 0;
        })
    }

    //自动轮播定时器
    setInterval(function () {
        time++;
        if (time == 45) {
            goNext();
            time = 0;
        }
    }, 100);

    //以上为轮播图代码
    //已用变量名称：pr ne redPoints items time index
    //已用函数名称：goNext() goPrev() goIndex() clearActive()



    //一下为“热门推荐”数据请求
    let recCovers = document.getElementsByClassName("reccover");
    let recDes = document.getElementsByClassName("recdes");
    let listenNum = document.getElementsByClassName("listennum")

    async function getRec(){
        let res = await fetch("http://redrock.udday.cn:2022/personalized?limit=8",{
        method:"POST",
        })
        let asd = res.json();
        //console.log(asd);

        asd.then(data =>{
            //console.log(data);

            for(let i = 0; i<8 ;i++){
                //console.log("数据是",data.result[i].id,data.result[i].name);
                recCovers[i].innerHTML = "<img src='"+ data.result[i].picUrl +"'width='150px'>";
                recDes[i].innerHTML = data.result[i].name;


                async function getListInfo(){
                    let res2 = await fetch("http://redrock.udday.cn:2022/playlist/detail/dynamic?id=" +`${data.result[i].id}`,{
                    method:"POST",
                    })
                    let asd2 = res2.json();
                    asd2.then(data =>{
                        listenNum[i].innerHTML = `${parseInt(data.playCount/10000)}` +"万"

                    })
        
                }
                getListInfo();
                
            }

           
            
        })

    }

    getRec();


    //以下为热门MV请求 跳转
    let sideMain = document.getElementById("side_main");
    let sideItemLink = document.getElementsByClassName("side_item_link");

    function write3(picUrl, des){
        sideMain.innerHTML += `
        <div class="side_item">
            <img src="`+picUrl+`" width="80px">
            <div class="side_item_des">
                <a class="side_item_link" href="./video.html" target="_blank">`+des+`</a>
            </div>
        </div>
        `
    }

    async function getmvtop(){
        let res = await fetch("http://redrock.udday.cn:2022/top/mv?limit=20",{
        method:"POST",
        })
        let asd = res.json();

        asd.then(data =>{
        
            for(let i=0;i<=19;i++){
                write3(data.data[i].cover, data.data[i].name);
            }

            for(let i=0;i<=24;i++){//跳转储存MV的ID
                sideItemLink[i].onclick = function(){
                    localStorage.setItem("mvId", data.data[i].id) 
                }
            }

        })

    }

    getmvtop();

    
    //以下为搜索跳转

    let search = document.getElementById("search");

    search.onchange =function(){

        document.onkeyup = (e) => {
            const event = e || window.event
            const key = event.which || event.keyCode || event.charCode
            if (key === 13) {
                window.location.href = "./search.html";//跳转
                sessionStorage.setItem("searchItem",`${search.value}`);//保存搜索内容
                playJump();
            }

            document.onkeyup =null;
        }


    }

    //跳转用！！！！
    function playJump(){//播放器音乐保存

        sessionStorage.setItem("musicList",`${list}`);//播放列表音乐是url
        sessionStorage.setItem("listName",`${listName}`);//播放列表音乐的名字
        sessionStorage.setItem("nowMusicName",`${musicName.innerText}`);//现在正在播放的音乐名 略有多余
        sessionStorage.setItem("nowIndexMusic",`${indexmusic}`);//正在播放音乐的索引
        sessionStorage.setItem("listId",`${listId}`);//id 供获取歌词
    }


    //以上为搜索模块 已用search

    //以下为音乐播放模块


    let music = document.getElementById("audio");
    let volume = document.getElementById("volume");
    let playbtn = document.getElementById("play");
    let preplay = document.getElementById("prev");
    let neplay = document.getElementById("next");
    let volumenum = document.getElementById("volumenum");
    let curtime = document.getElementById("curtime");
    let long = document.getElementById("long");

    let total = document.getElementById("total");
    let progressed = document.getElementById("progressed");
    let circle = document.getElementById("circle");
    let musicName = document.getElementById("musicname");
    //初始化声明
    let list = [];
    let listName = [];
    let listId = [];

    list = stringToArray(sessionStorage.getItem("musicList"));//音乐播放列表url
    listName = stringToArray(sessionStorage.getItem("listName"));//音乐播放列表音乐名
    listId = stringToArray(sessionStorage.getItem("listId"));//音乐播放列表ID

    let indexmusic;
    if(sessionStorage.getItem("nowIndexMusic")===null){
        indexmusic = 0;
    }else{
        indexmusic = parseInt(sessionStorage.getItem("nowIndexMusic"));
    }

    musicName.innerText = sessionStorage.getItem("nowMusicName");
    
    curtime.innerText = "00:00:00";
    long.innerText = "00:00:00";
    volumenum.innerText = volume.value*100 + "%";

    music.loop = true;

    //播放控制
    playbtn.onclick = function(){
        setTimeout(() => {
            long.innerText = formatDuration(music.duration);
        }, 500);
        if(music.paused){
            if(music.src ==""){
                music.src = list[indexmusic];
                music.play();
                playbtn.innerHTML = "||";
                musicName.innerText = listName[indexmusic];
            }else{
                music.play();
                playbtn.innerHTML = "||";
            }
           
        }else{
            music.pause();
            playbtn.innerHTML = "▶";
        }
    }

    //音量控制
    volume.onchange = function(){
        music.volume = volume.value;
        volumenum.innerText = volume.value*100 + "%";
        
    }

    //切换到下一首
    neplay.onclick = function(){
        playbtn.innerHTML = "||";
        music.pause();

        setTimeout(() => {
            long.innerText = formatDuration(music.duration);
        }, 500);

        if(indexmusic == list.length-1){
            indexmusic = 0;
        }else{
            indexmusic++;     
        }
        music.src =list[indexmusic]
        music.play();
        musicName.innerText = listName[indexmusic];
        //获取歌词
        getlyric(listId[indexmusic]);
        
    }

    //切换到上一首
    preplay.onclick = function(){
        music.pause();

        setTimeout(() => {
            long.innerText = formatDuration(music.duration);
        }, 500);
        
        if(indexmusic == 0){
            indexmusic = list.length-1;
        }else{
            indexmusic--;
        }
        music.src =list[indexmusic];
        music.play();
        playbtn.innerHTML = "||";
        musicName.innerText = listName[indexmusic];

       //获取歌词
       getlyric(listId[indexmusic]);
    }

    //实时更新
    music.ontimeupdate = function(){
        curtime.innerText =formatDuration(music.currentTime);
        progressed.style.width = `${parseInt((music.currentTime/music.duration)*600)}`+ "px";
        circle.style.left =  `${parseInt((music.currentTime/music.duration)*600)}`+ "px";
    }

    //点击控制
    total.onclick = function(event){
        let x = event.offsetX;
        progressed.style.width = `${x}` + "px";
        circle.style.left = `${x-5}` + "px";
        music.currentTime = music.duration * (x/600);

    }

    
    //拖拽控制
    circle.onmousedown = function(event){

        music.ontimeupdate = null;
        total.onmousemove = function(event){

            if((event.clientX -365)>=600){
                progressed.style.width = "600px"
                circle.style.left = "600px"
            }else if((event.clientX -365)<=0){
                progressed.style.width = "0px"
                circle.style.left = "0px"
            }else{
                progressed.style.width = `${event.clientX -365}` + "px";
                circle.style.left = `${event.clientX -365}` + "px";
                curtime.innerText =formatDuration(((event.clientX -365)/600)* music.duration);
            }

        }
        document.onmouseup = function(event){
            let x = parseInt(progressed.style.width);
            progressed.style.width = `${x}` + "px";
            music.currentTime = music.duration * (x/600);

            total.onmousemove = null;
            document.onmouseup = null;

            music.ontimeupdate = function(){
            curtime.innerText =formatDuration(music.currentTime);
            progressed.style.width = `${parseInt((music.currentTime/music.duration)*600)}`+ "px";
            circle.style.left =  `${parseInt((music.currentTime/music.duration)*600)}`+ "px";
        }
        }
    }
    



    function formatDuration(time) {
        if(time > -1) {
            let hour = Math.floor(time / 3600);
            let min = Math.floor(time / 60) % 60;
            let sec = time % 60;

            //去除小数点
            sec = Math.round(sec);

            if(hour < 10) {
                time = '0' + hour + ":";
            } else {
                time = hour + ":";
            }

            if(min < 10) {
                time += "0";
            }
            time += min + ":";

            if(sec < 10) {
                time += "0";
            }
            time += sec;
        }
        return time;
    }




    function stringToArray(arr){

        if(arr==null){
            let tempArr =[];
            return tempArr;
        }else{
            let tempArr=arr.split(',');
            return tempArr;
        }
        
    }

    
    async function getlyric(x){//获取歌词函数
        let res = await fetch("http://redrock.udday.cn:2022/lyric?id="+`${x}`,{
        method:"POST",
        })
        let asd = res.json();
        
        asd.then(data =>{
            musicWords.innerText = data.lrc.lyric;
        })

    }


    //以下为播放列表模块
    let listNameBtn = document.getElementById("listnamebtn");
    let musicNamesBox = document.getElementById("musicnamesbox");
    let musicNames = document.getElementById("musicnames");
    let musicWords = document.getElementById("musicwords");
    let musicNamesItem = document.getElementsByClassName("musicnames-item");

    for(let i = 0;i<=listName.length-1;i++){//搬运播放列表音乐名字到播放详情
        write2(listName[i]);
    }
    


    listNameBtn.onclick = function(){
        
        if(musicNamesBox.style.visibility=="hidden"){//播放详情出现
            musicNamesBox.style.visibility="visible";
            
            if(musicWords.innerText === ""){
                getlyric(listId[indexmusic]);
            }

        }else{
            musicNamesBox.style.visibility="hidden";
        }

    }

    window.onclick = function(){
         
        for(let i=0;i<=list.length-1;i++){//选择点击播放
            musicNamesItem[i].onclick = function(){
                setTimeout(() => {
                    long.innerText = formatDuration(music.duration);
                }, 500);
                indexmusic = i;
                music.pause();
                music.src = list[indexmusic];
                music.play();
                playbtn.innerHTML = "||";
                musicName.innerText = listName[indexmusic];
                //获取歌词
                getlyric(listId[indexmusic]);
    
                
            }
        }
    }


    function write2(x){
        musicNames.innerHTML += `
        <div class="musicnames-item">`+x+`</div>
        
        `
    }

    
    //以上为播放列表模块

    //以下为播放模式切换模块

    let shift = document.getElementById("shift");
    
    shift.onclick = function(){
        if(shift.innerHTML == "单循"){
            shift.innerHTML = "顺序";
            music.loop = false;

            setInterval(() => {
                if(music.ended){
                    playbtn.innerHTML = "||";
                    music.pause();

                    setTimeout(() => {
                        long.innerText = formatDuration(music.duration);
                    }, 500);

                    if(indexmusic == list.length-1){
                        indexmusic = 0;
                    }else{
                        indexmusic++;     
                    }
                    music.src =list[indexmusic]
                    music.play();
                    musicName.innerText = listName[indexmusic];
                    //获取歌词
                    getlyric(listId[indexmusic]);
                }
            }, 500); 

        }else{
            shift.innerHTML = "单循";
            music.loop = true;
        }
    }

//以上为音乐播放模块 











}