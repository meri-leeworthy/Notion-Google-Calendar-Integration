const dotenv = require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

const database_id = process.env.NOTION_DATABASE_ID;

module.exports = async function getNotionEvents() {
  const payload = {
    path: `databases/${database_id}/query`,
    method: "POST"
  };

  const { results } = await notion.request(payload);

  const events = results.map((event) => {
    return {
      id: event.id,
      title: event.properties.Name.title[0].text.content,
      date: event.properties.Date.date.start
    };
  });

  return events;
};
