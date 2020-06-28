import React, { Component } from "react";
import lodash from "lodash";
import { withTranslation } from "react-i18next";
import { DoranRemoveDialog, ListItem, showToast } from "@doran/react";

// Components
import SchoolList from "./list/school-list";
import SchoolListHeader from "./header/school-list-header";
import SchoolListFilter from "./filter/school-list-filter";
import SchoolAdd from "../school-add/school-add";
import SchoolEdit from "../school-edit/school-edit";

// Services
import schoolService from "../../../core/services/school.service";

const trans = "schools.schools";
const defaultSchool = {
    title: "",
    educationComplex: null,
    region: null,
    howze: null,
    mosque: null,
    contacts: [],
    coordinates: []
};

class Schools extends Component {
    state = {
        items: [],
        total: 0,
        pageSize: 30,
        pageNumber: 1,
        filterCriteria: null,
        openCreateDialog: false,
        openUpdateDialog: false,
        openDeleteDialog: false,
        school: lodash.cloneDeep(defaultSchool),
        region: this.regionState(),
        educationComplex: (this.props.location.state && this.props.location.state.educationComplex) || null,
        mosque: (this.props.location.state && this.props.location.state.mosque) || null,

        schoolStatus: [
            new ListItem(0, this.props.t(`${trans}.schoolStatus.published`)),
            new ListItem(1, this.props.t(`${trans}.schoolStatus.unpublished`)),
            new ListItem(2, this.props.t(`${trans}.schoolStatus.draft`))
        ],
        schoolGenders: [
            new ListItem("man", this.props.t(`${trans}.schoolGenders.man`)),
            new ListItem("woman", this.props.t(`${trans}.schoolGenders.woman`))
        ],
        contactTypes: [
            new ListItem(0, this.props.t(`${trans}.contactTypes.phone`)),
            new ListItem(1, this.props.t(`${trans}.contactTypes.mobile`)),
            new ListItem(2, this.props.t(`${trans}.contactTypes.email`)),
            new ListItem(3, this.props.t(`${trans}.contactTypes.address`)),
            new ListItem(4, this.props.t(`${trans}.contactTypes.website`)),
            new ListItem(5, this.props.t(`${trans}.contactTypes.fax`))
        ]
    };

