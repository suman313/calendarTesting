// const router = require("express").Router();
// const { google } = require("googleapis");
// const url = require("url");
// const axios = require("axios");
import requestID from "express-request-id";
import express from "express";
import { google } from "googleapis";

const router = express.Router();

const refresh_token12 =
  "1//0gV38zVwKE90vCgYIARAAGBASNwF-L9IrJWzF_FVokizaOjMWtf73lpQmUPoZ0SB5wXR2QCvIe00JeuM3DzfQnQyCbuPLEvlF1wA";

const CLIENT_ID =
  "511094446815-6cdhufr6kn6lfectbq3p7bk63dbqad1n.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
// const REDIRECT_URL = "http://localhost:3000";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "http://localhost:3000"
);

const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

// const authorizationUrl = oauth2Client.generateAuthUrl({
//   // 'online' (default) or 'offline' (gets refresh_token)
//   access_type: "offline",
//   scope: scopes,
//   // Enable incremental authorization. Recommended as a best practice.
//   include_granted_scopes: true,
// });

router.get("/", async (req, res, next) => {
  res.send({ message: "Ok api is working 🚀" });
});

router.post("/calendar", async (req, res, next) => {
  try {
    const { code } = req.body;
    const { tokens } = await oauth2Client.getToken(code);
    res.json(tokens);
  } catch (error) {
    next(error);
  }
});

router.post("/create-event", async (req, res, next) => {
  try {
    const { summary, description, location, startDate, endDate } = req.body;
    oauth2Client.setCredentials({ refresh_token: refresh_token12 });
    const calendar = google.calendar("v3");
    const event = {
      summary: summary,
      description: description,
      location: location,
      colorId: "7",
      start: {
        dateTime: new Date(startDate),
      },
      end: {
        dateTime: new Date(endDate),
      },
      conferenceData: {
        createRequest: { requestId: "cDuqqlcEin" },
      },
    };
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: "primary",
      sendNotifications: true,
      conferenceDataVersion: 1,
      resource: event,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/getEvents", async (req, res, next) => {
  try {
    oauth2Client.setCredentials({ refresh_token: refresh_token12 });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const request = {
      calendarId: "primary",
      // eventId: "v0raamllrodf98urit2j3p2qlc@google.com",
      // eventId: "v0raamllrodf98urit2j3p2qlc",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    };
    let response = await calendar.events.list(request);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
// module.exports = router;
