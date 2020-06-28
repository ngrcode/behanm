import React from "react";
import PropTypes from "prop-types";
import Joi from "joi-browser";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
import { DoranForm, DoranDialogOperationPanel, ListItem } from "@doran/react";
import { base64ToFile, translateError, showToast } from "@doran/react";

// Services
import bannerService from "../../../core/services/banner.service";
import categoryService from "../../../core/services/category.service";
import fileService from "../../../core/services/file.service";

// Configs
import NoPicture from "../../../assets/images/no-picture.png";

const trans = "bannerAdd.bannerAdd";
const validTrans = `${trans}.validation`;

const styles = {
    bottom: {
        paddingBottom: 4,
    },
    topBottom: {
        paddingTop: 4,
        paddingBottom: 4,
    },
};
class BannerAdd extends DoranForm {
    state = {
        data: this.props.banner,
        errors: {},
        validate: true,
    };

    schema = {
        title: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        targetLink: Joi.string()
            .allow("")
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        categories: Joi.array()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        file: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
    };

    handleImageSave = async () => {
        let response = null;
        const { file } = this.state.data;

        const image = await base64ToFile(file);
        const data = new FormData();
        data.append("file", image);
        data.append("type", "");
        data.append("link", "");
        await fileService
            .create(data)
            .then(({ data }) => {
                response = data;
            })
            .catch((error) => {
                console.log(error);
            });

        return response;
    };

    handleSave = async (event) => {
        event.preventDefault();

        const image = await this.handleImageSave();
        if (image === null) return;

        const { title, targetLink, categories } = this.state.data;
        const file = `/api/files/${image.id}`;
        const category = categories.map((e) => `/api/categories/${e.value}`);
        await bannerService
            .create({ title, targetLink, file, category })
            .then(({ data }) => {
                const { onCreate,  t: translate } = this.props;
                onCreate(data);

                const message = translate(`${trans}.createdSuccessfully`, { title });
                showToast({ variant: "success", message });
            })
            .catch((error) => {
                const { t: translate } = this.props;

                const message = translate(`${trans}.unexpectedError`);
                showToast({ variant: "error", message });
            });
    };

    listItem = ({ data }) => {
        const items = data["hydra:member"];
        return items.map((e) => new ListItem(e.id, e.title ));
    };

    handleImage = (image) => {
        this.setState({ data: { ...this.state.data, file: image } });
    };

    render() {
        const { open, onClose, t: translate, classes } = this.props;
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
                    <Grid item sm={12} className={classes.bottom}>
                        {this.renderInput({ name: "title", label: translate(`${trans}.title`) })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderInput({ name: "targetLink", label: translate(`${trans}.targetLink`), ltr: true })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderMultiSelectAutocomplete({
                            name: "categories",
                            label: translate(`${trans}.categories`),
                            queryName: "title",
                            serviceCallback: categoryService.list,
                            convertCallback: this.listItem,
                        })}
                    </Grid>
                </Grid>
                <Grid item sm={4}>
                    {this.renderImageInput({
                        name: "file",
                        emptyImage: NoPicture,
                        removeText: translate(`${trans}.imageRemoveText`),
                        uploadText: translate(`${trans}.imageUploadText`),
                    })}
                </Grid>
            </DoranDialogOperationPanel>
        );
    }
}

BannerAdd.propTypes = {
    banner: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    onCreate: PropTypes.func.isRequired,
};

export default withTranslation("banner")(withStyles(styles)(BannerAdd));
