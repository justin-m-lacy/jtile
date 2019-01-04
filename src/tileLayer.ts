import TileSet from "./tileSet";
import TileCoord from './tileCoord';
import Tile from './tile';
import TileType from './tileType';
import ITileRegion from "./regions/iTileRegion";

/**
 * Layer of tiles within a TileMap.
 */
export default class TileLayer {

	public layerName: string;

	/// <summary>
	/// The name of the tileSet that should be used with this TileLayer,
	/// if possible.
	/// </summary>
	public preferredSet: string;

	/// <summary>
	/// The tileSet being used on this layer.
	/// </summary>
	private _tileSet: TileSet;
	public get tileSet(): TileSet {
		return this._tileSet;
	}
	public set tileSet(v) {
		this._tileSet = v;
	}

	private tiles: Tile[][];

	private _rows: number = TileCoord.OFF_MAP;
	private _cols: number = TileCoord.OFF_MAP;

	public get rows(): number {
		return this._rows;

	}

	public get cols(): number {
		return this._cols;
	}

	public constructor(map_rows: number = 0, map_cols: number = 0) {

		this.setSize(map_rows, map_cols);

	} //

	/**
	 * Don't access the underlying tiles unless speed is required,
	 * and you know what you're doing.
	 */
	public getTiles(): Tile[][] {
		return this.tiles;
	}

	public getTile(r: number, c: number): Tile {
		return this.tiles[r][c];
	}

	public setTileType(r: number, c: number, type: number): void {
		this.tiles[r][c].tileTypeId = type;
	} //

	/// <summary>
	/// Sets the tile type of all tiles in a given region of the map.
	/// </summary>
	/// <param name="region"></param>
	/// <param name="type"></param>
	public setType(region:ITileRegion, type: TileType): void {

		let id: number = type.id;
		for (var coord of region) {

			this.tiles[coord.row][coord.col].tileTypeId = id;
		}

	} //

	/// <summary>
	/// Sets the tile type of all tiles in a given region of the map.
	/// </summary>
	/// <param name="region"></param>
	/// <param name="type"></param>
	public setRegionTypes(region:ITileRegion, type: TileType, orientation: number=0): void {

		let tile: Tile = new Tile(type.id, orientation);

		for (var coord of region) {

			this.tiles[coord.row][coord.col] = tile;
		}

	} //

	public setTile(r: number, c: number, tile: Tile): void {
		this.tiles[r][c] = tile;
	}

	/// <summary>
	/// Sets all tiles in the layer to the given tileType.
	/// </summary>
	/// <param name="type">The tileType to set the layer tiles to.</param>
	public clearTo(type: TileType): void {

		let typeId: number = type.id;

		for (let r: number = this._rows - 1; r >= 0; r--) {
			for (let c: number = this._cols - 1; c >= 0; c--) {
				this.tiles[r][c].tileTypeId = typeId;
			}
		}

	}

	/**
	 * Set all tiles in the layer to the given tile type id.
	 */
	public clear(type: number = 0): void {

		for (let r: number = this._rows - 1; r >= 0; r--) {
			for (let c: number = this._cols - 1; c >= 0; c--) {
				this.tiles[r][c].tileTypeId = type;
			}
		}

	}

	/// <summary>
	/// Sets the tileType id of a rectangle of tiles.
	/// The maximum values are included in the changed tiles.
	/// </summary>
	/// <param name="minRow"></param>
	/// <param name="minCol"></param>
	/// <param name="maxRow"></param>
	/// <param name="maxCol"></param>
	/// <param name="type">The id of the TileType to change the tiles to.</param>
	public setTypes(minRow: number, minCol: number, maxRow: number, maxCol: number, type: number): void {

		if (minRow < 0) { minRow = 0; }
		if (minCol < 0) { minCol = 0; }
		if (maxRow >= this._rows) { maxRow = this._rows - 1; }
		if (maxCol >= this._cols) { maxCol = this._cols - 1; }

		var c;
		for (let r: number = minRow; r <= maxRow; r++) {
			for (c = minCol; c <= maxCol; c++) {
				this.tiles[r][c].tileTypeId = type;
			}
		}

	}

	public getTileType(row: number, col: number): TileType {

		return this.tileSet.getTileType(this.tiles[row][col].tileTypeId);

	} //

	public getTypeId(row: number, col: number): number {

		return this.tiles[row][col].tileTypeId;

	} //

	public isEmpty(r: number, c: number): boolean {

		return this.tiles[r][c].isEmpty;

	} //

	public clearTile(r: number, c: number): void {
		this.tiles[r][c].tileTypeId = 0;
	}

	public setSize(map_rows: number, map_cols: number): void {

		// don't reallocate if the new size is the same.
		if (this.tiles) {

			if (this.rows === map_rows && this.cols === map_cols) return;

			this.resize(map_rows, map_cols);
			return;

		} //

		this._rows = map_rows;
		this._cols = map_cols;

		this.tiles = new Tile[map_rows][map_cols];

	} //


	/// <summary>
	/// Expands the layer to the new map size. If the new size is smaller in either dimension,
	/// that dimension does not change.
	/// The data of existing tiles is preserved.
	/// </summary>
	/// <param name="new_rows"></param>
	/// <param name="new_cols"></param>
	public expand(new_rows: number, new_cols: number): void {

		if (new_rows < this._rows) {
			new_rows = this._rows;
		}
		if (new_cols < this._cols) {
			new_cols = this._cols;
		}

		if (new_rows > this._rows && new_cols > this._cols) {
			this.resize(new_rows, new_cols);
		}

	}

	/// <summary>
	/// Resizes the layer to a new number of rows,columns.
	/// </summary>
	/// <param name="new_rows"></param>
	/// <param name="new_cols"></param>
	public resize(new_rows: number, new_cols: number): void {

		let newTiles: Tile[][] = new Tile[new_rows][new_cols];

		let colMax: number = Math.min(this.cols, new_cols);
		let rowMax: number = Math.min(this.rows, new_rows);

		for (let r: number = 0; r < rowMax; r++) {

			for (let c: number = 0; c < colMax; c++) {

				newTiles[r][c] = this.tiles[r][c];

			} //

		} // for-loop.

		this._rows = new_rows;
		this._cols = new_cols;

		this.tiles = newTiles;

	} //

	/// <summary>
	/// Returns a random Tile Coordinate within the tile layer.
	/// </summary>
	/// <returns></returns>
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

	*[Symbol.iterator]():Iterator<TileCoord> {

		let rows = this.rows;
		let cols = this.cols;

		for ( var r:number = 0; r < rows; r++ ) {
			for ( var c:number= 0; c < cols; c++ ) {
				yield new TileCoord( r, c );
			}
		}

	}

} // class