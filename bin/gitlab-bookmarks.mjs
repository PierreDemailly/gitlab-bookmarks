#!/usr/bin/env node

/* eslint-disable max-len */
import "dotenv/config";

// Import Node.js Dependencies
import fs from "node:fs";
import path from "node:path";
import { EOL } from "node:os";

// Import Third-party Dependencies
import { Headers, request } from "@myunisoft/httpie";
import pupa from "pupa";
import { confirm, question } from "@topcli/prompts";
import { Spinner } from "@topcli/spinner";

// CONSTANTS
const kGitLabApiUrl = "https://gitlab.com/api/v4/";
const kTimestamp = Date.now();
const kRequestOptions = {
  authorization: process.env.GITLAB_TOKEN
};
const kGroupRequestUrl = new URL("groups", kGitLabApiUrl);
const kProjectsRequestUrl = (projectId) => new URL(`groups/${projectId}/projects`, kGitLabApiUrl);
const kGitLabIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACd0lEQVQ4jW2TQY9UVRCFv1P39eue6YlkaHoM2BppaAd3JiQkSnSERBcG0Y1uMIGNDiTKD8BIxhD+ABsG16xYmUDYyF9w4YoYyEwIY5ywgXQyI9P9bhWLnict8SSVVE7Vrbq3bh0CBLB+cvH8o48HywA1N42ae3zynW83pvJMEAFm0k9m6QKAIF4t8JKz793SpRUwQRjAxonDH5bSARfv/vn+20d2q9tUdwNYO35wMcRi0/TWuaVDS7AbcIozTSnaycqZmdapV7vXaJTl6bZZ2TCFpeJrANv89PUFjC+2siuCAL68BUngU9f3W5BCfO7AdnYFOv3wg0MLWj9+ZHmmZasjPBOYhEfodxGVS5NhRoRQIcXRCAzwJpa2dvyHotOPs2x7jJ5OpolIraRj+s9HiACeexBOKMHMHo/WrH+jfHGQAe1siWd/S6MtRSrC60O7TwAgV2GNWWn+gEez7YDcwhkSRLPt7DvozHWCnJU8SDAxj0g5K811oNvPtOY8CEVkDQ24a2WycI1NxHzP2dvzkMB9YpLY28sx33NMEZ5VWWkGfsdSVJeqnXw/NVMJZM/Q7oS6fY+yIMqC6PY92p2QZwDl1EplteP3x7m6LIDt8703ymL2l9S0z3yUszsYJO9ONtieICeyEkoNszz226PxPxdmVzf+UoDqNR1fHPxo6IolVO2nsjcjRQAb5LSpwqtw4HK69uBqrQVNC0UQ4+XBJ+k9rWq/+nnoFUB6zQrfjHX/o/qucX3t3nS+1Y4gYgVr3Hjw2/MFX8rDfDu1rEhNK/Iw/2pd/6hxfe1erExE9H+CmyzdV6TazzcHV/LNwz//G1t5KbAaLwDgSB0zlEKSLwAAAABJRU5ErkJggg==";

const { data: groups } = await request("GET", kGroupRequestUrl, kRequestOptions);

const bookmarks = [];

for (const group of groups) {
  let includeArchived;
  const spinner = new Spinner({ name: "line" }).start(`Fetching ${group.name}`);
  const { data: projects } = await request("GET", kProjectsRequestUrl(group.id), kRequestOptions);
  spinner.succeed();

  if (projects.length === 0) {
    continue;
  }

  bookmarks.push(`\t<DT><H3 ADD_DATE="${kTimestamp}" LAST_MODIFIED="${kTimestamp}">${group.name}</H3>`);
  bookmarks.push("\t<DL><p>");

  for (const project of projects) {
    if (project.archived) {
      if (includeArchived === undefined) {
        includeArchived = await confirm(`Do you want to include ${group.name} archived projects?`);
      }

      if (!includeArchived) {
        continue;
      }
    }

    bookmarks.push(`\t\t<DT><A HREF="${project.web_url}" ADD_DATE="${kTimestamp}" LAST_MODIFIED="${kTimestamp}" ICON="${kGitLabIcon}">${project.name}</A>`);
  }

  bookmarks.push("\t</DL><p>");
}

const template = fs.readFileSync(new URL("../template.html", import.meta.url), "utf-8");
const bookmarksRaw = pupa(template, { bookmarks: bookmarks.join(EOL) });

const defaultFilename = `bookmarks-gitlab-${Date.now()}.html`;
const filename = await question("Enter the filename", { defaultValue: defaultFilename });
const formattedFilename = filename.endsWith(".html") ? filename : `${filename}.html`;

fs.writeFileSync(formattedFilename, bookmarksRaw);

console.log(`${EOL}Successfully generated bookmarks at ${path.join(process.cwd(), formattedFilename)}`);
