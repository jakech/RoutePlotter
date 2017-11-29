export default ({ id, address }, index, locations) => `
    <li class="form-routes_list_item cf" data-id="${id}">
        <span class="left">${address}</span>
        <div class="right">
            ${
                index > 0
                    ? '<button class="js-form-routes_list_item--up">&uarr;</button>'
                    : ''
            }
            ${
                index < locations.length - 1
                    ? '<button class="js-form-routes_list_item--down">&darr;</button>'
                    : ''
            }
            <button class="js-form-routes_list_item--delete">&times;</button>
        </div>
    </li>
`
