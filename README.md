# Route Plotter

### Install dependencies
`yarn install` or `npm install`

### Config
Configurations for `development` and `production` can be done inside of `webpack.dev.js` and `webpack.prod.js`.

`webpack.[dev|prod].js`
``` javascript
new webpack.DefinePlugin({
    GOOGLE_MAPS_API_URL: JSON.stringify(
        '//maps.googleapis.com/maps/api/js'
    ),
    GOOGLE_MAPS_API_KEY: JSON.stringify(
        '<YOUR API KEY>'
    ),
    SERVICE_URL: JSON.stringify('<MOCK API BASE URL>')
})
```

### Development
`yarn start` or `npm start`
It will kick off webpack dev server and open the app in your browser.
Requires that you have a mockAPI running, see [Config](#config).

### Unit tests
`yarn test` or `npm test` to run unit tests using Jest.

### Build
`yarn build` or `npm build`
The build files will be generated into `/dist/` directory, and ready to be served from an static web server.

Optionally, you can run `node server/index.js` to serve the app by a simple express server.

### Usage
Use the form on the top left to enter locations in the form of `<lat>,<lng>` seperated by newlines.
Example:
```
37.86893429,-122.2678041
37.89132957,-122.2798893
37.87041074,-122.2658093
37.87830521,-122.2691698
```
or click the map to pick a location then click `Add to route` to add locations to the form
