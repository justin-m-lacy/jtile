
import TileRange from '../regions/tileRange';
import TileMap from '../tileMap';
import TileType from '../tileType';
import TileLayer from '../tileLayer';
import TileCoord from '../tileCoord';
import Direction from '../search/direction';
import TileRandom from '../util/TileRandom';

export  default class RiverGenerator {

		public bounds:TileRange;
		public tileType:TileType;

		/**
		 * chance per tile that the river will turn.
		 */
		public turnRate:number = 0.2;

		public maxLength:number = 20;

		public layer:TileLayer;

		constructor() {}

		public generate( map:TileMap ):void {

			if ( this.bounds == null ) {
				this.bounds = new TileRange( 0, 0, map.rows, map.cols );
			}
			this.path();

		}

		private path():void {

			var start:TileCoord = this.bounds.pickTile();
			var dir:Direction = TileRandom.Direction();

			var row:number = start.row;
			var col:number = start.col;
			var count:number = this.maxLength;

			while ( count-- > 0 ) {

				if ( Math.random() < this.turnRate ) {
					dir = TileRandom.getTurn( dir );
				}
				switch ( dir ) {
					case Direction.UP:
						row++;
						break;
					case Direction.DOWN:
						row--;
						break;
					case Direction.LEFT:
						col--;
						break;
					case Direction.RIGHT:
						col++;
						break;
				}
				if ( this.bounds.contains( row, col ) === false ) return;

				this.layer.setTileType( row, col, this.tileType.id );


			}


		}

	}