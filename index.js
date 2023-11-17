const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const user = require("./model/user.js");
const schedule = require("node-schedule");
const connectDatabase = require("./config/database.js");
const seedToken = require("./Controller/tokenController.js");
require("dotenv").config({ path: "./config/config.env" });
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });
const app = require("./app");

connectDatabase();
// Assuming you have a list of subscribed users
const subscribedUsers = [];
// seedToken();

// Function to subscribe a user
const subscribeUser = async (userId) => {
  try {
    await user.updateOne({ userId }, { $set: { subscribed: true } });
  } catch (error) {
    console.error("Error subscribing user:", error.message);
  }
};
// Function to unsubscribe a user
const unsubscribeUser = async (userId) => {
  try {
    await user.updateOne({ userId }, { $set: { subscribed: false } });
  } catch (error) {
    console.error("Error unsubscribing user:", error.message);
  }
};

// Function to check if a user is subscribed
const isUserSubscribed = async (userId) => {
  try {
    const userData = await user.findOne({ userId });
    return userData ? userData.subscribed : false;
  } catch (error) {
    console.error("Error checking subscription status:", error.message);
    return false;
  }
};

// Function to send a message
const sendMessage = async (chatId, text) => {
  try {
    await bot.sendMessage(chatId, text);
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
};

bot.on("message", async (msg) => {
  console.log(msg);
  const userId = msg.chat.id;
  const userCity = msg.text;
  const name = msg.chat.first_name + " " + msg.chat.last_name;
  if(userCity=="/subscribe" || userCity=="/unsubscribe")
  return;
  try {
    const checkUser = await user.findOne({ userId });
    // console.log(checkUser);
    // Check if the user is subscribed
    const isSubscribed = checkUser?.subscribed ? true : false;
    // console.log("checkUser.subscribed",checkUser.subscribed)

    // console.log("checker-1");

    const checker = isSubscribed?'To unsubscribe our daily weather report, use "/unsubscribe" command ':"You are not subscribed to daily weather updates. To subscribe, use the /subscribe command."
    // console.log("checker-2");
    console.log(userCity);
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${process.env.URL}`
    );
    console.log(response);
    const data = response.data;
    const weather = data.weather[0].description;
    const temperature = data.main.temp - 273.15;
    const city = data.name;
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const windSpeed = data.wind.speed;
    const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(
      2
    )}°C. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s ${checker}`;

    // Update or create user data
    if (!checkUser) {
      // Create user
      user.create({
        userId,
        name,
        userCity,
        subscribed: true,
        subscriberId: [user._id],
      });
    } else {
      // Update the user city
      user
        .updateOne({ userId }, { $set: { userCity } })
        .then((err) => console.log(err));
    }

    console.log(userId, userCity);
    bot.sendMessage(userId, message);
  } catch (error) {
    bot.sendMessage(userId, "City doesn't exist.");
  }
});

// Handle subscription logic
bot.onText(/\/subscribe/, async (msg) => {
  const userId = msg.chat.id;
  const isSubscribed = await isUserSubscribed(userId);  

  if (!isSubscribed) {
    subscribeUser(userId);
     return sendMessage(userId, "You are now subscribed to daily weather updates!");
  } else {
    sendMessage(userId, "You are already subscribed.");
  }
});
// Handle unsubscription logic
bot.onText(/\/unsubscribe/, async (msg) => {
  const userId = msg.chat.id;
  const isSubscribed = await isUserSubscribed(userId);

  if (isSubscribed) {
    unsubscribeUser(userId);
    return  sendMessage(userId, "You have unsubscribed from daily weather updates.");
  } else {
    sendMessage(userId, "You are not currently subscribed.");
  }
});

// Schedule the daily weather update at 7 am
const dailyWeatherUpdateJob = schedule.scheduleJob("0 7 * * *", async () => {
  try {
    // Fetch all subscribed users
    const subscribedUsers = await user.find({ subscribed: true });

    // Iterate through each subscribed user
    for (const userData of subscribedUsers) {
      const userId = userData.userId;
      const userCity = userData.userCity;

      // Fetch weather data for the user's city
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${process.env.URL}`
      );
      const data = response.data;
      const weather = data.weather[0].description;
      const temperature = data.main.temp - 273.15;
      const city = data.name;
      const humidity = data.main.humidity;
      const pressure = data.main.pressure;
      const windSpeed = data.wind.speed;

      // Compose the weather update message
      const message = `Good morning! Here's your daily weather update for ${city}: ${weather} with a temperature of ${temperature.toFixed(
        2
      )}°C. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s.`;

      // Send the weather update to the user
      await sendMessage(userId, message);
    }
  } catch (error) {
    console.error("Error sending daily weather updates:", error.message);
  }
});


app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});

