//Logic.js file

// ============================================
//             Graphic Constants
// ============================================

// Map management 
const tiles = 12;
const plots = tiles * 9;
const roads = tiles * 2;
const initialOffSets = (plots + roads);
const plotViewOffsets = (plots + (2*roads));

// Canvas and context
const mainCanvas = document.getElementById("mainCanvas");
const mainCtx = mainCanvas.getContext('2d');
const plotCanvas = document.getElementById("plotCanvas");
const plotCtx = plotCanvas.getContext('2d');
const worldImage = new Image();

// State 
const mapView = {mapOffsetX: -1*initialOffSets, mapOffsetY:-1*initialOffSets};
const plotView = {plotId: "", plotX: 0, plotY: 0, locationX: 0, locationY: 0};
// Drawing functions
function drawCanvas() {
    mainCanvas.width = 3 * plots + 4 * roads;
    mainCanvas.height = 3 * plots + 4 * roads;
    plotCanvas.width = plots;
    plotCanvas.height = plots;
    worldImage.src = 'static/img/Moraland.png';
    worldImage.onload = () => {
        initializeMap();
    }
}

function initializeMap() {
    updatePlotLocation();
    drawMapSection(mainCtx, mapView.mapOffsetX, mapView.mapOffsetY);
    drawCursor(mainCtx, plotViewOffsets, plotViewOffsets);
    drawMapSection(plotCtx,-1 * plotView.locationX, -1 * plotView.locationY);
    //setPlotData();
}

// animate 
function move(direction) {
    const validMove = validateMove(direction);
    if(validMove) {
        updateView(direction);
        drawMapSection(mainCtx,mapView.mapOffsetX,mapView.mapOffsetY);
        updatePlotLocation();
        drawCursor(mainCtx, plotViewOffsets, plotViewOffsets);
        drawMapSection(plotCtx,-1 * plotView.locationX, -1 * plotView.locationY);
    }
}

function validateMove(direction) {
    switch (direction) {
        case 'ArrowRight': return !(plotView.plotX == 5);
        case 'ArrowUp': return !(plotView.plotY == 0);
        case 'ArrowLeft': return !(plotView.plotX == 0);
        case 'ArrowDown': return !(plotView.plotY == 5);
    }
}

function updateView(direction) {
    switch (direction) {
        case 'ArrowRight':
            plotView.plotX += 1;
            mapView.mapOffsetX -= plots + roads;
            //updatePlotLocation();
            break;
        case 'ArrowDown':
            plotView.plotY += 1;
            mapView.mapOffsetY -= plots + roads;
            //updatePlotLocation();
            break;
        case 'ArrowLeft':
            plotView.plotX -= 1;
            mapView.mapOffsetX += plots + roads;
            //updatePlotLocation();
            break;
        case 'ArrowUp':
            plotView.plotY -= 1;
            mapView.mapOffsetY += plots + roads;
            //updatePlotLocation();
            break;
        default:
            break;
    }    
}

function drawMapSection(ctx, originX, originY) {
    ctx.drawImage(worldImage, originX, originY);    
}

function drawCursor(ctx,x,y) {
    ctx.strokeRect(x,y,plots,plots);
}

function updatePlotLocation() {
    plotView.locationX = -1 * mapView.mapOffsetX + plotViewOffsets;
    plotView.locationY = -1 * mapView.mapOffsetY + plotViewOffsets;
}

drawCanvas();

window.addEventListener('keydown', (e) => {
    move(e.key);
});