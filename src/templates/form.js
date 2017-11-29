import listItem from './locationListItem.js'
const BTN_TEXT_LOADING = 'Generating route...'
const BTN_TEXT_DEFAULT = 'Plot route'

export default ({ locations, ui }) => `
    <div id="form" class="route-plotter_form form-routes">
        <ul class="form-routes_list">
            ${
                locations.length > 0
                    ? locations.map(listItem).join('\n')
                    : `<li class="form-routes_list_empty">Select 2 or more locations from the map</li>`
            }
        </ul>
        <button class="btn db form-routes_list_btn" type="button" ${
            locations.length >= 2 && !ui.formSubmitting ? `` : `disabled`
        }>${ui.formSubmitting ? BTN_TEXT_LOADING : BTN_TEXT_DEFAULT}</button>
    </div>
`
