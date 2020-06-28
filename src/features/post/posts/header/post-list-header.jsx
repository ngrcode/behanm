import React from "react";
import { withTranslation } from "react-i18next";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  title: {
      margin: 5
  }
});

const transPrefix = "post.posts.header.postListHeader";

function PostListHeader(props) {
  const classes = useStyles();
  const { t: translate,onDialog } = props;

  return (
      <div style={{ width: "100%" }}>
          <Box display="flex" p={1}>
              <Box p={1} flexGrow={1}>
                  <h4 className={classes.title}>{translate(`${transPrefix}.title`)}</h4>
              </Box>
              <Box p={1}>
                  <Button variant="contained" color="primary" onClick={onDialog} >
                      {translate(`${transPrefix}.button`)}
                  </Button>
              </Box>
          </Box>
      </div>
  );
}
export default withTranslation("features")(PostListHeader);
