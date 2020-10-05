Reddit newsletter service with potential Slack integration.

Prerequisite: [Docker compose](https://docs.docker.com/compose/install/)

Preferences are stored in Redis in persistence mode for fast and convenient access. The persistence mode guarantees that data is kept on disk after restart, similar to a traditional database.

On startup, existing preferences are loaded and crons are setup accordingly.

User can create / update their preferences by sending POST to the upsertPreference endpoint.

Body parameters are validated with default values (see swagger docs for details)

To activate / deactive the newsletter, simply toggle `active` flag to true/false.

Sending can be done via the mocked email / Slack service. More sending mechanism can be added by extending the app using the same service-based approach.

To run: `docker-compose up --build` --> go to `http://localhost:8081/docs/`
