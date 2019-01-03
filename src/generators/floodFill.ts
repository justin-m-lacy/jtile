import TileLayer from '../tileLayer';
import TileType from '../tileType';
import TileCoord from '../tileCoord';

	/**
	 * Flood fill a random area from the region with the given tile type.
	 * Stops at any border from a given border list.
	 */
export default class FloodTileFill {

		borderTypes:TileType[];
		fillType:TileType;

		layer:TileLayer;

		visited:HashSet<TileCoord>;
		fringe:TileCoord[];

		public FloodTileFill( fill:TileType, borders:TileType[] ) {

			this.fillType = fill;
			this.borderTypes = borders;

		}

		public generate( layer:TileLayer, region:ITileRegion ):void {

			this.layer = layer;

			// Get a starting point.
			var coord:TileCoord = region.pickTile();

			var visited = new HashSet<TileCoord>();
			var fringe = new TileCoord[]();

			visited.Add( coord );
			do {

				this.visit( coord );
				coord = fringe.Pop();

			} while ( fringe.Count > 0 );

		}

		private visit( coord:TileCoord ):void {

			var type:TileType;

			coord.row -= 1;

			if ( coord.row >= 0 && !this.visited.has( coord ) ) {

				this.visited.add( coord );
				type = layer.GetTileType( coord.row, coord.col );
				if ( !this.isBorder( type ) ) {

					layer.SetTileType( coord.row, coord.col, this.fillType );
					this.fringe.push( coord );

				}
	
			}

			coord.row += 2;     // since r was -1 before.
			if ( coord.row < layer.Rows && !this.visited.Contains( coord ) ) {

				this.visited.add( coord );
				type = layer.GetTileType( coord.row, coord.col );
				if ( !this.isBorder( type ) ) {

					layer.SetTileType( coord.row, coord.col, this.fillType );
					this.fringe.push( coord );

				}

			}

			coord.row -= 1;
			coord.col -= 1;
			if ( coord.col >= 0 && !this.visited.Contains( coord ) ) {

				this.visited.Add( coord );
				type = layer.GetTileType( coord.row, coord.col );
				if ( !this.isBorder( type ) ) {

					layer.SetTileType( coord.row, coord.col, this.fillType );
					this.fringe.push( coord );

				}

			}

			coord.col += 2;
			if ( coord.col < layer.Cols && !this.visited.Contains( coord ) ) {

				this.visited.add( coord );
				type = layer.GetTileType( coord.row, coord.col );
				if ( !this.isBorder( type ) ) {

					layer.SetTileType( coord.row, coord.col, this.fillType );
					this.fringe.push( coord );

				}

			}

		}

		private isBorder( type:TileType ):boolean {

			for ( var i:number = this.borderTypes.length - 1; i >= 0; i-- ) {
				if ( this.borderTypes[i] == type ) {
					return true;
				}
			}
			return false;

		}

	}