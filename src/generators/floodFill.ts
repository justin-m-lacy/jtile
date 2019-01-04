import TileLayer from '../tileLayer';
import TileType from '../tileType';
import TileCoord from '../tileCoord';
import ITileRegion from '../regions/iTileRegion';

	/**
	 * Flood fill a random area from the region with the given tile type.
	 * Stops at any border from a given border list.
	 */
export default class FloodTileFill {

		private borderTypes:TileType[];
		private fillType:TileType;

		private layer:TileLayer;

		private visited:Map<TileCoord,boolean>;
		private fringe:TileCoord[];

		public FloodTileFill( fill:TileType, borders:TileType[] ) {

			this.fillType = fill;
			this.borderTypes = borders;

		}

		public generate( layer:TileLayer, region:ITileRegion ):void {

			this.layer = layer;

			// Get a starting point.
			let coord:TileCoord = region.pickTile();

			let visited = new Map<TileCoord,boolean>();
			let fringe = [];

			visited.set( coord, true );

			do {

				this.visit( coord );
				coord = fringe.pop();

			} while ( fringe.length > 0 );

		}

		private visit( coord:TileCoord ):void {

			let type:TileType;

			coord.row -= 1;

			if ( coord.row >= 0 && this.visited.has( coord ) === false ) {

				this.visited.set( coord, true );
				type = this.layer.getTileType( coord.row, coord.col );
				if ( this.isBorder( type ) === false ) {

					this.layer.setTileType( coord.row, coord.col, this.fillType.id );
					this.fringe.push( coord );

				}
	
			}

			coord.row += 2;     // since r was -1 before.
			if ( coord.row < this.layer.rows && this.visited.has( coord ) === false ) {

				this.visited.set( coord, true );
				type = this.layer.getTileType( coord.row, coord.col );
				if ( !this.isBorder( type ) ) {

					this.layer.setTileType( coord.row, coord.col, this.fillType.id );
					this.fringe.push( coord );

				}

			}

			coord.row -= 1;
			coord.col -= 1;
			if ( coord.col >= 0 && this.visited.has( coord ) === false ) {

				this.visited.set( coord, true );
				type = this.layer.getTileType( coord.row, coord.col );
				if ( !this.isBorder( type ) ) {

					this.layer.setTileType( coord.row, coord.col, this.fillType.id );
					this.fringe.push( coord );

				}

			}

			coord.col += 2;
			if ( coord.col < this.layer.cols && this.visited.has( coord ) === false ) {

				this.visited.set( coord, true );
				type = this.layer.getTileType( coord.row, coord.col );
				if ( !this.isBorder( type ) ) {

					this.layer.setTileType( coord.row, coord.col, this.fillType.id );
					this.fringe.push( coord );

				}

			}

		}

		private isBorder( type:TileType ):boolean {

			for ( let i:number = this.borderTypes.length - 1; i >= 0; i-- ) {
				if ( this.borderTypes[i] === type ) {
					return true;
				}
			}
			return false;

		}

	}