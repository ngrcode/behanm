import React from "react";
import PropTypes from "prop-types";
import Joi from "joi-browser";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
import { DoranForm, DoranDialogOperationPanel, ListItem } from "@doran/react";
import { translateError, base64ToFile, showToast } from "@doran/react";
import "@doran/react/dist/suneditor/css/suneditor.min.css";

// Services
import postService from "../../../core/services/post.service";
import categoryService from "../../../core/services/category.service";
import fileService from "../../../core/services/file.service";
import schoolService from "../../../core/services/school.service";

// Configs
import NoPicture from "../../../assets/images/no-picture.png";

const trans = "postEdit.postEdit";
const validTrans = `${trans}.validation`;

const styles = {
    bottom: {
        paddingBottom: 4
    },
    topBottom: {
        paddingTop: 4,
        paddingBottom: 4
    }
};
class PostEdit extends DoranForm {
    state = {
        data: this.props.post,
        errors: {},
        validate: true
    };

    schema = {
        id: Joi.number().required(),
        title: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        body: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        categories: Joi.array()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        image: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        school: Joi.object().error((errors) => translateError(errors, validTrans, this.props.t))
    };

    handleImageSave = async () => {
        let response = null;
        const { image } = this.state.data;

        const file = await base64ToFile(image);
        const data = new FormData();
        data.append("file", file);
        data.append("type", "");
        data.append("link", "");
        await fileService
            .create(data)
            .then(({ data }) => {
                response = data;
            })
            .catch((error) => {
                const { t: translate } = this.props;
                const message = translate(`${trans}.unexpectedError`);
                showToast({ variant: "error", message });
            });

        return response;
    };

    handleSave = async (event) => {
        event.preventDefault();

        const image = await this.handleImageSave();
        if (image === null) return;

        const { id, title, body, school: scl, categories } = this.state.data;
        const file = `/api/files/${image.id}`;
        const school = `/api/schools/${scl.value}`;
        const category = categories.map((e) => `/api/categories/${e.value}`);
        await postService
            .save({ id, title, body, file, school, category })
            .then(({ data }) => {
                const { onUpdate, t: translate } = this.props;
                onUpdate(data);

                const message = translate(`${trans}.updatedSuccessfully`, { title });
                showToast({ variant: "success", message });
            })
            .catch(() => {
                const { t: translate } = this.props;
                const message = translate(`${trans}.unexpectedError`);
                showToast({ variant: "error", message });
            });
    };

    listItem = ({ data }) => {
        const items = data["hydra:member"];
        return items.map((e) => new ListItem(e.id, e.title));
    };

    handleImage = (image) => {
        this.setState({ data: { ...this.state.data, file: image } });
    };

    render() {
        const { open, onClose, t: translate, classes } = this.props;
        const attributes = {
            open,
            onClose,
            size: "lg",
            title: translate(`${trans}.dialogTitle`),
            saveText: translate(`${trans}.saveText`),
            closeText: translate(`${trans}.closeText`),
            validate: this.validate,
            onSave: this.handleSave
        };

        return (
            <DoranDialogOperationPanel {...attributes}>
                <Grid item sm={4}>
                    <Grid item sm={12} className={classes.bottom}>
                        {this.renderInput({ name: "title", label: translate(`${trans}.title`) })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderAutocomplete({
                            name: "school",
                            label: translate(`${trans}.school`),
                            queryName: "title",
                            serviceCallback: schoolService.list,
                            convertCallback: this.listItem
                        })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderMultiSelectAutocomplete({
                            name: "categories",
                            label: translate(`${trans}.categories`),
                            queryName: "title",
                            serviceCallback: categoryService.list,
                            convertCallback: this.listItem
                        })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderImageInput({
                            name: "image",
                            emptyImage: NoPicture,
                            removeText: translate(`${trans}.imageRemoveText`),
                            uploadText: translate(`${trans}.imageUploadText`),
                            minHeight: "300px"
                        })}
                    </Grid>
                </Grid>
                <Grid item sm={8}>
                    {this.renderEditor({
                        name: "body",
                        label: translate(`${trans}.body`)
                    })}
                </Grid>
            </DoranDialogOperationPanel>
        );
    }
}

PostEdit.propTypes = {
    post: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    onUpdate: PropTypes.func.isRequired
};

export default withTranslation("post")(withStyles(styles)(PostEdit));
