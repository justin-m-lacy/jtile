import TileLayer from './tileLayer';
import TileCoord from './tileCoord';
import TileType from './tileType';
import Tile from './Tile';

/**
 * Basic TileMap.
 */
export default class TileMap {

	/// <summary>
	/// Layers of tiles within the tile map.
	/// </summary>
	private layers: TileLayer[];

	/// <summary>
	/// Number of layers within the TileMap.
	/// </summary>
	public get layerCount(): number {
		return this.layers.length;
	}

	private _rows: number = TileCoord.OFF_MAP;
	public get rows(): number {
		return this._rows;
	}


	private _cols: number = TileCoord.OFF_MAP;
	public get cols(): number {
		return this._cols;
	}

	public constructor(num_layers: number = 1, map_rows: number = 1, map_cols: number = 1) {

		this._rows = map_rows;
		this._cols = map_cols;

		this.layers = new TileLayer[num_layers];

		for (var i: number = 0; i < num_layers; i++) {

			this.layers[i] = new TileLayer(map_rows, map_cols);

		} //

	} //

	/// <summary>
	///  Sets the tile types of all tiles on all tile layers to
	///  the given tile type.
	/// </summary>
	/// <param name="type">The id of the tileType that should be used.</param>
	public clear(type: number = 0): void {

		for (var i: number = this.layers.length - 1; i >= 0; i--) {
			this.layers[i].clear(type);
		}

	}

	public getTile(r: number, c: number, layer: number = 0): Tile {
		return this.layers[layer].getTile(r, c);
	}

	public getTileType(coord: TileCoord, layer: number = 0): TileType {
		return this.layers[layer].getTileType(coord.row, coord.col);
	}

	public setTileType(row: number, col: number, type: number, layer: number = 0): void {
		this.layers[layer].setTileType(row, col, type);
	}

	/// <summary>
	/// Sets a new number of tileLayers for the TileMap.
	/// Existing layers up to the new layer count are retained.
	/// </summary>
	/// <param name="layer_count"></param>
	public SetLayerCount(layer_count: number): void {

		var copyCount:number = this.layers.length;
		if (copyCount === layer_count) return;

		// only copy UP-TO layer_count. after that there is no more room.
		copyCount = Math.min(copyCount, layer_count);

		var newLayers: TileLayer[] = new TileLayer[layer_count];

		for (var i: number = 0; i < copyCount; i++) {

			newLayers[i] = this.layers[i];

		} //

		// init new layers, if any.
		for (var i: number = copyCount; i < layer_count; i++) {

			newLayers[i] = new TileLayer();

		} //

		this.layers = newLayers;

	} //

	public setMapSize(map_rows: number, map_cols: number): void {

		this._rows = map_rows;
		this._cols = map_cols;

		for (var i: number = this.layers.length - 1; i >= 0; i--) {

			this.layers[i].setSize(map_rows, map_cols);

		} //

	} //

	public resize(new_rows: number, new_cols: number): void {

		this._rows = new_rows;
		this._cols = new_cols;

		for (var i: number = this.layers.length - 1; i >= 0; i--) {

			this.layers[i].resize(new_rows, new_cols);

		} //

	} //

	public getLayer(layer_index: number): TileLayer {
		return this.layers[layer_index];
	}

	/// <summary>
	/// Returns the layer index of the given TileLayer, or -1
	/// if the layer does not exist in this map.
	/// </summary>
	/// <param name="layer"></param>
	/// <returns></returns>
	public getLayerIndex(layer: TileLayer): number {

		for (var i: number = this.layers.length - 1; i >= 0; i--) {
			if (this.layers[i] == layer) {
				return i;
			}
		}
		return -1;

	} //

	/// <summary>
	/// Returns true if the tileType at the existing Tile coordinate
	/// is blocked on any tile layer.
	/// </summary>
	/// <param name="row"></param>
	/// <param name="col"></param>
	/// <returns>true if the Tile Coordinate is blocked on any tile layer.</returns>
	public isBlocked(row: number, col: number): boolean {

		for (var i: number = this.layers.length - 1; i >= 0; i--) {

			if (this.layers[i].getTileType(row, col).solid === true) return true;

		} //

		return false;

	} //

	/**
	 * returns true if any non-floor tile is nonempty (tiletype not 0)
	 * and the base tile type is non-solid.
	 */
	public isEmpty(row: number, col: number): boolean {

		for (var i: number = this.layers.length - 1; i > 0; i--) {
			if (this.layers[i].getTypeId(row, col) !== 0) {
				return false;
			}
		} //

		if (this.layers[0].getTileType(row, col).solid === true) return false;

		return true;

	} //

	public pickTile(): TileCoord {

		return new TileCoord(Math.random() * this.rows, Math.random() * this.cols);
	}

	public has(coord: TileCoord): boolean {
		return coord.col < this.cols && coord.row < this.rows && coord.col >= 0 && coord.row >= 0;
	}

	public contains(row: number, col: number): boolean {
		return col < this.cols && row < this.rows && col >= 0 && row >= 0;
	}

	public size(): number {
		return this.rows * this.cols;
	}

	public *[Symbol.iterator]():Iterator<TileCoord> {

		for ( let r:number = 0; r < this.rows; r++ ) {
			for ( let c:number= 0; c < this.cols; c++ ) {
				yield new TileCoord( r, c );
			}
		}

	}

} // class

