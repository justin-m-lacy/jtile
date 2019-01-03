import ITileRegion from './iTileRegion';
import TileCoord from '../tileCoord';

/**
* Currently Unused as TileCoord now implements ITileRegion. However, a SingleTile is mutable,
* whereas a TileCoord should not be changed.
*
* Region represented by a single tile. Useful in combining regions
* to make larger regions.
*/
export default class SingleTile implements ITileRegion {

		public row:number;
		public col:number;

		public constructor( r:number=0, c:number=0 ) {
			this.row = r;
			this.col = c;
		}

		public pickTile():TileCoord {
			return new TileCoord( this.row, this.col );
		}

		public has( coord:TileCoord ):boolean {

			return ( this.row === coord.row && this.col === coord.col );

		}

		public contains( r:number, c:number ):boolean {

			return ( this.row === r && this.col === c );

		}

		*[Symbol.iterator]() {
			yield new TileCoord( this.row, this.col );
		}

		public getSize():number {
			return 1;
		}

	}