    regionState() {
        const { state } = this.props.location;
        if (state && state.region)  return state.region.name;
        return null;
    }

    
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
        this.setState({ openCreateDialog: !openCreateDialog, school: lodash.cloneDeep(defaultSchool) });
    };

    handleCreateSchool = (school) => {
        let { items, total } = this.state;
        items.unshift(school);
        this.setState({ items, total: total + 1 });

        this.toggleCreateDialog();
    };

    toggleUpdateDialog = (school) => {
        const { openUpdateDialog } = this.state;
        if (school && school.id) {
            const clonedItem = this.initializeEditSchool(school);
            this.setState({ openUpdateDialog: !openUpdateDialog, school: clonedItem });
        } else {
            this.setState({ openUpdateDialog: !openUpdateDialog, school: lodash.cloneDeep(defaultSchool) });
        }
    };

    handleUpdateSchool = (school) => {
        let { items, total } = this.state;
        const index = items.findIndex((e) => e.id === school.id);
        items.splice(index, 1, school);
        this.setState({ items, total });

        this.toggleUpdateDialog();
    };

    initializeEditSchool = (school) => {
        const { contactTypes } = this.state;
        const { id, title, educationComplex: ec, region, howze, mosque, contact, coordinate } = school;
        const clonedItem = { id, title };
        clonedItem.educationComplex = new ListItem(ec.id, ec.name);
        clonedItem.mosque = new ListItem(mosque.id, mosque.title);
        clonedItem.region = new ListItem(region.id, region.name, region.code);
        clonedItem.howze = new ListItem(howze.id, howze.name, howze.code);
        clonedItem.contacts = contact.map((e) => {
            return { type: contactTypes.find((i) => e.type === i.value), value: e.value };
        });
        clonedItem.coordinates = coordinate.map((e) => {
            return { lat: +e.lat, lng: +e.lng };
        });

        return clonedItem;
    };

    toggleDeleteDialog = (school) => {
        const { openDeleteDialog } = this.state;
        if (school) {
            this.setState({ openDeleteDialog: !openDeleteDialog, school: school });
        } else {
            this.setState({ openDeleteDialog: !openDeleteDialog, school: lodash.cloneDeep(defaultSchool) });
        }
    };

    handleDeleteSchool = async (school) => {
        await schoolService
            .remove(school.id)
            .then(() => {
                const { items, total, openDeleteDialog } = this.state;
                const index = items.findIndex((e) => e.id === school.id);
                items.splice(index, 1);

                this.setState({ items, total: total - 1, openDeleteDialog: !openDeleteDialog });

                const message = this.props.t(`${trans}.deletedSuccessfully`, { title: school.title });
                showToast({ variant: "success", message });
            })
            .catch(() => {
                const message = this.props.t(`${trans}.unexpectedError`);
                showToast({ variant: "error", message });
            });
    };

    async load() {
        const {
            pageNumber: page,
            filterCriteria: { title, regionName, howzeName, status: statusArray, educationComplex, mosque }
        } = this.state;
        const status = statusArray.map((e) => e.value);
        const query = {
            page,
            status,
            title: title ? title : null,
            "region.name": regionName ? regionName : null,
            "howze.name": howzeName ? howzeName : null,
            "educationComplex.id": educationComplex ? educationComplex.value : null,
            "mosque.id": mosque ? mosque.value : null
        };
        await schoolService
            .list(query)
            .then(({ data }) => {
                const items = data["hydra:member"];
                const total = data["hydra:totalItems"];

                this.setState({ items, total });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    redirect = (school, path, position) => {
         this.props.history.push(path, {school, position});
    };

    render() {
        console.log(this.props)
        const { items, total, pageSize, pageNumber, school, schoolStatus, schoolGenders, contactTypes } = this.state;
        const { openCreateDialog, openUpdateDialog, openDeleteDialog } = this.state;
        const { t: translate } = this.props;

        return (
            <React.Fragment>
                {openCreateDialog && (
                    <SchoolAdd
                        school={school}
                        open={openCreateDialog}
                        onClose={this.toggleCreateDialog}
                        onCreate={this.handleCreateSchool}
                        contactTypes={contactTypes}
                        schoolGenders={schoolGenders}
                    />
                )}

                {openUpdateDialog && (
                    <SchoolEdit
                        school={school}
                        open={openUpdateDialog}
                        onClose={this.toggleUpdateDialog}
                        onUpdate={this.handleUpdateSchool}
                        contactTypes={contactTypes}
                    />
                )}

                {openDeleteDialog && (
                    <DoranRemoveDialog
                        data={school}
                        open={openDeleteDialog}
                        onClose={this.toggleDeleteDialog}
                        onDelete={this.handleDeleteMosque}
                        titleText={translate(`${trans}.titleText`)}
                        contentText={translate(`${trans}.contentText`)}
                        agreeText={translate(`${trans}.agreeText`)}
                        disagreeText={translate(`${trans}.disagreeText`)}
                    />
                )}

                <SchoolListHeader onDialog={this.toggleCreateDialog} />
                <SchoolListFilter
                    onFilterChange={this.handleFilter}
                    schoolStatus={schoolStatus}
                    schoolGenders={schoolGenders}
                    region={this.state.region}
                    educationComplex={ (this.state.educationComplex && new ListItem(this.state.educationComplex.id, this.state.educationComplex.name)) || null}
                    mosque={ (this.state.mosque && new ListItem(this.state.mosque.id, this.state.mosque.title)) || null}
                    expanded={true}
                />
                <SchoolList
                    items={items}
                    total={total}
                    pageSize={pageSize}
                    pageNumber={pageNumber}
                    onEdit={this.toggleUpdateDialog}
                    onDelete={this.toggleDeleteDialog}
                    onPageNumberChange={this.handlePageNumberChange}
                    onPageSizeChange={this.handlePageSizeChange}
                    contactTypes={contactTypes}
                    onRedirect={this.redirect}
                />
            </React.Fragment>
        );
    }
}

export default withTranslation("school")(Schools);
