import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import lodash from "lodash";
import { DoranRemoveDialog, ListItem, showToast } from "@doran/react";

// Components
import EducationComplexList from "./list/education-complex-list";
import EducationComplexListHeader from "./header/education-complex-list-header";
import EducationComplexListFilter from "./filter/education-complex-list-filter";
import EducationComplexAdd from "../education-complex-add/education-complex-add";
import EducationComplexEdit from "../education-complex-edit/education-complex-edit";

// Services
import educationComplexService from "../../../core/services/education-complex.service";

const trans = "educationComplexes.educationComplexes";
const defaultEducationComplex = { name: "", region: null, person: null };

class EducationComplexes extends Component {
    state = {
        items: [],
        total: 0,
        pageSize: 30,
        pageNumber: 1,
        filterCriteria: null,
        openCreateDialog: false,
        openUpdateDialog: false,
        openDeleteDialog: false,
        educationComplex: lodash.cloneDeep(defaultEducationComplex),
        translate: this.props.t
    };

    async componentDidUpdate(_, prevState) {
        if (
            prevState.pageNumber === this.state.pageNumber &&
            prevState.pageSize === this.state.pageSize &&
            prevState.filterCriteria === this.state.filterCriteria
        )
            return;

        await this.load();
    }

    handlePageNumberChange = (pageNumber) => {
        this.setState({ pageNumber: pageNumber + 1 });
    };

    handlePageSizeChange = (pageSize) => {
        this.setState({ pageSize, pageNumber: 1 });
    };

    handleFilter = (filterCriteria) => {
        this.setState({ filterCriteria, pageNumber: 1 });
    };

    toggleCreateDialog = () => {
        const { openCreateDialog } = this.state;
        this.setState({
            openCreateDialog: !openCreateDialog,
            educationComplex: defaultEducationComplex
        });
    };

    handleCreateEducationComplex = (educationComplex) => {
        let { items, total } = this.state;
        items.unshift(educationComplex);
        this.setState({ items, total: total + 1 });

        this.toggleCreateDialog();
    };

    toggleUpdateDialog = (educationComplex) => {
        const { openUpdateDialog } = this.state;
        if (educationComplex && educationComplex.id) {
            const clonedItem = this.initializeEditEducationComplex(educationComplex);

            this.setState({ openUpdateDialog: !openUpdateDialog, educationComplex: clonedItem });
        } else {
            this.setState({ openUpdateDialog: !openUpdateDialog, educationComplex: defaultEducationComplex });
        }
    };

    handleUpdateEducationComplex = (educationComplex) => {
        let { items, total } = this.state;
        const index = items.findIndex((e) => e.id === educationComplex.id);
        items.splice(index, 1, educationComplex);
        this.setState({ items, total });

        this.toggleUpdateDialog();
    };

    initializeEditEducationComplex = (educationComplex) => {
        const { id, name, region, person } = educationComplex;
        const clonedItem = { id, name };
        clonedItem.region = new ListItem(region.id, region.name, region.code);
        clonedItem.person = new ListItem(person.id, `${person.firstName} ${person.lastName}`);

        return clonedItem;
    };

    toggleDeleteDialog = (educationComplex) => {
        const { openDeleteDialog } = this.state;
        if (educationComplex) {
            this.setState({
                openDeleteDialog: !openDeleteDialog,
                educationComplex: educationComplex
            });
        } else {
            this.setState({
                openDeleteDialog: !openDeleteDialog,
                educationComplex: defaultEducationComplex
            });
        }
    };

    handleDeleteEducationComplex = async (educationComplex) => {
        await educationComplexService
            .remove(educationComplex.id)
            .then(() => {
                const { items, total, openDeleteDialog } = this.state;
                const index = items.findIndex((e) => e.id === educationComplex.id);
                items.splice(index, 1);

                this.setState({
                    items,
                    total: total - 1,
                    openDeleteDialog: !openDeleteDialog
                });

                const success = this.state.translate(`${trans}.deletedSuccessfully`, { name: educationComplex.name });
                showToast({ variant: "success", message: success });
            })
            .catch((error) => {
                const errorMessage = this.state.translate(`${trans}.unexpectedError`);
                showToast({ variant: "error", message: errorMessage });
            });
    };

    async load() {
        const {
            pageNumber: page,
            filterCriteria: { title, regionName, personName }
        } = this.state;

        const query = {
            page,
            title,
            "region.name": regionName ? regionName : null,
            "person.name": personName ? personName : null
        };
        await educationComplexService
            .list(query)
            .then(({ data }) => {
                this.setState({
                    items: data["hydra:member"],
                    total: data["hydra:totalItems"]
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    redirect = (data,path) =>{
            this.props.history.push(path, { educationComplex: data })
    }
    render() {
        const { items, total, pageSize, pageNumber, educationComplex } = this.state;
        const { openCreateDialog, openUpdateDialog, openDeleteDialog } = this.state;
        const { t: translate } = this.props;

        return (
            <React.Fragment>
                {openCreateDialog && (
                    <EducationComplexAdd
                        educationComplex={educationComplex}
                        open={openCreateDialog}
                        onClose={this.toggleCreateDialog}
                        onCreate={this.handleCreateEducationComplex}
                        size="xs"
                    />
                )}

                {openUpdateDialog && (
                    <EducationComplexEdit
                        educationComplex={educationComplex}
                        open={openUpdateDialog}
                        onClose={this.toggleUpdateDialog}
                        onUpdate={this.handleUpdateEducationComplex}
                        size="xs"
                    />
                )}

                {openDeleteDialog && (
                    <DoranRemoveDialog
                        data={educationComplex}
                        open={openDeleteDialog}
                        onClose={this.toggleDeleteDialog}
                        onDelete={this.handleDeleteEducationComplex}
                        titleText={translate(`${trans}.titleText`)}
                        contentText={translate(`${trans}.contentText`)}
                        agreeText={translate(`${trans}.agreeText`)}
                        disagreeText={translate(`${trans}.disagreeText`)}
                    />
                )}

                <EducationComplexListHeader onDialog={this.toggleCreateDialog} />
                <EducationComplexListFilter onFilterChange={this.handleFilter} />
                <EducationComplexList
                    items={items}
                    total={total}
                    pageSize={pageSize}
                    pageNumber={pageNumber}
                    onEdit={this.toggleUpdateDialog}
                    onDelete={this.toggleDeleteDialog}
                    onPageNumberChange={this.handlePageNumberChange}
                    onPageSizeChange={this.handlePageSizeChange}
                    onRedirect={this.redirect}
                />
            </React.Fragment>
        );
    }
}

export default withTranslation("educationComplex")(EducationComplexes);
