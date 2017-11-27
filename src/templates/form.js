export default locations => `
    <div id="form" class="route-plotter_form form-routes">
        <ul class="form-routes_list">
            ${locations
                .map(
                    ({ id, address }) => `
                        <li
                            class="form-routes_list_item"
                            data-id="${id}"
                        >${address}</li>
                    `
                )
                .join('\n')}
        </ul>
        <button class="btn db" type="submit">Plot route</button>
    </div>
`
