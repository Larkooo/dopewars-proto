import { Scene, Cameras, Tilemaps } from 'phaser';

export class Game extends Scene {
  map: Phaser.Tilemaps.Tilemap;
  controls: Cameras.Controls.FixedKeyControl;

  hoveredTile: Phaser.Tilemaps.Tile;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  create(): void {
    this.input.on('pointerdown', () => {
      if (!this.hoveredTile)
        return;

      this.cameras.main.pan(this.hoveredTile.getCenterX(), this.hoveredTile.getCenterY(), 1000, 'Sine.easeInOut');
    });

    this.map = this.make.tilemap({ key: "map" });

    // not my assets, used only for demonstration purposes
    const tileset = this.map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

    this.map.createLayer("Below Player", tileset, 0, 0);
    this.map.createLayer("World", tileset, 0, 0);
    this.map.createLayer("Above Player", tileset, 0, 0);

    const camera = this.cameras.main;

    // arrows to control cam
    const cursors = this.input.keyboard.createCursorKeys();
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
      camera: camera,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5
    });

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }

  update(time: number, delta: number): void {
    // update controls
    this.controls.update(delta);

    // just basically loop over all of the available layers and their tiles and check if they intersect with the mouse
    // not the best method but just for demonstration purposes
    this.map.layers.forEach(layer => {
      if (layer.name !== "Below Player")
        return;

      for (let j = 0; j < layer.data.length; j++)
      {
        for (let k = 0; k < layer.data[j].length; k++)
        {
          const tile: Phaser.Tilemaps.Tile = layer.data[j][k];

          // pos in bounds, reduce tile's alpha
          if (tile.getBounds() && (tile.getBounds() as Phaser.Geom.Rectangle).contains(this.input.activePointer.worldX, this.input.activePointer.worldY))
          {
            tile.alpha = 0.7;
            this.hoveredTile = tile;
          }
          else if (tile.alpha !== 1.0)
          {
            tile.alpha = 1.0;
          }
        }
      }
    })

    console.log(this.hoveredTile);
  }
}
