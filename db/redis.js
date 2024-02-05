const redis = require("redis");
const client = redis.createClient();
client.on("ready", () => {
  console.log("Connected to redis database");
});

client.on("error", () => {
  console.log("Error connecting to the redis database");
});

module.exports = client;
