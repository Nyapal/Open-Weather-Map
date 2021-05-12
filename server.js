const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const fetch = require('node-fetch')
require('dotenv').config()

const app = express()
app.use(cors())
const apikey = process.env.OPENWEATHERMAP_API_KEY

const schema = buildSchema(`
type Weather {
	temperature: Float! 
    description: String!
    feels_like: String 
    temp_min: Int 
    temp_max: Int
    pressure: Int
    humidity: Int
    cod: String
    message: String
}
enum Units {
    standard 
    metric 
    imperial
}
type Query {
    getWeather(zip: Int!, units: Units): Weather!
}
`)

const root = {
	getWeather: async ({ zip, units = 'imperical' }) => {
		const apikey = process.env.OPENWEATHERMAP_API_KEY
		const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apikey}&units=${units}`
		const res = await fetch(url)
		const json = await res.json()
		const temperature = json.main.temp
		const description = json.weather[0].description
        const feels_like = json.weather[0].feels_like
        const temp_min = json.weather[0].temp_min 
        const temp_max = json.weather[0].temp_max
        const pressure = json.weather[0].pressure
        const humidity = json.weather[0].humidity
        const cod = json.weather[0].cod 
        const message = json.weather[0].message
        if (temperature == Null) {
            return {cod, message}
        } 
		return { temperature, description, feels_like, temp_min, temp_max, pressure, humidity }
	}
}

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))

export const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache()
  });

// const port = 4000
// app.listen(port, () => {
//   console.log('Running on port:'+port)
// })