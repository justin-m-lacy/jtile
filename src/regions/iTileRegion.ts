import TileCoord from '../tileCoord';

	/**
	 * A class which is able to choose and provide a tile coordinate.
	 * It may be random, or selective.
	 */
	export interface ITilePicker {

		pickTile():TileCoord;

	}

	//IEnumerable<TileCoord>
	export default interface ITileRegion extends ITilePicker, Iterable<TileCoord> {

		/**
		 * Return true if coord is contained in the region.
		 */
		has( coord:TileCoord ):boolean;

		/**
		 * Return true if row,col is contained in the region.
		 */
		contains( row:number, col:number ):boolean;

		getSize():number;

	}
