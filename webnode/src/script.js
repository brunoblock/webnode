import { store } from "./redux";
import appActions from "./redux/actions/app-actions";

// exports.start = () => {
// console.log("when loaded as an npm module");
// store.dispatch(appActions.startApp());
// };

if (!module.parent) {
  console.log("Oyster Webnode Initiated!");
  store.dispatch(appActions.startApp());
}
