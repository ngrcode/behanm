import React from "react";
import Joi from "joi-browser";
import { withTranslation } from "react-i18next";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { withStyles } from "@material-ui/core/styles";
import { DoranForm, translateError, ListItem } from "@doran/react";

// services
import authService from "../../../core/services/auth.service";

// Images
import Logo from "../../../assets/images/logo.png";

const trans = "unauthorized.login.login";
const validTrans = `${trans}.validation`;

const styles = (theme) => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: theme.spacing(24),
    },
    login: {
        fontSize: theme.spacing(3),
        fontWeight: "bold",
        color: "#1dbd7a",
    },
    form: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        marginTop: theme.spacing(1),
    },
    grid: {
        marginTop: theme.spacing(1),
    },
});

class Login extends DoranForm {
    state = {
        data: { username: "", password: "" ,role:"" },
        errors: {},
        validate: true,
        translate: this.props.t,
        rolesType :[
            new ListItem("ROLE_ADMIN" , this.props.t(`${trans}.userRoles.admin`)),
            new ListItem(1 , this.props.t(`${trans}.userRoles.teacher`)),
            new ListItem(2 , this.props.t(`${trans}.userRoles.manager`)),
            new ListItem(3 , this.props.t(`${trans}.userRoles.student`)),
            new ListItem(4 , this.props.t(`${trans}.userRoles.parent`)),
            new ListItem(5 , this.props.t(`${trans}.userRoles.mentor`)),
        ] 
    };

    schema = {
        username: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.state.translate)),
        password: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.state.translate)),
        role: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.state.translate)),
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const { username, password, role } = this.state.data;
        await authService
            .login({
                username,
                password,
                role:role.value
            })
            .then(() => {
                window.location = "/";
            })
            .catch(() => {
                const { translate } = this.state;
                const errorMessage = translate(`${trans}.unexpectedError`);
                console.log(errorMessage);
                // toastService.showToast({ variant: "error", message: errorMessage });
            });
    };

    handleToRegister = (event) => {
        event.preventDefault();

        const { history } = this.props;
        history.push("/register");
    };

    render() {
        const { classes, t: translate } = this.props;
        const {rolesType} = this.state;
        return (
            <Container maxWidth="xs">
                <div className={classes.paper}>
                    <img src={Logo} alt="Behnam" />
                    <Typography component="h1" variant="h5" className={classes.login}>
                        {translate(`${trans}.title`)}
                    </Typography>
                    <form className={classes.form} onSubmit={this.handleSubmit} noValidate autoComplete="none">
                        <Grid container spacing={1}>
                            <Grid item sm={12}>
                                {this.renderInput({
                                    name: "username",
                                    label: translate(`${trans}.username`),
                                    ltr: true,
                                })}
                            </Grid>
                            <Grid item sm={12}>
                                {this.renderInput({
                                    name: "password",
                                    label: translate(`${trans}.password`),
                                    type: "text",
                                    ltr: true,
                                })}
                            </Grid>
                             <Grid item sm={12}>
                                {this.renderSelect({ 
                                      name: "role",
                                      label: translate(`${trans}.role`),
                                      options: rolesType
                                 })}
                            </Grid>
                            <Grid item sm={12}>
                                {this.renderButton({ label: translate(`${trans}.enter`) })}
                            </Grid>
                            <Grid item sm={12}>
                                <Button variant="contained" color="secondary" startIcon={<LockOpenIcon />} onClick={this.handleToRegister}>
                                    {translate(`${trans}.register`)}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={8}>{/* <Footer /> */}</Box>
            </Container>
        );
    }
}

export default withStyles(styles)(withTranslation("infrastructure")(Login));
