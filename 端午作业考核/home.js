window.onload = function(){
//切页
    const recommendbtn = document.getElementById("recommendbtn");
    const rankbtn = document.getElementById("rankbtn");
    const searchbtn = document.getElementById("searchbtn");
    const recommend = document.getElementById("recommend");
    const rank = document.getElementById("rank");
    const hotsearch = document.getElementById("hotsearch");
    recommendbtn.onclick = function(){
        rank.style.display = 'none';
        recommend.style.display = 'block';
    }

    rankbtn.onclick = function(){
        recommend.style.display = 'none';
        rank.style.display = 'flex';
        document.getElementById("recommendbtn").disabled = false;
    }

    searchbtn.onclick = function(){
        recommend.style.display = 'none';
        hotsearch.style.display = 'block';
        hotbox.style.display = 'block';

        for(let i=0;i<10;i++){
            outli[i].innerHTML = `
            <div class="outname"></div>
            <div class="outartist"></div>
            `
        }

        outbox.style.display = 'none';
        search.value = '';
        document.getElementById("recommendbtn").disabled = true;
    }



//歌单
    const guanfangli = document.getElementsByClassName("guanfangli");
    const darenli = document.getElementsByClassName("darenli");
    const zhuanquli = document.getElementsByClassName("zhuanquli");

    async function getlist(){
        let res = await fetch("http://124.221.249.219:8000/api/recommendations",{
        method:"GET",
        })
        let asd = res.json();
        //console.log(asd);

        asd.then(data =>{
        //console.log("数据是",data);
            for(let i=0;i<6;i++){
                guanfangli[i].innerHTML = `
            <div class="guanfangpic">
                <img src="`+data.offical[i].cover +`" width="100px" height="100px" class="guanfangcover">
                <div class="guanfangnum">▶`+data.offical[i].views +`</div>
            </div>
            <div class="guanfangdes">
               `+data.offical[i].title +`
            </div>
                
                `;

                darenli[i].innerHTML = `
            <div class="darenpic">
                <img src="`+data.tatsujin[i].cover +`" width="100px" height="100px" class="darencover">
                <div class="guanfangnum">▶`+data.tatsujin[i].views +`</div>
            </div>
            <div class="darendes">
            `+data.tatsujin[i].title +`
            </div>

                `;

            }


            for(let i=0;i<9;i++){
                zhuanquli[i].innerHTML = `
                <div class="zhuanqupic">
                        <img src="`+data.column[i].background +`" height="120px"  width="220px" class="zhuanqucover">
                        <div class="icon">
                            <img src="`+data.column[i].icon +`" width="40px" height="40px" class="zhuanquicon">
                            <span class="zhuanquname">`+data.column[i].title +`</span>
                        </div>
                            
                </div>
                 <div class="zhuanqudes">
                 `+data.column[i].description +`
                </div>
                
                `
            }


        })

    }

    getlist();

//搜索

    const cancel = document.getElementById("cancel");
    const hotli = document.getElementsByClassName("hotli");

    cancel.onclick = function(){
        hotsearch.style.display = 'none';
        recommend.style.display = 'block';
        document.getElementById("recommendbtn").disabled = false;
    }

    async function gethot(){
        let res = await fetch("http://124.221.249.219:8000/api/hot",{
        method:"GET",
        })
        let asd = res.json();
        //console.log(asd);

        asd.then(data =>{
           //console.log("数据是",data);
            for(let i=0;i<10;i++){
                hotli[i].innerHTML = data[i];
            }


        })

    }

    gethot();


//搜索出来

    const search  = document.getElementById("search");
    const outli = document.getElementsByClassName("outli");
    const hotbox = document.getElementById("hotbox");
    const outbox = document.getElementById("outbox");
    
    search.onchange = function(){
        document.onkeyup = (e) => {
            const event = e || window.event
            const key = event.which || event.keyCode || event.charCode
            if (key === 13) {
                hotbox.style.display = 'none';
                outbox.style.display = 'block';
                async function getout(){
                    let res = await fetch("http://124.221.249.219:8000/api/search?keyword="+search.value+"",{
                    method:"GET",
                    })
                    let asd = res.json();
                    //console.log(asd);
            
                    asd.then(data =>{
                       console.log("数据是",data);
                        
                       for(let i=0;i<10;i++){
                           outli[i].innerHTML = `
                           <div class="outname">`+data[i].title +`</div>
                           <div class="outartist">`+data[i].artist.toString() +`</div>


                           `
                       }









                    })
            
                }
            
                getout();


















            }

            document.onkeyup = null;
    }
    }







//rank

    const rankli = document.getElementsByClassName("rankli");
    
    async function getrank(){
        let res = await fetch("http://124.221.249.219:8000/api/ranking",{
        method:"GET",
        })
        let asd = res.json();
        //console.log(asd);

        asd.then(data =>{
        //console.log("数据是",data);
            for(let i=0;i<10;i++){

                rankli[i].innerHTML = `
            <div class="left">
                <div class="rankname">`+data[i].title +`</div>
                    <div><span class="songname">1.`+data[i].top3[0].title +`</span><span class="artist">-`+data[i].top3[0].artist.toString() +`</span></div> 
                    <div><span class="songname">2.`+data[i].top3[1].title +`</span><span class="artist">-`+data[i].top3[1].artist.toString() +`</span></div> 
                    <div><span class="songname">3.`+data[i].top3[2].title +`</span><span class="artist">-`+data[i].top3[2].artist.toString()  +`</span></div>
            </div>

            <div class="right">
                <img src="`+data[i].cover +`" width="110px" height="110px">
                <span class="update">每`+data[i].update_frequence +`更新</span>
                <span class="listennum">▶`+data[i].views +`</span>
            </div>
                
                
                
                `
            }




        })

    }

    getrank();



}