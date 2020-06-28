import React from "react";
import { withTranslation } from "react-i18next";

function NotFound() {
    return <p>NotFound Page</p>;
}

export default withTranslation("infrastructure")(NotFound);
