import "./index.html";
import "./index.less";
import dva from "dva";
import { history } from './config'

// 1. Initialize
const app = dva({
    history: history,
});

// 2. Plugins
//app.use({});

// 3. Model
//app.model(require('./models/example'));
const models = require.context('./models', true, /^\.\/.*\.js$/)
models.keys().filter(key => key !== './validator.js')
    .map(key => app.model(models(key)))


// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
