import React from "react";
import PropTypes from "prop-types";
import Joi from "joi-browser";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { DoranForm, DoranDialogOperationPanel, ListItem } from "@doran/react";
import { translateError, showToast } from "@doran/react";

// Services
import categoryService from "../../../core/services/category.service";

const trans = "categoryEdit.categoryEdit";
const validTrans = `${trans}.validation`;

class CategoryAdd extends DoranForm {
    state = {
        data: this.props.category,
        errors: {},
        validate: true
    };

    schema = {
        id: Joi.number().required(),
        title: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        body: Joi.string()
            .allow("")
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        type: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        parent: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t))
    };

    handleSave = async (event) => {
        event.preventDefault();

        const { id, title, body, type, parent: p } = this.state.data;
        const parent = `api/categories/${p.value}`;
        await categoryService
            .save({ id, title, body, type: type.value, parent })
            .then(({ data }) => {
                const { onUpdate } = this.props;
                onUpdate(data);

                const success = this.props.t(`${trans}.updatedSuccessfully`, { title });
                showToast({ variant: "success", message: success });
            })
            .catch(() => {
                const errorMessage = this.props.t(`${trans}.unexpectedError`);
                showToast({ variant: "error", message: errorMessage });
            });
    };

    listItem = ({ data }) => {
        const items = data["hydra:member"];
        return items.map((e) => new ListItem(e.id, e.title));
    };

    render() {
        const { categoryTypes, open, onClose, t: translate } = this.props;
        const attributes = {
            open,
            onClose,
            title: translate(`${trans}.dialogTitle`),
            validate: this.validate,
            onSave: this.handleSave,
            closeText: translate(`${trans}.closeText`),
            saveText: translate(`${trans}.saveText`)
        };

        return (
            <DoranDialogOperationPanel {...attributes}>
                <Grid item sm={8}>
                    {this.renderInput({ name: "title", label: translate(`${trans}.title`) })}
                </Grid>
                <Grid item sm={4}>
                    {this.renderSelect({ name: "type", label: translate(`${trans}.type`), options: categoryTypes })}
                </Grid>
                <Grid item sm={12}>
                    {this.renderTextArea({ name: "body", label: translate(`${trans}.body`) })}
                </Grid>
                <Grid item sm={12}>
                    {this.renderAutocomplete({
                        name: "parent",
                        label: translate(`${trans}.parent`),
                        queryName: "title",
                        serviceCallback: categoryService.list,
                        convertCallback: this.listItem
                    })}
                </Grid>
            </DoranDialogOperationPanel>
        );
    }
}

CategoryAdd.propTypes = {
    category: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    onUpdate: PropTypes.func.isRequired,
    categoryTypes: PropTypes.array.isRequired
};

export default withTranslation("category")(CategoryAdd);
