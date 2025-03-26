# Zebra Safari

Zebra Safari is a simple React application designed to visualize data as a table. It uses tools like D3.js for data manipulation, React for the user interface, Shadcn for UI components, and Cypress for testing.

## Tech Stack

- **React**: For building the UI components.
- **D3.js**: For data visualization and manipulation.
- **Shadcn**: For reusable UI components.
- **Cypress**: For end-to-end (E2E) testing.

## Getting Started

### Running the App with Docker

To run the app in a Docker container, use the following command:

```bash
make docker/frontend
```

This comand will run app in dev mode. It should be accessible via: [http://localhost:5173/](http://localhost:5173/)

### Using App

On the first run, some data will be genereated.
Users can then manipulate this data by clicking on the table rows.

In the settings section output can be customized a bit.

Users can also input own data by clicking on the Switch toggle and pasting valid data to input field.

## Run App Locally

### Run Dev

First install dependencies:

```bash
make setup
```

Then:

```bash
make run/dev
```

Open app in web browser.

### Run Preview

First create build:

```bash
make build
```

Then:

```bash
make preview
```

Open app in web browser.

## Tests

To run tests:

```bash
make run/tests
```

## E2E tests

First run:

```bash
make e2e/setup
```

Then

```bash
make e2e/run
```

E2E tests should pass.

If visible change is made to the app, tests should fail.
Diff images can be found in /e2e/cypress/screenshots/diff folder.

Diff image highlights changes betweeen reference and actual image.

Example of reference screenshoot of this app:
![Reference-Image](e2e/cypress/reference-screenshots/basic/filters.spec.ts/filters%20--%20should%20apply%20filters%20[mobile-size].png 'Reference')

## Other

Check Makefile for more useful commands.
