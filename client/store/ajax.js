function forMatData(data){
    let str = '';
    for(let a in data){
        if(typeof data[a] =='object')
        {
            str = str + a + '=' + JSON.stringify(data[a]) + '&';
        }
        else
        {
            str = str + a + '=' + data[a] +'&';
        } 
    }
    return str
}

const Ajax = {
    get(url,callback){
        let xhr = new XMLHttpRequest();
        xhr.open('get',url,true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
        xhr.setRequestHeader("Access-Control-Allow-Origin","*")
        xhr.send();
        xhr.onreadystatechange = function()
        {
            if(xhr.readyState == 4 && xhr.status == 200)
            {
                callback(xhr.responseText);
            }
        }
    },
    post(url,data,callback){
        let xhr = new XMLHttpRequest();
        xhr.open('post',url,true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.send(forMatData(data));
        xhr.onreadystatechange = function()
        {
            if(xhr.readyState == 4 && xhr.status ==200)
            {
                callback(JSON.parse(xhr.responseText));
            }
        }
    }

}

export default Ajax
