import React from "react";
import PropTypes from "prop-types";
import Joi from "joi-browser";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { DoranForm, DoranDialogOperationPanel, translateError, showToast } from "@doran/react";

// Services
import roomService from "../../../core/services/room.service";

const trans = "roomAdd.roomAdd";
const validTrans = `${trans}.validation`;

class RoomAdd extends DoranForm {
    state = {
        data: this.props.room,
        errors: {},
        validate: true,
    };

    schema = {
        title: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        school: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
    };

    handleSave = async (event) => {
        event.preventDefault();
        const { title, school } = this.state.data;

        await roomService
            .save({ title, school: `/api/schools/${school.id}` })
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
                <Grid item sm={8}>
                    {this.renderInput({ name: "title", label: translate(`${trans}.title`) })}
                </Grid>
            </DoranDialogOperationPanel>
        );
    }
}

RoomAdd.propTypes = {
    room: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
};

export default withTranslation("room")(RoomAdd);
