window.onload = function(){
    //以下为跳转信息获取 搜索面到 歌曲详情面
    let keywords = sessionStorage.getItem("search_content");
    let songsIndex = sessionStorage.getItem("search_content_index");
    let songId = sessionStorage.getItem("songId");
    let songname = sessionStorage.getItem("songname");
    //以下为基本信息展示
    let coverImg = document.getElementById("cover_img");
    let songName = document.getElementById("songname");
    let des = document.getElementById("des");
    let singer = document.getElementById("singer");
    let album = document.getElementById("album");

    
    async function getsrc(){//重新进行搜索 通过索引获得
        let res = await fetch("http://redrock.udday.cn:2022/cloudsearch?keywords=" + `${keywords}`,{
        method:"POST",
        })
        let asd = res.json();

        asd.then(data =>{

            coverImg.src = `${data.result.songs[songsIndex].al.picUrl}`;
            songName.innerText = data.result.songs[songsIndex].name;

            if(data.result.songs[songsIndex].alia[0]===undefined){
                des.innerText  = "";
            }else{
                des.innerText  = data.result.songs[songsIndex].alia[0];
            }

            singer.innerText = "歌手：" + data.result.songs[songsIndex].ar[0].name;
            album.innerText = "所属专辑：" + data.result.songs[songsIndex].al.name;

        })

    }

    getsrc();

    //以上为基本信息展示
    //以下为歌词展示

    let lyric = document.getElementById("lyric");

    async function getmainlyric(){
        let res = await fetch("http://redrock.udday.cn:2022/lyric?id=" + `${songId}`,{
        method:"POST",
        })
        let asd = res.json();

        asd.then(data =>{
            //console.log("数据是",data.lrc.lyric);
            lyric.innerText = data.lrc.lyric;
        })

    }

    getmainlyric();

    //以上为歌词展示
    //以下为评论展示

    let comments = document.getElementById("comments");

    function write(avatar, nickname, content, time, liked){
        comments.innerHTML +=
        ` <div class="comment">
            <div class="avatar">
                <img class="avatarimg" src="`+avatar+`" style="width: 60px;height: 60px;">
            </div>
            <div class="nickname">`+ nickname +`:</div>
            <div class="comment_content">`+content+`</div>
            <div class="comment_time">`+time+`</div>
            <div class="liked">liked:`+liked+`</div>
          </div>
        
        `
    }

    async function getComment(){
        let res = await fetch("http://redrock.udday.cn:2022/comment/music?id=" + `${songId}`,{
        method:"POST",
        })
        let asd = res.json();

        asd.then(data =>{

            for(let i = 0;i<=14;i++){
                //console.log("数据是",data.hotComments[i].content);

                write(data.hotComments[i].user.avatarUrl, data.hotComments[i].user.nickname, data.hotComments[i].content, data.hotComments[i].timeStr, data.hotComments[i].likedCount)

            }
        
        })

    }

    getComment();

    //以上为评论展示

    //以下为页面跳转
    let search = document.getElementById("search");
    search.onchange =function(){//跳转到搜索页面

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

    let findMusic = document.getElementById("findmusic");
    findMusic.onclick = function(){//跳转到发现音乐
        playJump();
    }




    function playJump(){//播放器音乐保存

        sessionStorage.setItem("musicList",`${list}`);//播放列表音乐是url
        sessionStorage.setItem("listName",`${listName}`);//播放列表音乐的名字
        sessionStorage.setItem("nowMusicName",`${musicName.innerText}`);//现在正在播放的音乐名 略有多余
        sessionStorage.setItem("nowIndexMusic",`${indexmusic}`);//正在播放音乐的索引
        sessionStorage.setItem("listId",`${listId}`);
    }


      

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
    //跳转到此页面立即获取 播放器保存的音乐
    let list = stringToArray(sessionStorage.getItem("musicList"));//播放列表url
    let listName = stringToArray(sessionStorage.getItem("listName"));//播放列表音乐名
    let listId = stringToArray(sessionStorage.getItem("listId"));//播放列表音乐ID 获取歌词使用
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

    if(listName.length>0){
        for(let i = 0;i<=listName.length-1;i++){//搬运播放列表音乐名字到播放详情
            write2(listName[i]);
        }
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


//以下为歌曲详情内的 添加播放 和 添加 模块
    let addplay = document.getElementById("detail_play");
    let add  = document.getElementById("detail_add");

    add.onclick = function(){
        async function geturl(){//请求url
            let res2 = await fetch("http://redrock.udday.cn:2022/song/url?id="+`${songId}`,{
            method:"POST",
            })
            let asd2 = res2.json();
                               
            asd2.then(data =>{                                   
                if(list[0]==""){
                    list.shift();
                }
                list.push(data.data[0].url)//添加 
            })
        }                    
        geturl();

        if(listName[0]==""){
            listName.shift();
        }
        if(listId[0]==""){
            listId.shift();
        }
    
        listName.push(songname);
        listId.push(songId);
        
        write2(songname);
    }

    addplay.onclick = function(){
        async function geturl(){//请求url
            let res2 = await fetch("http://redrock.udday.cn:2022/song/url?id="+`${songId}`,{
            method:"POST",
            })
            let asd2 = res2.json();
                               
            asd2.then(data =>{                                   
                if(list[0]==""){
                    list.shift();
                }
                list.push(data.data[0].url)//添加 

                music.src = list[list.length - 1];

                setTimeout(() => {
                    long.innerText = formatDuration(music.duration);
                }, 1500);

                music.play();
                playbtn.innerHTML = "||";
                
            })
        }                    
        geturl();

        if(listName[0]==""){
            listName.shift();
        }
        if(listId[0]==""){
            listId.shift();
        }
    
        listName.push(songname);
        listId.push(songId);
        
        write2(songname);

        musicName.innerText = songname;
        getlyric(songId);
    }



}