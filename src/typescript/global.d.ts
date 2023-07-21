import * as react from "react"
import * as react_dom from "react-dom"
import * as reactstrap from "./_reactstrap"

declare global {
    type React = typeof react
    type ReactDOM = typeof react_dom
    type Reactstrap = typeof reactstrap
}