## Installation

- install [Nodejs](https://nodejs.org/en/)
- install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
- install [Docker](https://www.docker.com/products/docker-desktop/)
- install [Docker-compose](https://docs.docker.com/compose/install/)

## Setup

open `.env` file in the `api` folder, and add your storyblok account token

```
STORYBLOK_TOKEN=<token>
```

## Start services

```ssh
cd api && yarn && docker-compose up -d redis && yarn start:dev
```

```ssh
cd client && yarn && yarn dev
```

## Api documentation

`localhost:3000/content/management/replace`

The above endpoints creates the job that fetches and replaces content in a storyblok space

 ### API payload

 ```
 token = <storyblok space token>
 text = <the text we want to replace>
 replacement = <text we would be replacing with>
 ```

