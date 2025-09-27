document.addEventListener('DOMContentLoaded', () => {
    const puzzleContainer = document.getElementById('puzzle-container');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const imageSelect = document.getElementById('image-select');
    const modeSelect = document.getElementById('mode-select');
    const congratsModal = document.getElementById('congratsmodal');
    const closeModal = document.querySelector('.close-btn');
    const winSound = document.getElementById('win-sound');
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    const emptyTileClass = 'empty';
    let tiles = [];
    let initialTiles = [];
    let gridSize = 3; 
    // FIX: Updated initial image to 'pfpchissweethomepfp.jpg'
    let currentImage = 'pfpchissweethomepfp.jpg'; 

    const images = {
        // FIX: Removed 'ipadkidstarterpack.jpg'
        'pfpchissweethomepfp.jpg': 'chi\'s sweet home',
        'pfpumaruchanpfp.jpg': 'umaru-chan',
        'doreamon.jpg': 'doraemon',
        'pfplunapfp.png': 'luna',
        'pfphamtoropfp.jpg': 'hamtaro',
        'pfpponyopfp.jpg': 'ponyo',
        'pfpsillypuppyair.jpg': 'potato'
    };

    for (const [file, name] of Object.entries(images)) {
        const option = document.createElement('option');
        option.value = file;
        option.textContent = name;
        imageSelect.appendChild(option);
    }

    // set the initial selected image
    imageSelect.value = currentImage;

    function generateInitialTiles() {
        initialTiles = [];
        const totalTiles = gridSize * gridSize;
        for (let i = 0; i < totalTiles; i++) {
            initialTiles.push(i);
        }
    }

    function setupGame() {
        gridSize = parseInt(modeSelect.value);
        currentImage = imageSelect.value;
        generateInitialTiles();
        
        const puzzleSize = gridSize * 100 + (gridSize - 1) * 5 + 6; 
        puzzleContainer.style.width = `${puzzleSize}px`;
        puzzleContainer.style.height = `${puzzleSize}px`;
        puzzleContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        puzzleContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

        tiles = [...initialTiles];
        shuffle();
    }

    function createPuzzle() {
        puzzleContainer.innerHTML = '';
        const tileCount = gridSize * gridSize;
        const tileSize = 100;
        const gapSize = 5;

        tiles.forEach((value) => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            
            if (value === tileCount - 1) { 
                tile.classList.add(emptyTileClass);
            } else {
                const originalRow = Math.floor(value / gridSize);
                const originalCol = value % gridSize;
                
                const x = -(originalCol * tileSize + originalCol * gapSize);
                const y = -(originalRow * tileSize + originalRow * gapSize);

                tile.style.backgroundImage = `url('${currentImage}')`;
                tile.style.backgroundSize = `${gridSize * tileSize + (gridSize - 1) * gapSize}px ${gridSize * tileSize + (gridSize - 1) * gapSize}px`;
                tile.style.backgroundPosition = `${x}px ${y}px`;
            }
            
            tile.dataset.value = value;
            puzzleContainer.appendChild(tile);
        });
        addEventListeners();
    }

    function addEventListeners() {
        const tileElements = document.querySelectorAll('.tile');
        tileElements.forEach(tile => {
            if (!tile.classList.contains(emptyTileClass)) {
                tile.addEventListener('click', () => {
                    moveTile(tile);
                });
            }
        });
    }

    function moveTile(clickedTile) {
        const clickedIndex = Array.from(puzzleContainer.children).indexOf(clickedTile);
        const emptyIndex = tiles.indexOf(initialTiles.length - 1);

        const isAdjacent = (
            (Math.abs(clickedIndex - emptyIndex) === 1 && Math.floor(clickedIndex / gridSize) === Math.floor(emptyIndex / gridSize)) ||
            (Math.abs(clickedIndex - emptyIndex) === gridSize)
        );

        if (isAdjacent) {
            [tiles[clickedIndex], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[clickedIndex]];
            
            createPuzzle();
            
            if (checkWin()) {
                const allTiles = document.querySelectorAll('.tile');
                allTiles.forEach(tile => {
                    tile.style.visibility = 'hidden';
                });
                
                winSound.play();
                congratsModal.style.display = 'block';
            }
        }
    }

    function checkWin() {
        for (let i = 0; i < initialTiles.length; i++) {
            if (tiles[i] !== initialTiles[i]) {
                return false;
            }
        }
        return true;
    }

    function shuffle() {
        tiles = [...initialTiles];
        
        const moves = gridSize * gridSize * 100;
        for (let i = 0; i < moves; i++) {
            const emptyIndex = tiles.indexOf(initialTiles.length - 1);
            
            const neighbors = [];
            if (emptyIndex >= gridSize) {
                neighbors.push(emptyIndex - gridSize);
            }
            if (emptyIndex < gridSize * gridSize - gridSize) {
                neighbors.push(emptyIndex + gridSize);
            }
            if (emptyIndex % gridSize !== 0) {
                neighbors.push(emptyIndex - 1);
            }
            if ((emptyIndex + 1) % gridSize !== 0) {
                neighbors.push(emptyIndex + 1);
            }

            const randomIndex = Math.floor(Math.random() * neighbors.length);
            const swapIndex = neighbors[randomIndex];
            
            [tiles[emptyIndex], tiles[swapIndex]] = [tiles[swapIndex], tiles[emptyIndex]];
        }
        
        const allTiles = document.querySelectorAll('.tile');
        allTiles.forEach(tile => {
            tile.style.visibility = 'visible';
        });

        createPuzzle();
    }

    function updateThemeToggleText() {
        if (document.body.classList.contains('dark-mode')) {
            themeToggleBtn.textContent = '🌙'; 
        } else {
            themeToggleBtn.textContent = '☀️'; 
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        updateThemeToggleText(); 
    });

    shuffleBtn.addEventListener('click', shuffle);
    imageSelect.addEventListener('change', setupGame);
    modeSelect.addEventListener('change', setupGame);
    
    closeModal.addEventListener('click', () => {
        congratsModal.style.display = 'none';
    });
    
    // Initial setup
    setupGame();
    updateThemeToggleText();
});
