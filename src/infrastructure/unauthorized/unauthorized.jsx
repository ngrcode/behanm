import React from "react";
import { Route, Switch } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Register from "../unauthorized/register/register";
import Login from "../unauthorized/login/login";
import NotFound from "../not-found/not-found";

function Unauthorized() {
    return (
        <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route path="/**" component={NotFound} />
        </Switch>
    );
}

export default withTranslation("infrastructure")(Unauthorized);
