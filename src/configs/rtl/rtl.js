import React from "react";
import { StylesProvider, jssPreset } from "@material-ui/core/styles";
import rtl from "jss-rtl";
import { create } from "jss";

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

export default function RTL(props) {
    return <StylesProvider jss={jss}>{props.children}</StylesProvider>;
}
