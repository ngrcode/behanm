import React from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(2),
    },
}));

const trans = "rooms.header.roomListHeader";
function RoomListHeader(props) {
    const classes = useStyles();
    const { t: translate, school } = props;

    return (
        <div className={classes.root}>
            <Box display="flex">
                <Box flexGrow={1}>
                    <Typography variant="h6" component="h6">
                        {translate(`${trans}.title`, { school: school.title })}
                    </Typography>
                </Box>
            </Box>
        </div>
    );
}

RoomListHeader.propTypes = {
    onDialog: PropTypes.func.isRequired,
};

export default withTranslation("room")(RoomListHeader);
