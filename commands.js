const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
const dotenv = require('dotenv')
const commands = [
  {
    name:'add',
    description: 'for adding two numbers',
    options:[
        {
            name:'first-number',
            description:'Enter first number',
            type: ApplicationCommandOptionType.Number,
            choices:[{
                name:'one',
                value:1
            },{
                name:'two',
                value:2
            },{
                name:'three',
                value:3
            }],
            required:true
        },
        {
            name:'second-number',
            description:'Enter second numnber',
            type:ApplicationCommandOptionType.Number,
            required:true
        }
    ]
  },
  {
    name:'weather',
    description:'Gives you weather for a particular location',
    options:[{
        name:'city-name',
        description:'Name of your city',
        type: ApplicationCommandOptionType.String
    }]
  },
  {
    name:"books",
    description:'Recommend you books based on your search',
    options:[{
      name:'keyword',
      description:'Any specific keywords that belongs to the book',
      type:ApplicationCommandOptionType.String
    },{
      name:'author',
      description:'Name of the author',
      type:ApplicationCommandOptionType.String
    },{
      name:'title',
      description:'title of the book',
      type:ApplicationCommandOptionType.String
    },{
      name:'count',
      description:'number of book recommendation you want',
      type:ApplicationCommandOptionType.String
    }]
  }
];
dotenv.config()
const rest = new REST({ version: '10' }).setToken(process.env.AUTH_TOKEN);

(async ()=>{
    try {
        console.log('Started refreshing application (/) commands.');
      
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
      
        console.log('Successfully reloaded application (/) commands.');
      } catch (error) {
        console.error(error);
      }
})()
