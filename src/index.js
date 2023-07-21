import "./assets/css/vendor/bootstrap.min.css";
import "./assets/css/vendor/bootstrap.rtl.only.min.css";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-table/react-table.css";
import 'react-image-lightbox/style.css';
import 'react-toastify/dist/ReactToastify.css';
import "video.js/dist/video-js.css";
import { isMultiColorActive, defaultColor,themeColorStorageKey,isDarkSwitchActive } from "./constants/defaultValues";
import './assets/css/Custom.css';
import 'react-notifications/lib/notifications.css';
import "rc-switch/assets/index.css";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import 'react-notifications-component/dist/theme.css';
import 'animate.css';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import { initializeIcons } from '@uifabric/icons';
import dayjs from 'dayjs';
import { unregister } from './serviceWorker';
var utc = require('dayjs/plugin/utc')
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
dayjs.extend(utc);

unregister();
initializeIcons();

const color =
  (isMultiColorActive||isDarkSwitchActive ) && localStorage.getItem(themeColorStorageKey)
    ? localStorage.getItem(themeColorStorageKey)
    : defaultColor;

localStorage.setItem(themeColorStorageKey, color);

let render = () => {
  //user selection:
  // import('./assets/css/sass/themes/gogo.' + color + '.scss').then(x => {
  //    require('./AppRenderer');
  // });
  import('./assets/css/sass/themes/gogo.light.greenlime.scss').then(x => {
    require('./AppRenderer');
 });
};
render();