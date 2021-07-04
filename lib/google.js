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

    //     console.log(items);

    let simpleItems = items.map((item) => {
      const fixDate = (badDate) => {
        const newDate = new Date(badDate);
        newDate.setDate(newDate.getDate() - 1);
        return newDate.toISOString().slice(0, 10);
      };

      //       console.log(endDate);

      return {
        summary: item.summary,
        id: item.id,
        description: item.description,
        created: item.created,
        updated: item.updated,
        start: item.start.dateTime ?? item.start.date,
        end: item.end.dateTime ?? fixDate(item.end.date)
      };
    });
    return simpleItems;
  } catch (error) {
    console.log(`Error at getEvents --> ${error}`);
    return 0;
  }
};
