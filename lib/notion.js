const dotenv = require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

const database_id = process.env.NOTION_DATABASE_ID;
const name_id = process.env.NOTION_NAME_ID;
const description_id = process.env.NOTION_DESCRIPTION_ID;
const date_id = process.env.NOTION_DATE_ID;
const id_id = process.env.NOTION_ID_ID;

const formatPage = ({ title, id, description, start, end }) => {
  const formattedPage = {
    properties: {
      //event name
      [name_id]: {
        title: [
          {
            type: "text",
            text: {
              content: title
            }
          }
        ]
      },
      //event id
      [id_id]: {
        rich_text: [
          {
            type: "text",
            text: {
              content: id
            }
          }
        ]
      },
      //event desription
      [description_id]: {
        rich_text: [
          {
            type: "text",
            text: {
              content: description
            }
          }
        ]
      },
      //event start and end datetime
      [date_id]: {
        date: {
          start
        }
      }
    }
  };
  end ? (formattedPage.properties[date_id].date.end = end) : null;
  return formattedPage;
};

module.exports.getEventDictionary = async function getEventDictionary() {
  //request pages from the calendar
  const payload = {
    path: `databases/${database_id}/query`,
    method: "POST"
  };
  const { results } = await notion.request(payload);

  //function that gets the Google Calendar ID for a given event
  const gCalId = (event) => {
    return event.properties.ID?.rich_text[0]?.text.content;
  };

  //create a dictionary that maps Google Calendar IDs to Notion page IDs
  const gCalLookup = {};
  results.forEach((event) => {
    gCalId(event) ? (gCalLookup[gCalId(event)] = event.id) : null;
  });

  return gCalLookup;
};

module.exports.getDatabase = async function getDatabase() {
  const response = await notion.databases.retrieve({
    database_id
  });
  console.log(response);
};

module.exports.createEvent = async function createEvent(event) {
  const newEvent = formatPage(event);
  newEvent.parent = {};
  newEvent.parent.database_id = database_id;

  notion.pages.create(newEvent);
};

module.exports.updateEvent = async function updateEvent(event, id) {
  const updatedEvent = formatPage(event);
  updatedEvent.page_id = id;
  notion.pages.update(updatedEvent);
};
