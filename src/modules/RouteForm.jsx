import React, { Component } from 'react'
import Noty from 'noty'
import RouteItem from './RouteItem.jsx'

import { processInput } from '../utils.js'
import { generateRoute } from '../api.js'

const ENTER_KEY = 13

export default class RouteForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: false,
            submiting: false,
            locations: []
        }
    }

    handleNewLocation = e => {
        if (e.keyCode !== ENTER_KEY) return
        e.preventDefault()
        const { success, data } = processInput(e.target.value)

        if (success) {
            const { locations } = this.state
            this.setState({
                locations: [...locations, ...data]
            })
            e.target.value = ''
        } else {
            new Noty({
                text: 'Invalid input',
                type: 'error',
                timeout: 1000
            }).show()
        }
        this.setState({ error: !success })
    }

    handleItemClick = location => {
        const { locations } = this.state
        const newLocations = locations.filter(l => {
            return location !== l
        })
        this.setState({ locations: newLocations })
    }

    handleSubmit = async e => {
        const { locations } = this.state
        this.setState({ submiting: true })

        try {
            const res = await generateRoute(locations)
            window.location.hash = res.data.token
        } catch (error) {
            new Noty({
                text: error.message,
                type: 'error',
                timeout: 1000
            }).show()
        } finally {
            this.setState({ submiting: false })
        }
    }

    render() {
        const { locations, submiting, error } = this.state

        const inputStyle = {
            borderColor: error ? 'red' : 'initial'
        }

        return (
            <div id="form" className="route-plotter_form form-routes">
                <ul>
                    {locations.map((l, i) => (
                        <RouteItem
                            key={i}
                            lat={l[0]}
                            lng={l[1]}
                            onDelete={this.handleItemClick.bind(this, l)}
                        />
                    ))}
                </ul>
                <input
                    className="db"
                    type="text"
                    placeholder="Input in the format [lat],[lng], tap Enter to add to route."
                    style={inputStyle}
                    onKeyDown={this.handleNewLocation}
                />
                <button
                    className="btn db"
                    type="button"
                    onClick={this.handleSubmit}
                    disabled={locations.length < 2 || submiting}
                >
                    {locations.length < 2
                        ? `Add at least ${2 - locations.length} more locations`
                        : 'Plot route'}
                </button>
            </div>
        )
    }
}
