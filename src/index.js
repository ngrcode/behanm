import React from "react";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";

// layout
import Layout from "../src/infrastructure/layout/layout";

// configs
import i18n from "./configs/locales/locales";

// services
import * as serviceWorker from "./serviceWorker";

// css
import "./index.css";

ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <Layout />
    </I18nextProvider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
