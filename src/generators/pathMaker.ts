
import TileCoord from '../tileCoord';
import TileMap from '../tileMap';
import TileType from '../tileType';
import TileLayer from '../tileLayer';

import BaseGenerator from './primary/baseGenerator';

	/**
	 * Ensures a path exists between two tiles on the map.
	 * If no path exists, blocked tiles are given walkable tile types to create a path.
	 */
export default class PathMaker extends BaseGenerator {

		/**
		 * Cost to use an unwalkable tile-type. Giving blocked tiles a high path cost,
		 * ensures blocked tiles are considered last for path-creation.
		 */
		private static MAX_COST:number = 1000*1000;

		/**
		 * Tiles for each layer that can be used to create a walkable path.
		 */
		private List< ITileTypeChoice> replacableList;

		/**
		 * Tile types considered to be blocking the path for each layer
		 *.
		 * NOTE: separate lists for blockers and walkable types allows some types to not block,
		 * but also not be walkable replacement types either.
		 */
		//private List< ICollection<TileType>>  blockers;

		private blockers:BlockingTypes;

		/**
		 * blockers: Tile types that are considered blocking tiles for a path on each tile layer.
		 *
		 * replaceTypes: Replacement types for each tile layer... 0,1...
		 * These types will replace any blocking tiles necessary to form a path between two points on the map.
		 *
		 */
		public constructor( blockers:BlockingTypes, replaceTypes:ITileTypeChoice[] ) {

			super();
		
			this.replacableList = replaceTypes;
			this.blockers = blockers;

		}

		public generate( map:TileMap, start:TileCoord, end:TileCoord ):void {

			this.curMap = map;

			var pather:CustomPather = new CustomPather( map, this.TileDist );
			var path:TileCoord[] = pather.FindPath( start, end );

			if ( path != null && path.length > 0 ) {
				this.fixPath( path );
			}

			// make sure not to hold onto the map.
			this.curMap = null;

		}
	
		/**
		 * Fix the tile path by replacing any blocked tiles with a tile type
		 * from walkableTypes.
		 */
		private fixPath( path:TileCoord[] ):void {

			var type:TileType;
			var layer:TileLayer;

			var num_layers:number = this.curMap.layerCount;

			for ( var i:number = num_layers - 1; i >= 0; i-- ) {

				layer = this.curMap.getLayer( i );
				ICollection<TileType> layerBlockers = blockers.GetBlockers( i );

				// ensure a walkable tile type at EVERY layer.
				for ( var coord:TileCoord in path ) {

					type = layer.getTileType( coord.row, coord.col );
					if ( layerBlockers.contains( type ) ) {

						layer.setTileType( coord.row, coord.col, this.replacableList[i].GetTileType().id );

					}
					// NOTE: a non-solid tile that coversLowerLayers, might not need its lower layer tiles replaced
					// even if they are solid: e.g. a bridge tile over water.
					// But since these tiles are directional, it's safer to build an absolute route to goal.

				}

			}


		}

		private TileDist( src:TileCoord, dest:TileCoord ):number {

			var row:number = src.row;
			var col:number = src.col;

			var destRow:number = dest.row;
			var destCol:number = dest.col;

			var d:number = Math.abs( destRow - row ) + Math.abs( destCol - col );

			if ( d === 1 ) {

				var layer:TileLayer;

				for ( var i:number = this.curMap.layerCount - 1; i >= 0; i-- ) {

					layer = this.curMap.getLayer( i );
					ICollection<TileType> layerBlockers = blockers.GetBlockers( i );

					// one space away.
					var type:TileType = layer.getTileType( destRow, destCol );
					if ( layerBlockers.contains( type ) ) {

						// this tile would normally be un-walkable and should be given a high cost to count as a path.
						return PathMaker.MAX_COST;

					}

				}


			}
			return 1;

		}

	}