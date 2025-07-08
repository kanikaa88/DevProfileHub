require("dotenv").config(); // ✅ Load .env file at the top
const sendEmail = require("./utils/sendEmail");

const recipients = [
  "kanika.sunaria.22cse@bmu.edu.in"
];

Promise.all(
  recipients.map((email) =>
    sendEmail(
      email,
      "Test Subject",
      "<p>Hello from DevProfileHub mote fatty kitty!</p>",
      "Hello from DevProfileHub mote fatty kitty!"
    )
  )
)
  .then(() => {
    console.log("✅ Test email sent to all");
  })
  .catch((err) => {
    console.error("❌ Test email failed:", err);
  });
