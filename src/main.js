import Viewer from './app/Viewer';
const app = new Viewer;

app.init();

document.getElementById('addCube').addEventListener('click', () => app.addCube('randomCube', true));
document.getElementById('clearAll').addEventListener('click', () => app.clearAll());