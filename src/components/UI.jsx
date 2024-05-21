import React from 'react'


export function UI() {

    return (
        <div id="ui">
            <div id="title-bar">
                <div class="title-bar-left-items title-bar-items">
                    Left Side Score
                </div>
                <div class="title-bar-center-items title-bar-items">
                    <span id="city-name">CENG495 Project</span>
                    <span>&nbsp; - &nbsp;</span>
                    <span id="sim-time">17/05/2024</span>
                </div>
                <div class="title-bar-right-items title-bar-items">
                    <img id="population-icon" src="../public/icons/person.png" />
                    <span id="population-counter">Right Side</span>
                </div>
            </div>
            <div id="ui-toolbar" class="container">
                <button id='button-select' class="ui-button selected" data-type="select"
                    onclick="ui.onToolSelected(event)">
                    <img class="toolbar-icon" src="../public/icons/select-color.png" />
                </button>
                <button id='button-bulldoze' class="ui-button" data-type="bulldoze"
                    onclick="ui.onToolSelected(event)">
                    <img class="toolbar-icon" src="../public/icons/bulldozer-color.png" />
                </button>
                <button id='button-residential' class="ui-button" data-type="residential"
                    onclick="ui.onToolSelected(event)">
                    <img class="toolbar-icon" src="../public/icons/house-color.png" />
                </button>
                <button id='button-commercial' class="ui-button" data-type="commercial"
                    onclick="ui.onToolSelected(event)">
                    <img class="toolbar-icon" src="../public/icons/store-color.png" />
                </button>
                <button id='button-industrial' class="ui-button" data-type="industrial"
                    onclick="ui.onToolSelected(event)">
                    <img class="toolbar-icon" src="../public/icons/factory-color.png" />
                </button>
                <button id='button-road' class="ui-button" data-type="road"
                    onclick="ui.onToolSelected(event)">
                    <img class="toolbar-icon" src="../public/icons/road-color.png" />
                </button>
                <button id='button-power-plant' class="ui-button" data-type="power-plant"
                    onclick="ui.onToolSelected(event)">
                    <img class="toolbar-icon" src="../public/icons/power-color.png" />
                </button>
                <button id='button-power-line' class="ui-button" data-type="power-line"
                    onclick="ui.onToolSelected(event)">
                    <img class="toolbar-icon" src="../public/icons/power-line-color.png" />
                </button>
                <button id='button-pause' class="ui-button" onclick="ui.togglePause()">
                    <img id='pause-button-icon' class="toolbar-icon" src="../public/icons/pause-color.png" />
                </button>
            </div>
            <div id="info-panel" class="container">
                <div id="instructions">
                    INTERACT - Left Mouse<br />
                    ROTATE - Right Mouse<br />
                    PAN - Control + Right Mouse<br />
                    ZOOM - Scroll
                </div>
                <div id="version">
                    v0.3.0
                </div>
            </div>

        </div>
    );
}