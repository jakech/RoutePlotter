export default locations => `
    <div id="form" class="route-plotter_form form-routes">
        <ul class="form-routes_list">
            ${
                locations.length > 0
                    ? locations
                          .map(
                              ({ id, address }) => `
                        <li
                            class="form - routes_list_item"
                            data-id="${id}"
                        >${address}</li>
                    `
                          )
                          .join('\n')
                    : `<li class="form-routes_list_empty">Select locations from the map</li>`
            }
        </ul>
        <button class="btn db form-routes_list_btn" type="button">Plot route</button>
    </div>
`
