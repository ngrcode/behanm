import React, { Component } from "react";
import { Box, Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

const styles = {
    box: {
        minHeight: 200,
        marginTop: 70,
    },
    container: {
        backgroundColor: "white",
        textAlign: "right",
        padding: 20,
        boxShadow: "0px 3px 23px 0px rgba(0,0,0,0.75)",
        fontWeight: "bold",
    },
    boximage: {
        width: 220,
        height: 220,
    },
    image: {
        width: 150,
        height: 150,
        verticalAlign: "middle",
        borderRadius: "50%",
        textAlign: "center",
    },
};

class UserProfile extends Component {
    render() {
        const { state } = this.props.location;
        console.log(state);
        console.log(state.avatar.url);
        return (
            <div>
                <Box component="div" m={1} style={styles.box}>
                    <Container maxWidth="md" style={styles.container}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Grid item xs={12}>
                                    <p style={styles.red}>نام : {state.firstName}</p>
                                </Grid>
                                <Grid item xs={12}>
                                    <p style={styles.red}>نام خانوادگی : {state.lastName}</p>
                                </Grid>
                                <Grid item xs={12}>
                                    <p style={styles.red}>شماره ملی : {state.nationalCode}</p>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} style={styles.boximage}>
                                {state.avatar ? (
                                    <img
                                        src={`http://behnam.erbp.ir/${state.avatar.url}`}
                                        alt="avatar"
                                        style={styles.image}
                                    />
                                ) : (
                                    <img src="/src/assets/images/no-avatar.jpg" alt="avatar" style={styles.image} />
                                )}
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </div>
        );
    }
}

export default UserProfile;
