import TileCoord from './tileCoord';
import ITileRegion, { ITilePicker } from './regions/iTileRegion';

export default class TileRect implements ITileRegion, ITilePicker {

	public minRow: number;
	public minCol: number;
	public maxRow: number;
	public maxCol: number;

	constructor(start_row: number, start_col: number, end_row: number, end_col: number) {

		this.minRow = start_row;
		this.minCol = start_col;
		this.maxRow = end_row;
		this.maxCol = end_col;
	}

	public has(coord: TileCoord): boolean {

		if (coord.row < this.minRow || coord.col < this.minCol || coord.col >= this.maxCol || coord.row >= this.maxRow) {
			return false;
		}
		return true;

	}

	public contains(row: number, col: number): boolean {
		return row >= this.minRow && row < this.maxRow && col >= this.minCol && col < this.maxCol;
	}


	public equals(other: TileRect): boolean {
		return other.minRow == this.minRow && other.maxRow == this.maxRow && other.minCol == this.minCol && other.maxCol == this.maxCol;
	}

	public pickTile(): TileCoord {
		return new TileCoord(
			this.minRow + Math.random() * (this.maxRow - this.minRow),
			this.minCol + Math.random() * (this.maxCol - this.minCol));
	}

	/**
	 * returns the number of tiles in the range, assuming end tiles are not inclusive.
	 */
	public getSize(): number {

		return (this.maxRow - this.minRow) * (this.maxCol - this.minCol);

	} //

	public toString(): string {

		return "col: " + this.minCol + " -> " + this.maxCol + "\nRow: " + this.minRow + " -> " + this.maxRow;
	}

	public *[Symbol.iterator]() {

		for ( var r:number = this.minRow; r < this.maxRow; r++ ) {
			for ( var c:number= this.minCol; c < this.maxCol; c++ ) {
				yield new TileCoord( r, c );
			}
		}
		return this;

	}

} //
