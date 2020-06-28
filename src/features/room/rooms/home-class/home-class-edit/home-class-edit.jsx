import React from "react";
import PropTypes from "prop-types";
import Joi from "joi-browser";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { DoranForm, DoranDialogOperationPanel, translateError, showToast } from "@doran/react";

// Services
import homeClassService from "../../../../../core/services/home-class.service";

const trans = "homeClassEdit.homeClassEdit";
const validTrans = `${trans}.validation`;

class HomeClassEdit extends DoranForm {
    state = {
        data: this.props.homeClass,
        errors: {},
        validate: true,
    };

    schema = {
        id: Joi.number().required(),
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

        const { id, title, year, room } = this.state.data;
        await homeClassService
            .save({ id, title, year, room: `/api/rooms/${room.id}` })
            .then(({ data }) => {
                const { onUpdate } = this.props;
                onUpdate(data);

                const success = this.props.t(`${trans}.updatedSuccessfully`, { title: data.title });
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
            saveText: translate(`${trans}.saveText`),
            closeText: translate(`${trans}.closeText`),
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

HomeClassEdit.propTypes = {
    homeClass: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
};

export default withTranslation("homeClass")(HomeClassEdit);
