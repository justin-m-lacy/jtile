import TileMap from '../../tileMap';
import TileSet from '../../tileSet';
import TileType from '../../tileType';
import ITileRegion from '../../regions/iTileRegion';
import BlockingTypes from '../../search/blockingTypes';
import { ITileTypeChoice, TileTypeList } from '../tileTypeChoice';
import TileCoord from '../../tileCoord';
import PathMaker from '../pathMaker';

/**
* Base class for a variety of Level generators.
*/
export default abstract class BaseGenerator {

		//protected TileSet baseSet;
		//protected TileSet topSet;
		protected curMap:TileMap;

		/**
		 * Each tuple of tile regions should be linked by a walkable path as the last
		 * phase of Level generation. Every tile in the first region will be linked to at least
		 * ONE tile in the second region.
		 *
		 * This should be done in the last phase of level generation to ensure no further changes
		 * break the paths between the regions.
		 */
		protected linkRegions:[ITileRegion, ITileRegion][];

		constructor() {
			this.linkRegions = [];
		}

		/**
		 * Ensure a walkable path from t1 to t2 in the last phase of map generation.
		 */
		public addPathLink( t1:ITileRegion, t2:ITileRegion ):void {

			this.linkRegions.push( [t1, t2] );

		}

		public generate( map:TileMap ):void {

			this.curMap = map;

		}

		/*public void SetTileSets( TileSet baseSet, TileSet topSet ) {
			this.baseSet = baseSet;
			this.topSet = topSet;
		}*/

		/**
		 * Link all tiles in the linkPaths tuples.
		 */
		protected linkAll():void {

			var pather:PathMaker = new PathMaker( this.BuildBlockTypes(), this.BuildReplaceTypes() );

			var end:TileCoord;

			for ( var t of this.linkRegions ) {

				/**
				 * TODO: skip tiles in the region that are already connected?
				 */
				for ( var tile1 of t[0] ) {

					end = t[1].pickTile();		// Random tile in destination region.
					pather.makePath( this.curMap, tile1, end );
	
				}

			}

		}

		/**
		 * Guarantees there is a walkable path from every player spawn
		 * to at least one map goal.
		 */
		protected ensurePath():void {

			//this.linkRegions.Add( new Tuple<ITileRegion, ITileRegion>( spawn.region, this.PickRandomGoal().region ) );
	
		}

		/**
		 * Build the replacement tileTypes for tiles that would block a player path.
		 * If a generator requires a path between two points, blocking tiles on that path
		 * need to be replaced ( on all layers ) with walkable tiles.
		 */
		protected BuildReplaceTypes():ITileTypeChoice[] {

			let replaceTypes:ITileTypeChoice[] = [];

			var map:TileMap = this.curMap;

			var tset:TileSet;
			var layerTypes:TileTypeList;

			for ( var i:number = map.layerCount - 1; i >= 0; i-- ) {

				tset = map.getLayer( i ).tileSet;
				layerTypes = new TileTypeList();

				for ( var type of tset ) {

					if ( type.solid === false ) {
						layerTypes.push( type );
					}

				}
				replaceTypes[i] = layerTypes;

			}

			return replaceTypes;

		}

		/**
		 * Get a complete list of tile types that would block a player's path in the tile map.
		 * If a generator requires a path between two points, blocking tiles on that path
		 * need to be replaced ( on all layers ) with walkable tiles.
		 */
		protected BuildBlockTypes():BlockingTypes {

			let blockers:BlockingTypes = new BlockingTypes();
			let map:TileMap = this.curMap;

			let set:TileSet;
			let layerTypes:TileType[];

			for ( var i:number = map.layerCount - 1; i >= 0; i-- ) {

				set = map.getLayer( i ).tileSet;
				layerTypes = [];

				for ( var type of set ) {

					if ( type.solid === true ) {
						layerTypes.push( type );
					}

				}
				blockers.setBlockers( i, layerTypes );

			}

			return blockers;

		}

	} // class