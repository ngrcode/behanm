import React from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";

const trans = "classPrograms.header.classProgramListHeader";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(2)
    }
}));
function ClassProgramListHeader(props) {
    const classes = useStyles();
    const { t: translate, onDialog, onShowColumnsChange, homeClass, showSecondThreeColumns } = props;

    return (
        <div className={classes.root}>
            <Box display="flex">
                <Box flexGrow={1}>
                    <Typography variant="h6" component="h6">
                        {translate(`${trans}.title`, { title: homeClass.title, year: homeClass.year })}
                    </Typography>
                </Box>
                <Box flexGrow={0}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showSecondThreeColumns}
                                onChange={() => onShowColumnsChange()}
                                name="showSecondThreeColumns"
                                color="primary"
                            />
                        }
                        label={<span style={{ fontSize: "10px" }}>{translate(`${trans}.showSecondThreeColumns`)}</span>}
                    />

                    <Button variant="contained" color="primary" onClick={onDialog}>
                        {translate(`${trans}.create`)}
                    </Button>
                </Box>
            </Box>
        </div>
    );
}

ClassProgramListHeader.propTypes = {
    onDialog: PropTypes.func.isRequired,
    homeClass: PropTypes.object.isRequired,
    showSecondThreeColumns: PropTypes.bool.isRequired
};

export default withTranslation("classProgram")(ClassProgramListHeader);
