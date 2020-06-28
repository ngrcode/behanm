import React from "react";
import Joi from "joi-browser";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
import { DoranForm, ListItem, translateError } from "@doran/react";

// services
import authService from "../../../core/services/auth.service";

// Images
import Logo from "../../../assets/images/logo.png";

const trans = "unauthorized.register.register";
const validTrans = `${trans}.validation`;

const styles = (theme) => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: theme.spacing(4)
    },
    register: {
        fontSize: theme.spacing(3),
        fontWeight: "bold",
        color: "#1dbd7a"
    },
    form: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        marginTop: theme.spacing(1)
    },
    grid: {
        marginTop: theme.spacing(1)
    }
});

const defaultUser = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    nationalCode: "",
    birthDate: "",
    isMarried: false,
    gender: null
};

class Register extends DoranForm {
    state = {
        data: defaultUser,
        errors: {},
        validate: true,
        translate: this.props.t,
        genderTypes: [
            new ListItem("man", this.props.t(`${trans}.man`)),
            new ListItem("woman", this.props.t(`${trans}.woman`))
        ]
    };

    schema = {
        username: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.state.translate)),
        password: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.state.translate)),
        firstName: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.state.translate)),
        lastName: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.state.translate)),
        fatherName: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.state.translate)),
        nationalCode: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.state.translate)),
        birthDate: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.state.translate)),
        isMarried: Joi.boolean()
            .required()
            .error((errors) => translateError(errors, validTrans, this.state.translate)),
        gender: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.state.translate))
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const {
            username,
            password,
            firstName,
            lastName,
            fatherName,
            nationalCode,
            birthDate,
            isMarried,
            gender
        } = this.state.data;
        await authService
            .register({
                username,
                password,
                firstName,
                lastName,
                fatherName,
                nationalCode,
                birthDate,
                isMarried,
                gender: gender.value
            })
            .then(() => {
                const { history } = this.props;
                history.push("/login");
            })
            .catch(() => {
                const { translate } = this.state;
                const errorMessage = translate(`${trans}.unexpectedError`);
                console.log(errorMessage);
                // toastService.showToast({ variant: "error", message: errorMessage });
            });
    };

    handleToLogin = (event) => {
        event.preventDefault();

        const { history } = this.props;
        history.push("/login");
    };

    render() {
        const { classes, t: translate } = this.props;
        const { genderTypes } = this.state;

        return (
            <Container component="main" maxWidth="sm">
                <div className={classes.paper}>
                    <img src={Logo} alt="Behnam" />
                    <Typography component="h1" variant="h5" className={classes.register}>
                        {translate(`${trans}.title`)}
                    </Typography>
                    <form className={classes.form} onSubmit={this.handleSubmit} noValidate autoComplete="none">
                        <Grid container spacing={1}>
                            <Grid item sm={6}>
                                {this.renderInput({
                                    name: "username",
                                    label: translate(`${trans}.username`),
                                    ltr: true
                                })}
                            </Grid>
                            <Grid item sm={6}>
                                {this.renderInput({
                                    name: "password",
                                    label: translate(`${trans}.password`),
                                    type: "password",
                                    ltr: true
                                })}
                            </Grid>
                            <Grid item sm={6}>
                                {this.renderInput({ name: "firstName", label: translate(`${trans}.firstName`) })}
                            </Grid>
                            <Grid item sm={6}>
                                {this.renderInput({ name: "lastName", label: translate(`${trans}.lastName`) })}
                            </Grid>
                            <Grid item sm={6}>
                                {this.renderInput({ name: "fatherName", label: translate(`${trans}.fatherName`) })}
                            </Grid>
                            <Grid item sm={6}>
                                {this.renderInput({
                                    name: "nationalCode",
                                    label: translate(`${trans}.nationalCode`),
                                    ltr: true
                                })}
                            </Grid>
                            <Grid item sm={6}>
                                {this.renderInput({ name: "birthDate", label: translate(`${trans}.birthDate`) })}
                            </Grid>
                            <Grid item sm={6}>
                                {this.renderSelect({
                                    name: "gender",
                                    label: translate(`${trans}.gender`),
                                    options: genderTypes
                                })}
                            </Grid>
                            <Grid item sm={6}>
                                {this.renderCheckbox({
                                    name: "isMarried",
                                    label: translate(`${trans}.isMarried`),
                                    options: genderTypes
                                })}
                            </Grid>
                            <Grid item sm={12}>
                                {this.renderButton({ label: translate(`${trans}.save`) })}
                            </Grid>
                            <Grid item sm={12}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<VpnKeyIcon />}
                                    onClick={this.handleToLogin}
                                >
                                    {translate(`${trans}.login`)}
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

export default withStyles(styles)(withTranslation("infrastructure")(Register));
