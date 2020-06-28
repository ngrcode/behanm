import React from "react";
import PropTypes from "prop-types";
import Joi from "joi-browser";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { DoranForm, DoranDialogOperationPanel, translateError, showToast } from "@doran/react";

// Services
import homeClassService from "../../../../../core/services/home-class.service";

const trans = "homeClassAdd.homeClassAdd";
const validTrans = `${trans}.validation`;

class HomeClassAdd extends DoranForm {
    state = {
        data: this.props.homeClass,
        errors: {},
        validate: true,
    };

    schema = {
        title: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        year: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        room: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
    };

    handleSave = async (event) => {
        event.preventDefault();
        const { title, year, room } = this.state.data;

        await homeClassService
            .save({ title, year, room: `/api/rooms/${room.id}` })
            .then(({ data }) => {
                const { onCreate } = this.props;
                onCreate(data);

                const success = this.props.t(`${trans}.createdSuccessfully`, { title: data.title });
                showToast({ variant: "success", message: success });
            })
            .catch((error) => {
                const errorMessage = this.props.t(`${trans}.unexpectedError`);
                showToast({ variant: "error", message: errorMessage });
            });
    };

    render() {
        const { open, onClose, t: translate } = this.props;
        const attributes = {
            open,
            onClose,
            title: translate(`${trans}.dialogTitle`),
            closeText: translate(`${trans}.closeText`),
            saveText: translate(`${trans}.saveText`),
            validate: this.validate,
            onSave: this.handleSave,
        };

        return (
            <DoranDialogOperationPanel {...attributes}>
                <Grid item sm={6}>
                    {this.renderInput({ name: "title", label: translate(`${trans}.title`) })}
                </Grid>
                <Grid item sm={6}>
                    {this.renderInput({ name: "year", label: translate(`${trans}.year`) })}
                </Grid>
            </DoranDialogOperationPanel>
        );
    }
}

HomeClassAdd.propTypes = {
    homeClass: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
};

export default withTranslation("homeClass")(HomeClassAdd);
