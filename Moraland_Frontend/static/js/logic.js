//Logic.js file

// ============================================
//          Initializing Constants
// ============================================

const serverUrl = "https://ze0kijn3y2jo.usemoralis.com:2053/server";
const appId = "StyqWSTW35gx9rcc7WYZY66zTCURc2FdZTm9hUsm";

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
const unassignables = [ 
    "0xf3ce3e48667649091ed7c33c9edd3bdf6683b101e4c6df4d847c7f9f038e4434",
    "0x2f92fa629f7a5735c83956c713b51ec868ddf8f0eaa650a5652873554a3c4725",
    "0x8b50d3acf3113e6275d60a4fa70cc23cdd1d1a39a0ba1994286b38c07d302ad9",
    "0x97255074fdd7e3d3325b2f2c1dce9f1097696f6b4947ca410e90a2b7f6eb6f04",
    "0x7f930a017f921c3b3c57be76fc879095c015401ab28fed013504e6fb598c7955",
    "0xb181091be9416162a2820ddfe2f6878e567139a50cab661e52d4f3e70e33774a",
    "0x9eeff8aa774613bbb94385083deb39df1f10b2f05692c95263c2b221960ecca9",
    "0xc863be1a7bf935989ad343563369d774c9f44de54682b1b468472ebdd4fb52af",
    "0xbc2f3e780e63f6f78be4b7e4c6f348de13962838b5e4874cb68e375560e92739",
    "0x841bca84c89d2830ad7e703a36ee9534f80f0c39a462491c4c2a4489dec6b9cf",
    "0x39cac9e1eea3e33bea94196422490d66ddb1aa06bf4771c7fe3aa3456a513a1c",
    "0x834ed64df3e5b738143b3cba1ba19786ea8ef509dc58327f4b1ab0307c75872e"
]

// Web3 constants
const ethers = Moralis.web3Library;
const contractAddress = "0xf8e81D47203A594245E36C48e151709F0C19fBe8";
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "assignee",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "bytesId",
				"type": "bytes"
			}
		],
		"name": "Assigned",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tokenURI",
				"type": "string"
			},
			{
				"internalType": "bytes",
				"name": "bytesId",
				"type": "bytes"
			}
		],
		"name": "assign",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "bytesId",
				"type": "bytes"
			}
		],
		"name": "exist",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
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
    setPlotData();
}

// Animate 
function move(direction) {
    const validMove = validateMove(direction);
    if(validMove) {
        updateView(direction);
        drawMapSection(mainCtx,mapView.mapOffsetX,mapView.mapOffsetY);
        updatePlotLocation();
        drawCursor(mainCtx, plotViewOffsets, plotViewOffsets);
        drawMapSection(plotCtx,-1 * plotView.locationX, -1 * plotView.locationY);
        setPlotData();
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
            break;
        case 'ArrowDown':
            plotView.plotY += 1;
            mapView.mapOffsetY -= plots + roads;
            break;
        case 'ArrowLeft':
            plotView.plotX -= 1;
            mapView.mapOffsetX += plots + roads;
            break;
        case 'ArrowUp':
            plotView.plotY -= 1;
            mapView.mapOffsetY += plots + roads;
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

// UI function
function setPlotData() {
    const plotID = ethers.utils.id(JSON.stringify(plotView));
    document.getElementById("plotX").value = plotView.plotX;
    document.getElementById("plotY").value = plotView.plotY;
    document.getElementById("locationX").value = plotView.locationX;
    document.getElementById("locationY").value = plotView.locationY;
    document.getElementById("plotID").value = plotID;
    isPlotAssignable(plotID);
}

function isPlotAssignable(plotID) {
    const _unassignagle = unassignables.includes(plotID);

    if (_unassignagle) {
        document.getElementById("claimButton").setAttribute("disabled",null);
    }
    else {
        document.getElementById("claimButton").removeAttribute("disabled");
    }
}

function displayMessage(messageType, message){
    const messages = {
                "00":`<div class= "alert alert-success"> ${message} </div>`,
                "01":`<div class= "alert alert-danger"> ${message} </div>`
            }
    document.getElementById("notifications").innerHTML = messages[messageType];
}

//web3 functions
async function mint(_tokenURI) {
    const contractOptions = {
        contractAddress: contractAddress,
        abi: contractABI,
        functionName: "assign",
        params: {
            tokenURI:_tokenURI,
            bytesId:document.getElementById("plotID").value
        }
    }
    try{
        const transaction = await Moralis.executeFunction(contractOptions);
        await transaction.wait();
        displayMessage("00","Transaction confirmed with hash "+transaction.hash);
    }
    catch(error){
        displayMessage("01","Transaction reverted see console for details");
        console.log(error)
    }
}

async function login(){
    Moralis.Web3.authenticate().then(async function (){
        const chainIdHex = await Moralis.switchNetwork("0x13881");
    });
}

async function assignPlot() {
    const plotID = document.getElementById("plotID").value;
    //const assigned = await isPlotAssigned(plotID);
    //if (!assigned) {
        const metadata = {
            "PlotID":plotID,
            "PlotX":document.getElementById("plotX").value,
            "PlotY":document.getElementById("plotY").value,
            "LocationX":document.getElementById("locationX").value,
            "LocationY":document.getElementById("locationX").value,
            "image":"https://moralis.io/wp-content/uploads/2021/06/Moralis-Glass-Favicon.svg",
        }
        const metadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
        await metadataFile.saveIPFS();
        const metadataURI = metadataFile.ipfs();
        await mint(metadataURI);
    //}
    //else{
    //    displayMessage("01","Plot is already assigned");
    //}
}

async function isPlotAssigned(plotID) {
    const contractOptions = {
        contractAddress: contractAddress,
        abi: contractABI,
        functionName: "exist",
        params: {
            bytesId:plotID
        }
    }
    return await Moralis.executeFunction(contractOptions);
}

Moralis.start({ serverUrl, appId }); 
login();

drawCanvas();

window.addEventListener('keydown', (e) => {
    move(e.key);
});