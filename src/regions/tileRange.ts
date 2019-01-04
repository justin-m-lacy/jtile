import ITileRegion from './iTileRegion';
import TileCoord from '../tileCoord';
import TileList from './coordList';


export default class TileRange implements ITileRegion {	//} IEnumerable<TileCoord> {

		public minRow:number;
		public maxRow:number;
		public minCol:number;
		public maxCol:number;

		public constructor( min_row:number=0, min_col:number=0,
				max_row:number=0, max_col:number=0 ) {

			this.minRow = min_row;
			this.minCol = min_col;
			this.maxRow = max_row;
			this.maxCol = max_col;
		}

		public set( min_row:number, min_col:number, max_row:number, max_col:number ):void {
			this.minRow = min_row;
			this.minCol = min_col;
			this.maxRow = max_row;
			this.maxCol = max_col;
		}

		/**
		 * Indicates if the given tile coordinate is within the TileRange.
		 */
		public has( coord:TileCoord ):boolean {

			if ( coord.row < this.minRow || coord.col < this.minCol || coord.col >= this.maxCol || coord.row >= this.maxRow ) {
				return false;
			}
			return true;

		}
		/**
		* Indicates if the given tile coordinate is within the TileRange.
		*/
		public contains( row:number, col:number ):boolean {

			if ( row < this.minRow || col < this.minCol || col >= this.maxCol || row >= this.maxRow ) {
				return false;
			}
			return true;

		}

		/**
		 * returns the number of tiles in the range, assuming end tiles are not inclusive.
		 */
		public getSize():number {

			return ( this.maxRow - this.minRow ) * ( this.maxCol - this.minCol );

		} //

		/**
		 * Returns a random coordinate within the Tile Range.
		 */
		public pickTile():TileCoord {

			return new TileCoord(
				this.minRow + Math.random()*( this.maxRow - this.minRow ),
				this.minCol + Math.random()*( this.maxCol - this.minCol) );
		}

		public toString():string {
			return "col: " + this.minCol + " -> " + this.maxCol + "\nRow: " + this.minRow + " -> " + this.maxRow;
		}

		public *[Symbol.iterator]():Iterator<TileCoord> {

			for ( var r:number = this.minRow; r < this.maxRow; r++ ) {
				for ( var c:number= this.minCol; c < this.maxCol; c++ ) {
					yield new TileCoord( r, c );
				}
			}
			return this;
	
		}

		/**
		 * Return a tile range encompassing all tiles in the given TileList.
		 * @param coords 
		 */
		public static TileRange( coords:TileList ) {

			if ( coords.getSize() === 0 ) {
				return new TileRange();
			}

			// track min/max coord. TileList has at least one coord, so the numbers
			// will be valid.
			var minRow:number = Number.MAX_SAFE_INTEGER, maxRow:number = -1;
			var minCol:number = Number.MAX_SAFE_INTEGER, maxCol:number = -1;

			for ( var coord of coords ) {

				if ( coord.row < minRow ) {
					minRow = coord.row;
				} else if ( coord.row > maxRow ) {
					maxRow = coord.row;
				}
				if ( coord.col < minCol ) {
					minCol = coord.col;
				} else if ( coord.col > maxCol ) {
					maxCol = coord.col;
				}


			}

			return new TileRange( minRow, minCol, maxRow, maxCol );

		}

	} // class