const App = require('./src/App');

const PORT = 3001;

App.listen(PORT, () => {
    console.log(`Servidor iniciado na PORT ${PORT}.`);
});