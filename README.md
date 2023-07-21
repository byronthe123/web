This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

{
  "name": "gogo-react",
  "version": "4.2.5",
  "description": "Gogo - React Bootstrap 4 Admin Dashboard Template",
  "private": true,
  "jest": {
    "transformIgnorePatterns": [
      "node_modules/(?!(jest-)?office-ui-fabric-react|rc-switch|react-datepicker|react-chat-widget)"
    ]
  },
  "dependencies": {
    "@azure/communication-calling": "^1.1.0-beta.1",
    "@azure/communication-chat": "^1.0.0",
    "@azure/communication-common": "^1.0.0",
    "@azure/communication-identity": "^1.0.0",
    "@azure/msal-browser": "^2.14.1",
    "@azure/msal-react": "^1.0.0-beta.2",
    "@fluentui/react": "^8.16.0",
    "@fluentui/react-icons-northstar": "^0.56.0",
    "@fullcalendar/core": "^5.3.0",
    "@fullcalendar/daygrid": "^5.3.0",
    "@fullcalendar/interaction": "^5.3.0",
    "@fullcalendar/react": "^5.3.0",
    "@fullcalendar/timegrid": "^5.3.0",
    "@glidejs/glide": "^3.3.0",
    "@iconify/icons-mdi": "^1.0.107",
    "@iconify/react": "^1.1.3",
    "@material-ui/core": "^4.11.0",
    "@material-ui/lab": "^4.0.0-alpha.56",
    "@microsoft/microsoft-graph-client": "^2.0.0",
    "@react-hook/window-size": "^3.0.7",
    "@testing-library/jest-dom": "^5.12.0",
    "@testing-library/react": "^11.2.6",
    "@testing-library/user-event": "^13.1.8",
    "animate.css": "^4.1.0",
    "availity-reactstrap-validation": "^2.6.1",
    "axios": "^0.18.1",
    "chart.js": "2.7.2",
    "chartjs-plugin-datalabels": "^1.0.0",
    "classnames": "2.2.6",
    "desktop-screenshot": "^0.1.1",
    "dotenv": "^8.2.0",
    "firebase": "^7.14.6",
    "formik": "^1.5.8",
    "history": "^5.0.0",
    "html2canvas": "^1.0.0-rc.5",
    "jest": "^27.1.0",
    "jest-canvas-mock": "^2.3.1",
    "js-file-download": "^0.4.12",
    "json2csv": "^5.0.6",
    "jspdf": "^1.5.3",
    "moment": "^2.27.0",
    "moment-timezone": "^0.5.31",
    "mousetrap": "^1.6.5",
    "msal": "^1.3.1",
    "msw": "^0.28.2",
    "office-ui-fabric-react": "^7.170.1",
    "rc-progress": "^3.1.3",
    "rc-slider": "^8.6.1",
    "rc-switch": "^1.6.0",
    "react": "^16.13.1",
    "react-albus": "^2.0.0",
    "react-animated-weather": "^4.0.1",
    "react-autosuggest": "^9.3.4",
    "react-beautiful-dnd": "^13.1.0",
    "react-big-calendar": "^0.22.1",
    "react-chartjs-2": "^2.9.0",
    "react-chat-ui": "^0.4.0",
    "react-chat-widget": "^3.0.5",
    "react-circular-progressbar": "^2.0.2",
    "react-clipboard.js": "^2.0.16",
    "react-contextmenu": "^2.9.4",
    "react-datepicker": "^1.8.0",
    "react-day-picker": "^7.4.8",
    "react-dom": "^16.13.1",
    "react-dropzone-component": "^3.2.0",
    "react-file-base64": "^1.0.3",
    "react-google-maps": "^9.4.5",
    "react-image-crop": "^8.6.6",
    "react-image-lightbox": "^5.1.1",
    "react-input-auto-tab": "0.0.5",
    "react-intl": "2.4.0",
    "react-json-view": "^1.21.3",
    "react-lines-ellipsis": "^0.14.1",
    "react-loader-spinner": "^3.1.14",
    "react-loading-overlay": "^1.0.1",
    "react-new-window": "^0.1.2",
    "react-notifications": "^1.6.0",
    "react-notifications-component": "^3.1.0",
    "react-page-visibility": "^6.2.0",
    "react-pdf": "^4.2.0",
    "react-perfect-scrollbar": "^1.5.8",
    "react-player": "^2.1.1",
    "react-quill": "^1.3.5",
    "react-rater": "^5.0.3",
    "react-redux": "^7.2.0",
    "react-router-dom": "^5.2.0",
    "react-scripts": "^3.4.4",
    "react-select": "^2.4.4",
    "react-signature-canvas": "^1.0.3",
    "react-skycons": "^0.7.0",
    "react-sortablejs": "^1.3.6",
    "react-spinners": "^0.9.0",
    "react-table": "^6.11.5",
    "react-tagsinput": "^3.19.0",
    "react-tippy": "^1.4.0",
    "react-toast-notifications": "^2.4.4",
    "react-tooltip": "^4.2.6",
    "react-transition-group": "^4.4.1",
    "react-virtualized": "^9.21.2",
    "react-vis": "^1.11.7",
    "react-webcam": "^5.2.0",
    "react-yandex-maps": "^3.0.2",
    "reactour": "^1.18.3",
    "reactstrap": "^8.4.1",
    "redux": "^4.0.5",
    "redux-saga": "^1.0.2",
    "socket.io-client": "^2.3.0",
    "socket.io-mock": "^1.3.2",
    "sortablejs": "^1.10.2",
    "styled-components": "^4.4.1",
    "suneditor-react": "^2.16.3",
    "survey-react": "^1.7.19",
    "testing-library": "0.0.2",
    "use-sound": "^3.0.1",
    "uuid": "^3.4.0",
    "video-react": "^0.14.1",
    "video.js": "^7.8.2",
    "yup": "^0.27.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "homepage": "https://eos-web.azurewebsites.net",
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ],
  "devDependencies": {
    "node-sass": "^4.14.1"
  }
}
# web
