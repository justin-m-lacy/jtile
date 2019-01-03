import TileCoord from "../tileCoord";
import ITileRegion from './iTileRegion';

	/**
	 * origin is assumed to be within the center of the tile.
	 * radius can be any and:number is compared to tile centers.
	 * 
	 * Tiles at an exact distance of 'radius' are included within the TileCircle.
	 */

	/// <summary>
	/// Describes an approximate circle of tiles.
	/// The origin is assumed to be the center of any tile specified.
	/// Radius can be any and:number inclusion within the circle is
	/// determined by tile center.
	/// 
	/// Tiles at an exact distance of the radius are included within the circle.
	/// </summary>
export default class TileCircle implements ITileRegion {

		/// <summary>
		/// The way the circle Iterator works, the circle coordinates might
		/// need to be constrainted to the tileMap boundaries.
		/// </summary>
		public absMinRow:number = Number.MIN_SAFE_INTEGER;
		public absMinCol = Number.MIN_SAFE_INTEGER;
	
		public absMaxRow:number = Number.MAX_SAFE_INTEGER;
		public absMaxCol:number = Number.MAX_SAFE_INTEGER;

		/// <summary>
		/// Messy way to bound the circle within a tileMap. absMin is also set because in some
		/// cases it makes sense to allow for negative tile coordinates, and not clip to zero.
		/// maxCol, and maxRow are not included in the region, as they will usually be set
		/// to TileMap.Rows, TileMap.Cols
		/// </summary>
		/// <param name="minRow"></param>
		/// <param name="minCol"></param>
		/// <param name="maxRow"></param>
		/// <param name="maxCol"></param>
		public setBounds( minRow:number, minCol:number, maxRow:number, maxCol:number ):void {

			this.absMinRow = minRow;
			this.absMinCol = minCol;
			this.absMaxCol = maxCol-1;
			this.absMaxRow = maxRow-1;

		}

		public originRow:number;
		public originCol:number;


		public radius:number;

		public getOrigin():TileCoord { return new TileCoord( this.originRow, this.originCol ); }
		public setOrigin( t:TileCoord ) { this.originRow = t.row; this.originCol = t.col; }

		public constructor( originRow:number=0, originCol:number=0, radius:number=1 ) {

			this.originRow = originRow;
			this.originCol = originCol;

			this.radius = radius;

		}

		public has( coord:TileCoord ):boolean {

			var dr:number = coord.row - this.originRow;
			var dc:number = coord.col - this.originCol;
			return ( dr * dr + dc * dc <= this.radius*this.radius );

		}

		public contains( r:number, c:number ):boolean {

			var dr:number = r - this.originRow;
			var dc:number = c - this.originCol;
			return ( dr * dr + dc * dc <= this.radius * this.radius );

		}

		*[Symbol.iterator]():Iterator<TileCoord> { return new CircleIterator(this); }

		/// <summary>
		/// TODO: Use a faster pixel-type circle fill algorithm.
		/// </summary>
		/// <returns></returns>
		public getSize():number {

			var r2:number = this.radius * this.radius;

			// in this context, maxCol,maxRow is inclusive.
			var minRow:number = Math.max( this.absMinRow, Math.floor( this.originRow - this.radius ) );
			var minCol:number = Math.max( this.absMinCol, Math.floor( this.originCol - this.radius ) );
			var maxRow:number = Math.min( this.absMaxRow, Math.ceil( this.originCol + this.radius ) );
			var maxCol:number = Math.min( this.absMaxCol, Math.ceil( this.originCol + this.radius ) );

			var count:number = 0;
			var dr2:number;
			var dc2:number;

			for ( var r:number = minRow; r <= maxRow; r++ ) {

				dr2 = r - this.originRow;
				dr2 *= dr2;

				for ( var c:number = minCol; c <= maxCol; c++ ) {

					dc2 = c - this.originCol;
					dc2 *= dc2;
					if ( dr2 + dc2 <= r2 ) {
						count++;
					}

				}

			}

			return count;

		}

	/// <summary>
	/// TODO: Not yet implemented.
	/// </summary>
	/// <returns></returns>
	public pickTile():TileCoord {
		return new TileCoord( this.originRow, this.originCol );
	}

}

class CircleIterator implements Iterator<TileCoord> {

		private radius2:number;

		originRow:number;
		originCol:number;

		minRow:number;
		minCol:number;
		maxRow:number;
		maxCol:number;

		private curRow:number;
		private curCol:number;

		public constructor( circle:TileCircle ) {

			this.originRow = circle.originRow;
			this.originCol = circle.originCol;

			var radius:number = circle.radius;

			var minRow = Math.max( circle.absMinRow, Math.floor( this.originRow - radius ) );
			var minCol = Math.max( circle.absMinCol, Math.floor( this.originCol - radius ) );

			var maxRow = Math.min( circle.absMaxRow, Math.ceil( this.originRow + radius ) );
			var maxCol = Math.min( circle.absMaxCol, Math.ceil( this.originCol + radius ) );

			// now square.
			this.radius2 = radius * radius;

			this.curRow = minRow;
			this.curCol = minCol - 1;

		}

		public get current():TileCoord {
			return new TileCoord( this.curRow, this.curCol );
		}
		
		public next():IteratorResult<TileCoord> {

			var c:number = this.curCol;
			var r:number = this.curRow;

			var dr2:number = r - this.originRow;
			dr2 *= dr2;
			var dc2:number;

			do {

				c++;
				if ( c > this.maxCol ) {
					c = this.minCol;
					r++;
					if ( r > this.maxRow ) {
						return { value:this.current, done:false };
					}
					dr2 = r - this.originRow;
					dr2 *= dr2;

				}
				dc2 = c - this.originCol;
				dc2 *= dc2;
				if ( dc2 + dr2 <= this.radius2 ) {

					this.curCol = c;
					this.curRow = r;
					return { value:this.current, done:true };

				}
					
			} while ( true );

		}

		public reset():void {
			this.curRow = this.minRow;
			this.curCol = this.minCol-1;
		}

	}

	export { CircleIterator as CircleIterator };