import TileCoord from "../tileCoord";
import ITileRegion from './iTileRegion';
import TileRange from './tileRange';
import RegionList from './regionList';
/**
* Picks a coordinate from a list of coordinates.
*/
export default class TileList implements ITileRegion {

		coords:TileCoord[];

		public constructor( tileCoords:TileCoord[]=null ) {

			this.coords = tileCoords;

		}

		public has( coord:TileCoord ):boolean {

			for ( var c of this.coords ) {
				if ( c == coord ) {
					return true;
				}
			}
			return false;

		}

		public contains( r:number, c:number ):boolean {

			for ( var coord of this.coords ) {
	
				if ( coord.row === r && coord.col === c ) return true;

			}
			return false;
		}

		/**
		 * tiles added should be unique, for enumeration to work correctly.
		 */
		public add( row:number, col:number ):void {
			this.coords.push( new TileCoord( row, col ) );
		}
		/**
		 * tiles added should be unique, for enumeration to work correctly.
		 */
		public addCoord( t:TileCoord ):void {
			this.coords.push( t );
		}

		/**
		 * coordinate list should always contain only unique values, but if it
		 * is known that the tiles being added are already unique, use AddCoord() instead.
		 */
		public addUnique( row:number, col:number ):void {

			for( var coord of this.coords ) {

				if ( row === coord.row && col === coord.col ) {
					return;
				}
			}
			this.coords.push( new TileCoord( row, col ) );

		}

		public getSize():number {
			return this.coords.length;
		}

		public pickTile():TileCoord {

			return this.coords[
				Math.floor( Math.random()*this.coords.length )
			];

		}

		public getCoords():TileCoord[] {
			return this.coords.slice();
		}

		*[Symbol.iterator]():Iterator<TileCoord> {

			let len = this.coords.length;
			for( let i = 0; i < len; i++ ) yield this.coords[i];

			return;

		}
	
		public static FromRegion( region:RegionList ) {

			var list:TileList = new TileList();
			for ( var c of region ) {
				list.addCoord( c );
			}

			return list;

		}

		/**
		 * operator can be implicit because all tile coords are retained.
		 * NOTE: conversions to interface (ie. ITileRegion) not allowed.
		 */
		public static RangeToList( range:TileRange ) {

			var maxRow:number = range.maxRow;
			var maxCol:number = range.maxCol;

			var list:TileList = new TileList();

			for ( var r:number = range.minRow; r < maxRow; r++ ) {
				for ( var c:number = range.minCol; c < maxCol; c++ ) {
					list.addCoord( new TileCoord( r, c ) );
				}
			}

			return list;

		}

	}