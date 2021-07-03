const { google } = require("googleapis");
const dotenv = require("dotenv").config();
const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

// const getCalendars = async () => {
//   const calendars = await calendar.calendarList.list();
//   console.log(calendars.data.items);
// };

// getCalendars();

const calendarId = process.env.MY_CALENDAR_ID;

module.exports = async function getCalendarEvents(dateTimeStart, dateTimeEnd) {
  try {
    let response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: dateTimeStart,
      timeMax: dateTimeEnd,
      timeZone: "Australia/Melbourne"
    });

    let items = response["data"]["items"];
    let simpleItems = items.map((item) => {
      return {
        summary: item.summary,
        description: item.description,
        created: item.created,
        updated: item.updated,
        start: item.start.dateTime,
        end: item.end.dateTime
      };
    });
    return simpleItems;
    //     console.log(items);
  } catch (error) {
    console.log(`Error at getEvents --> ${error}`);
    return 0;
  }
};
