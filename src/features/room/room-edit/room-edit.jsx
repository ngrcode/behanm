import React from "react";
import PropTypes from "prop-types";
import Joi from "joi-browser";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { DoranForm, DoranDialogOperationPanel, translateError, showToast } from "@doran/react";
// Services
import roomService from "../../../core/services/room.service";

const trans = "roomEdit.roomEdit";
const validTrans = `${trans}.validation`;

class RoomEdit extends DoranForm {
    state = {
        data: this.props.room,
        errors: {},
        validate: true,
    };

    schema = {
        id: Joi.number().required(),
        title: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        school: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
    };

    handleSave = async (event) => {
        event.preventDefault();

        const { id, title, school } = this.state.data;
        await roomService
            .save({ id, title, school: `/api/schools/${school.id}` })
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
                <Grid item sm={8}>
                    {this.renderInput({ name: "title", label: translate(`${trans}.title`) })}
                </Grid>
            </DoranDialogOperationPanel>
        );
    }
}

RoomEdit.propTypes = {
    room: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
};

export default withTranslation("room")(RoomEdit);
