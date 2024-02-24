const express = require("express");
const router = express.Router();
const firebaseUtils = require("../Firebase/firebaseUtils");

router.get("/", (req, res) => {
  const lang = req.session.lang || "en";
  const translations = require(`../locales/${lang}.json`);
  res.render("home", { lang: req.session.lang || "en" });
});

router.get("/about-us", (req, res) => {
  res.render("home", { lang: req.session.lang || "en", anchor: "about-us" });
});

router.get("/dashboard", async (req, res) => {
  try {
    const sensorData = await firebaseUtils.getSensorData();
    const espSleepMode = await firebaseUtils.getEspSleepModeStatus();

    res.render("dashboard", {
      sensorData,
      espSleepMode,
    });
  } catch (error) {
    console.error("Failed to fetch sensor data:", error);
    res.status(500).send("Error fetching data");
  }
});

router.get("/contact-us", (req, res) => {
  res.render("contact-us", { lang: req.session.lang || "en" });
});

router.post("/contact-us", async (req, res) => {
  await saveContactData(req.body);
  res.redirect("/");
});

router.get("/switch-language/:lang", (req, res) => {
  req.session.lang = req.params.lang;
  res.redirect("back");
});

module.exports = router;
