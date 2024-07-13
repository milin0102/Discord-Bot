const {Client} = require('@elastic/elasticsearch')
dotenv.config()
const client = new Client({node:process.env.ES_NODE_URL})

