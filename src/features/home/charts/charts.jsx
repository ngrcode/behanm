import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Doughnut, HorizontalBar , Bar, Line } from "react-chartjs-2";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import userService from "../../../core/services/user.service";
import commentService from "../../../core/services/comment.service";
import postService from "../../../core/services/post.service";
import mosqueService from "../../../core/services/mosque.service";
import {toJalali} from "@doran/react";
const styles = {
    top: {
        paddingTop: 80,
    },
};
class Charts extends Component {
    state = {
        totalUser: "",
        totalPost: "",
        totalMosque: "",
        items: [],
        comment: [],
        post: [],
        postMonth: [],
        mosque: [],
        mosqueMonth: []
    };
    async componentDidMount() {
        await this.loadUser();
        await this.loadComment();
        await this.loadPost();
        await this.loadMosque();
    }
    async loadUser() {
        await userService
            .list()
            .then(({ data }) => {
                let roles = data["hydra:member"].map((e) => e.positions).flat();
                let student = roles.filter((e) => e.name === "STUDENT").length;
                let manager = roles.filter((e) => e.name === "MANAGER").length;
                let teacher = roles.filter((e) => e.name === "TEACHER").length;
                let parent = roles.filter((e) => e.name === "PARENT").length;
                this.setState({
                    ...this.state,
                    items: [student, manager, teacher, parent],
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    async loadMosque() {
            await mosqueService
                .list()
                .then(({ data }) => {
                   
                    const months = data["hydra:member"].map((e) => new Date(e.createdAt)).sort((a, b) => a - b);
                    const faMonths = months.map((e) => toJalali(e, "MMMM"));    
                    const faSetMonth = [...new Set(faMonths)];
                    const all = faSetMonth.map((e) => ({ [e]: this.countOccurrence(faMonths, e) }));
                    let mosqueCount = [];
                    for (let item in all) {
                        mosqueCount.push(Object.values(all[item])[0]);
                    }
    
                    this.setState({
                        ...this.state,
                        mosque: [...mosqueCount],
                        mosqueMonth: faSetMonth,
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    countOccurrence(array, search) {
        return array.reduce((a, c) => {
            const occurrence = c === search ? 1 : 0;
            return a + occurrence;
        }, 0);
    }
    async loadComment() {
        await commentService
            .list()
            .then(({ data }) => {
                // month number
                const months = data["hydra:member"]
                    .map((e) => new Date(e.createdAt))
                    .sort((a, b) => a - b)
                    .map((e) => e.getMonth());
                // month name
                const faMonths = data["hydra:member"]
                    .map((e) => new Date(e.createdAt))
                    .map((e) => toJalali(e, "MMMM"))
                    .sort((a, b) => a - b);
                // const months = data["hydra:member"].map(e => new Date(e.createdAt)).sort((a, b ) => a - b).map(e => e.toLocaleString('default', { month: 'long' }));
                const faSetMonth = [...new Set(faMonths)];
                const setMonth = [...new Set(months)];
                const all = setMonth.map((e) => ({ [e]: this.countOccurrence(months, e) }));
                let commentCount = [];
                for (let item in all) {
                    commentCount.push(Object.values(all[item])[0]);
                }
                this.setState({
                    ...this.state,
                    comment: [...commentCount],
                    commentMonth: faSetMonth,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    async loadPost() {
        await postService
            .list()
            .then(({ data }) => {
                let post = data["hydra:member"];
                const months = post.map((e) => new Date(e.createdAt)).sort((a, b) => a - b);
                const faMonths = months.map((e) => toJalali(e, "MMMM"));
                const faSetMonth = [...new Set(faMonths)];
                const all = faSetMonth.map((e) => ({ [e]: this.countOccurrence(faMonths, e) }));
                let postCount = [];
                for (let item in all) {
                    postCount.push(Object.values(all[item])[0]);
                }
                this.setState({
                    ...this.state,
                    post: [...postCount],
                    postMonth: faSetMonth,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    render() {
        const { classes } = this.props;
        const { items, comment, commentMonth, post, postMonth, mosqueMonth, mosque } = this.state;
        return (
            <>
                <Grid container>
                    <Grid item sm={5}>
                        <Doughnut
                            data={{
                                labels: ["مدیران", "دانش آموزان", "مربیان", "والدین"],
                                datasets: [
                                    {
                                        data: items,
                                        backgroundColor: ["#FF6384", "#36A2EB", "#464646", "#FFCE56"],
                                        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#464646", "#FFCE56"],
                                    },
                                ],
                            }}
                            width={400}
                            height={300}
                            options={{
                                maintainAspectRatio: false,
                                legend: {
                                    labels: {
                                        // This more specific font property overrides the global property
                                        fontColor: "#1B1C1C",
                                        fontFamily: "IRANSans",
                                    },
                                },
                                title: {
                                    display: true,
                                    text: "کاربران",
                                    fontColor: "#1B1C1C",
                                    fontFamily: "IRANSans",
                                },
                                tooltips: {
                                    callbacks: {
                                        labelTextColor: function (tooltipItem, chart) {
                                            return "#eee";
                                        },
                                        bodyFontColor: "red",
                                    },
                                    bodyFontColor: "red",
                                    titleFontFamily: "red",
                                },
                            }}
                        />
                    </Grid>
                    <Grid item sm={2}></Grid>
                    <Grid item sm={5}>
                        <HorizontalBar 
                            data={{
                                labels: mosqueMonth,
                                datasets: [
                                  {
                                    label: 'مدارس ثبت شده',
                                    backgroundColor: 'rgb(93, 238, 238,0.2)',
                                    borderColor: 'rgb(93, 238, 238,1)',
                                    borderWidth: 1,
                                    hoverBackgroundColor: 'rgb(16, 187, 187,0.4)',
                                    hoverBorderColor: 'rgba(16,187,187,1)',
                                    data: mosque
                                  }
                                ]
                            }}
                            options={{
                                maintainAspectRatio: false,
                                legend: {
                                    labels: {
                                        fontColor: "#1B1C1C",
                                        fontFamily: "IRANSans",
                                    },
                                },
                                title: {
                                    display: true,
                                    text: "مدارس",
                                    fontColor: "#1B1C1C",
                                    fontFamily: "IRANSans",
                                },
                                tooltips: {
                                    callbacks: {
                                        labelTextColor: function (tooltipItem, chart) {
                                            return "#eee";
                                        },
                                        bodyFontColor: "red",
                                    },
                                    bodyFontColor: "red",
                                    titleFontFamily: "red",
                                },
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container className={classes.top}>
                    <Grid item sm={5}>
                        <Line
                            data={{
                                labels: postMonth,
                                datasets: [
                                    {
                                        label: "مطالب سایت",
                                        fill: false,
                                        lineTension: 0.1,
                                        backgroundColor: "rgba(75,192,192,0.4)",
                                        borderColor: "rgba(75,192,192,1)",
                                        borderCapStyle: "butt",
                                        borderDash: [],
                                        borderDashOffset: 0.0,
                                        borderJoinStyle: "miter",
                                        pointBorderColor: "rgba(75,192,192,1)",
                                        pointBackgroundColor: "#fff",
                                        pointBorderWidth: 1,
                                        pointHoverRadius: 5,
                                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                                        pointHoverBorderColor: "rgba(220,220,220,1)",
                                        pointHoverBorderWidth: 2,
                                        pointRadius: 1,
                                        pointHitRadius: 10,
                                        data: post,
                                    },
                                ],
                            }}
                            width={100}
                            height={300}
                            options={{
                                maintainAspectRatio: false,
                                title: {
                                    display: true,
                                    text: "مطالب سایت",
                                    fontColor: "#1B1C1C",
                                    fontFamily: "IRANSans",
                                },
                                legend: {
                                    labels: {
                                        fontColor: "#1B1C1C",
                                        fontFamily: "IRANSans",
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item sm={2}></Grid>
                    <Grid item sm={5}>
                        <Bar
                            data={{
                                labels: commentMonth,
                                datasets: [
                                    {
                                        labels: {
                                            // This more specific font property overrides the global property
                                            fontColor: "red",
                                        },
                                        label: "تعداد نظرات کاربران ",
                                        backgroundColor: "rgba(255,99,132,0.2)",
                                        borderColor: "rgba(255,99,132,1)",
                                        borderWidth: 1,
                                        hoverBackgroundColor: "rgba(255,99,132,0.4)",
                                        hoverBorderColor: "rgba(255,99,132,1)",
                                        data: comment,
                                        fontColor: "red",
                                        title: {
                                            fontColor: "#1B1C1C",
                                            labels: {
                                                // This more specific font property overrides the global property
                                                fontColor: "red",
                                                fontFamily: "IRANSans",
                                            },
                                        },
                                    },
                                ],
                            }}
                            width={100}
                            height={300}
                            options={{
                                maintainAspectRatio: false,
                                legend: {
                                    labels: {
                                        // This more specific font property overrides the global property
                                        fontColor: "gray",
                                        fontFamily: "IRANSans",
                                    },
                                },
                                title: {
                                    fontColor: "red",
                                    labels: {
                                        // This more specific font property overrides the global property
                                        fontColor: "red",
                                        fontFamily: "IRANSans",
                                    },
                                },
                                tooltips: {
                                    titleFontSize: 20,
                                    titleSpacing: 40,
                                    titleFontStyle: "semibold",
                                },
                            }}
                        />
                    </Grid>
                </Grid>
            </>
        );
    }
}
export default withTranslation("infrastracture")(withStyles(styles)(Charts));

