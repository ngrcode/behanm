import React from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";

const trans = "schools.header.schoolListHeader";

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(2)
    }
}));
function SchoolListHeader(props) {
    const classes = useStyles();
    const { t: translate, onDialog } = props;

    return (
        <div className={classes.root}>
            <Box display="flex">
                <Box flexGrow={1}>
                    <Typography variant="h6" component="h6">
                        {translate(`${trans}.title`)}
                    </Typography>
                </Box>
                <Box flexGrow={0}>
                    <Button variant="contained" color="primary" onClick={onDialog}>
                        {translate(`${trans}.create`)}
                    </Button>
                </Box>
            </Box>
        </div>
    );
}

SchoolListHeader.propTypes = {
    onDialog: PropTypes.func.isRequired
};

export default withTranslation("school")(SchoolListHeader);
