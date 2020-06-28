import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";

const trans = "comments.header.commentListHeader";

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(2)
    }
}));
function CommentListHeader(props) {
    const classes = useStyles();
    const { t: translate } = props;

    return (
        <div className={classes.root}>
            <Box display="flex">
                <Box flexGrow={1}>
                    <Typography variant="h6" component="h6">
                        {translate(`${trans}.title`)}
                    </Typography>
                </Box>
                
            </Box>
        </div>
    );
}
export default withTranslation("comment")(CommentListHeader);
