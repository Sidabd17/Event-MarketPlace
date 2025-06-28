const cron = require("node-cron");
const sendEventReminders = require("../Controllers/reminder.controller");

// ⏰ Daily at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("📬 Running daily reminder job...");
  await sendEventReminders();
});
