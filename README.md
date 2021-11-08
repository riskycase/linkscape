# [Linkscape](https://linkscape.firebaseapp.com/)

## Link sharing hub for universities built with React

### Setup

Login with firebase-cli and set up hosting, firestore and realtime database for
this repo. On firebase console enable authentication, firestore and realtime
database, then push to default branch to deploy if you set up CI.

### Usage

The main link list is available to all users, sorted by course. Anyone can
access the links without signing in. Adding links requires a signed in user.

The site has inbuilt support for reporting of links as incorrect, spam, etc,
which is also restricted to signed users to prevent abuse. The report system by
default limits one report per user, and a person with moderator role can view
all the reports in a seperate moderator dashboard.

A seperate admin panel is also provided, which requires manually setting the
value of admin key to true in a user's entry under firestore console. Admins
can then appoint or dismiss moderators, add and edit courses present in
firestore without having to access the console.

Moderators are given access to delete another person's link or dismiss the
reports of that link as invalid.

### `create-react-app` documentation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
