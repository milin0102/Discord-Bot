const dotenv = require('dotenv')
dotenv.config()
const axios = require('axios')
async function getBooks(queryParams){
    try {
        let q=false
    let googleBooksUrl = `${process.env.GOOGLE_BOOKS_URL}?key=${process.env.GOOGLE_API_KEY}`
    if(queryParams.maxResults && queryParams.maxResults<20){
        googleBooksUrl+=`&maxResults=${queryParams.maxResults}`
    }
    if(queryParams.title){
        googleBooksUrl+=`&q=intitle:${queryParams.title}`
        q=true
    }
    if(queryParams.author){
        if(!q){
            googleBooksUrl+=`&q=inauthor:${queryParams.author}` 
            q=true
        }else{
            googleBooksUrl+=`+inauthor:${queryParams.author}`
        }
    }
    if(queryParams.keyword){
        if(!q){
            googleBooksUrl+=`&q=${queryParams.keyword}` 
            q=true
        }else{
            googleBooksUrl+=`+${queryParams.keyword}`
        } 
    }
    console.log(googleBooksUrl)
    // get call
    let res = await  axios({
        method:'GET',
        url:googleBooksUrl
    }).catch((error)=>{
        console.log(error);
        throw error;
    })
    let recommendedTitles = []
    //console.log(res)
    if(res.data.items?.length){
        for(const item of res.data.items){
            console.log(item)
            if(item.volumeInfo && item.volumeInfo?.title){
                recommendedTitles.push(item.volumeInfo.title)
            }
        }
    }
    return recommendedTitles;
    } catch (error) {
        console.log(error);
        throw error;
    }   
}

module.exports = {
    getBooks
}

