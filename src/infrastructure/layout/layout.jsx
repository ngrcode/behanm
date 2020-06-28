import React, { useState, useEffect, useCallback } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { DoranToast, EventBus } from "@doran/react";
import RTL from "../../configs/rtl/rtl";
import Authorized from "../authorized/authorized";
import Unauthorized from "../unauthorized/unauthorized";
import ProtectedRoute from "../../shared/routes/protected-route";

const theme = createMuiTheme({
    direction: "rtl"
});

function Layout() {
    const [toastInitialized, setToastInitialized] = useState(false);
    const [toast, setToast] = useState({
        open: false,
        detail: { variant: "success" }
    });

    useEffect(() => {
        window.EventBus = new EventBus();
    }, []);

    const handleToastOpen = useCallback(
        (event) => {
            const clonedToast = { ...toast };
            clonedToast.open = true;
            clonedToast.detail = event.detail;

            setToast(clonedToast);
        },
        [toast]
    );

    const handleToastClose = useCallback(
        (event) => {
            const clonedToast = { ...toast };
            clonedToast.open = false;

            setToast(clonedToast);
        },
        [toast]
    );

    useEffect(() => {
        if (toastInitialized) {
            return;
        }

        window.EventBus.addEventListener("open-toast", (event) => handleToastOpen(event));
        window.EventBus.addEventListener("close-toast", (event) => handleToastClose(event));
        setToastInitialized(true);
    }, [toastInitialized, handleToastOpen, handleToastClose]);

    return (
        <RTL>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <React.Fragment>
                        <DoranToast open={toast.open} onClose={handleToastClose} {...toast.detail} />
                        <Switch>
                            <Route path="/(login|register)" component={Unauthorized} />
                            <ProtectedRoute path="/" component={Authorized} />
                        </Switch>
                    </React.Fragment>
                </BrowserRouter>
            </ThemeProvider>
        </RTL>
    );
}

export default withTranslation("infrastructure")(Layout);
