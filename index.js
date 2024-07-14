
const {Client , GatewayIntentBits} = require('discord.js')
const express = require('express')
const dotenv = require('dotenv')
const axios = require('axios')
const {getBooks} = require('./modules/books');
const ServerlessHttp = require('serverless-http');
const mongoose = require('mongoose')
const app = express()
var http = require('http');

app.use(express.json())
app.get('/',(req,res)=>{
    res.send('Welcome to bot')
})
//GatewayIntent is to give permission
const client = new Client({ intents: [GatewayIntentBits.Guilds ,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent] });
dotenv.config()
client.login(process.env.AUTH_TOKEN);

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res)=>{
    console.log('connected to mongodb')
}).catch((err)=>{
    console.log("error while connecting.."+err)
})

client.on('messageCreate',(message)=>{
    console.log(message.author)
    if(message.author.bot) {
        return;
    };
    if(message.content.startsWith('create')){
        let url = message.content.split('create')[1]
        console.log(url)
        message.reply('Creating a shorten URL for ' + url)
    }
    console.log(`Hello , message created=> ${message}`)
    message.reply("Hi , I am doby!!")
})

client.on('interactionCreate',async (interaction)=>{
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
      await interaction.reply('Pongu!');
    }

    switch(interaction.commandName){
        case 'ping':
            await interaction.reply('Pongu!');
        case 'create':
            let url = message.content
            console.log(url)
            await interaction.reply('Creating a shorten URL for ' + url)  
        case 'beep':
            await interaction.reply('Boop!!')
        case 'add':
            typeof console.log(interaction.options.get('first-number').value)
            typeof console.log(interaction.options.get('second-number').value)
            let num1 = interaction.options.get('first-number').value
            let num2 = interaction.options.get('second-number').value
            await interaction.reply(`The total is ${num1 + num2}`)
        case 'weather':
            console.log(interaction.options.get('city-name'))
            if(!interaction.options.get('city-name')){
                await interaction.reply('No city specified!!, Please enter city name')
            }
            let city = interaction.options.get('city-name').value
            let currWeather = await findWeather(city);
            console.log(currWeather)
            if(currWeather){
                await interaction.reply(`${city}'s weather right now :- ${currWeather}°C`)
            }else{
                await interaction.reply('City not found!')
            }
        case 'books':
            let queryObj={}
            if(interaction.options.get('keyword').value){
                queryObj['keyword']=interaction.options.get('keyword').value
            }
            if(interaction.options.get('title')?.value){
                queryObj['title']=interaction.options.get('title').value
            }
            if(interaction.options.get('author')?.value){
                queryObj['author']=interaction.options.get('author').value
            }
            queryObj['count']= interaction.options.get('count')?.value ? interaction.options.get('count').value : 10
            
            if(Object.keys(queryObj)?.length){
                try {
                    let books = await findBooks(queryObj);
                    if(books.length){
                        let count = 1
                        let booksStr = books.map((book)=>`${count++}. ${book}`).join('\n')
                        await interaction.reply(`Few books you can read:\n${booksStr}`)
                    }else{
                        await interaction.reply(`Oops! No book found`)
                    }
                } catch (error) {
                    throw error;
                } 
            }else{
                await interaction.reply(`Please fill few options , for better search.`) 
            }
    }
})

async function findWeather(cityName){
    try {
        let queryString=`?key=${process.env.WEATHER_API_KEY}`
        if(cityName){
            queryString+=`&q=${cityName}`
        }

        let res = await axios({
            method:'get',
            url:`${process.env.WEATHER_API_URL}${queryString}`
        })
    
        if(res && res.data){
            console.log(res.data?.current?.temp_c)
            return res.data?.current?.temp_c;
        }
        return  
    } catch (error) {
        console.log(error);
    }
    
    
}

async function findBooks(queryParam){
try {
    return getBooks(queryParam);
} catch (error) {
    console.log(error);
    throw error;
}
}

http.createServer(function (req, res) {
    res.write('Welcome to bot'); //write a response to the client
    res.end(); //end the response
  }).listen(8080); //the server object listens on port 80

module.exports.handler = ServerlessHttp(app)
