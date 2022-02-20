window.onload = function(){
    let play = document.getElementById("play");
    let video = document.getElementById("video");

    let mvId = localStorage.getItem("mvId");

    //请求MV的url
    async function getmvurl(){
        let res = await fetch("http://redrock.udday.cn:2022/mv/url?id="+`${mvId}`,{
        method:"POST",
        })
        let asd = res.json();

        asd.then(data =>{
            video.src = data.data.url;
            localStorage.removeItem("mvId");
        })

    }

    getmvurl();

    play.onclick = function(){

        if(video.paused){
            video.play();
            play.innerText = "||"
        }else{
            video.pause();
            play.innerText = "▶"
        }
        
    }




}