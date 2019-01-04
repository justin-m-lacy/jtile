import TileRect from '../tileRect';
import ITileRegion from '../regions/iTileRegion';
import TileCircle from '../regions/circle';
import TileCoord from '../tileCoord';
import TileRange from '../regions/tileRange';

export default class RegionMaker {

		/**
		 * Maximum bounds from which to create the region.
		 */
		private bounds:TileRect;

		private regionType:string;

		/**
		 * If regionType is unspecified, a random region type will be used.
		 */
		public constructor( maxBounds:TileRect, regionType:string=null ) {

			this.bounds = maxBounds;
			this.regionType = regionType;

		}

		public generate():ITileRegion {

			if ( this.regionType ) {

				var val:number = Math.random();
				if ( val < 0.5 ) {
					this.regionType = "rect";
				} else {
					this.regionType = "circle";
				}

			}

			switch ( this.regionType ) {

				case "rect":
					return new TileRange( this.bounds.minRow, this.bounds.minCol, this.bounds.maxRow, this.bounds.maxCol );
				case "coord":
					return new TileCoord(
						this.bounds.minRow + Math.random()*( this.bounds.maxRow - this.bounds.minRow ),
						this.bounds.minCol + Math.random()*( this.bounds.maxCol-this.bounds.minCol ) );
				/*case "perlin":
					return new PerlinRegion( this.bounds, 0.5, Math.random()*1000000,
						Math.random()*1000000 );*/
				case "circle":

					return this.MakeCircle();

				default:
					return null;
			}

		}

		/**
		 * TODO: better circle approx.
		 */
		public MakeCircle():TileCircle {

			var midCol:number = ( this.bounds.minCol + this.bounds.maxCol ) / 2;
			var midRow:number = ( this.bounds.minRow + this.bounds.maxRow ) / 2;
			var dc:number = this.bounds.maxCol - 1 - this.bounds.minCol;
			var dr:number = this.bounds.maxRow - 1 - this.bounds.minRow;

			return new TileCircle( Math.floor(midRow), Math.floor(midCol), Math.min( dc / 2, dr / 2 ) );

		}

	}