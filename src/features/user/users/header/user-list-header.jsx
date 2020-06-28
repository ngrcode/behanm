import React from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";

const useStyles = makeStyles({
    title: {
        margin: 5
    }
});

const trans = "users.header.userListHeader";

function UserListHeader(props) {
    const classes = useStyles();
    const { t: translate, onCreateDialogToggle } = props;

    return (
        <div style={{ width: "100%" }}>
            <Box display="flex" p={1}>
                <Box p={1} flexGrow={1}>
                    <h4 className={classes.title}>{translate(`${trans}.title`)}</h4>
                </Box>
                <Box p={1}>
                    <Button variant="contained" color="primary" onClick={onCreateDialogToggle}>
                        {translate(`${trans}.button`)}
                    </Button>
                </Box>
            </Box>
        </div>
    );
}
export default withTranslation("user")(UserListHeader);
