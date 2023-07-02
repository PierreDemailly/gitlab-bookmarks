# gitlab-bookmarks

![version](https://img.shields.io/badge/dynamic/json.svg?style=for-the-badge&url=https://raw.githubusercontent.com/PierreDemailly/gitlab-bookmarks/main/package.json&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)](https://github.com/PierreDemailly/gitlab-bookmarks/graphs/commit-activity)
[![mit](https://img.shields.io/github/license/PierreDemailly/gitlab-bookmarks?style=for-the-badge)](https://github.com/PierreDemailly/gitlab-bookmarks/blob/main/LICENSE)

Generate bookmarks including all projects in your GitLab groups.

## Requirements
- [Node.js](https://nodejs.org/en/) v16 or higher

## Getting Started

Go anywhere you want the bookmarks to be generated:

```bash
cd
mkdir myAwesomeBookmarks
cd myAwesomeBookmarks
```

Run the tool

```bash
npx gitlab-bookmarks
```

It will generate a `.html` file at `~/myAwesomeBookmarks` (or in the directory you ran the tool).

Go to [Chrome bookmarks](chrome://bookmarks/) and import the generated html file.

> **Note** Generated bookmarks should be compatible with most browsers.

> **Note** The tool fetch maximum 20 projects

## Authentication

If may wanna authenticate to the API to have access to private groups/projects and don't be annoyed by **rate limits**

Create a `.env`

```bash
touch .env
```

Add this following ENV variable

```bash
# GitHub access token
GITLAB_TOKEN=your_token
```
You can create a GitLab token [here](https://gitlab.com/-/profile/personal_access_tokens)
