import TileMap from '../../tileMap';
import TileSet from '../../tileSet';
import TileType from '../../tileType';

/**
* Base class for a variety of Level generators.
*/
export default abstract class BaseGenerator {

		protected loader:IAssetLoader;

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
		protected List< Tuple<ITileRegion, ITileRegion> > linkRegions;

		constructor() {

			this.linkRegions = new List<Tuple<ITileRegion, ITileRegion>>();

		}

		/**
		 * Ensure a walkable path from t1 to t2 in the last phase of map generation.
		 */
		public addPathLink( t1:ITileRegion, t2:ITileRegion ):void {

			this.linkRegions.add( new Tuple<ITileRegion, ITileRegion>( t1, t2 ) );

		}

		public generate( map:TileMap, assetLoader:IAssetLoader ):void {

			this.loader = assetLoader;
			this.curMap = map;

		}

		/*public void SetTileSets( TileSet baseSet, TileSet topSet ) {
			this.baseSet = baseSet;
			this.topSet = topSet;
		}*/

		/**
		 * Link all tiles in the linkPaths tuples.
		 */
		protected linkRegions():void {

			var pather:PathMaker = new PathMaker( this.BuildBlockTypes(), this.BuildReplaceTypes() );

			var end:TileCoord;

			for ( Tuple<ITileRegion, ITileRegion> t in this.linkRegions ) {

				/**
				 * TODO: skip tiles in the region that are already connected?
				 */
				for ( var tile1:TileCoord of t.a ) {

					end = t.b.PickTile();		// Random tile in destination region.
					pather.Generate( curLevel.tileMap, tile1, end );
	
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
		protected BuildReplaceTypes():List<ITileTypeChoice> {

			List<ITileTypeChoice> replaceTypes = new List<ITileTypeChoice>();

			var map:TileMap = this.curLevel.tileMap;

			var set:TileSet;
			var layerTypes:TileTypeList;

			for ( var i:number = map.layerCount - 1; i >= 0; i-- ) {

				set = map.getLayer( i ).tileSet;
				layerTypes = new TileTypeList();

				for ( var type:TileType of set ) {

					if ( !type.solid ) {
						layerTypes.Add( type );
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

			var blockers:BlockingTypes = new BlockingTypes();
			var map:TileMap = this.curLevel.tileMap;

			var set:TileSet;
			var List<TileType> layerTypes;

			for ( var i:number = map.layerCount - 1; i >= 0; i-- ) {

				set = map.GetLayer( i ).TileSet;
				layerTypes = new List<TileType>();

				foreach ( TileType type in set ) {

					if ( type.solid ) {
						layerTypes.Add( type );
					}

				}
				blockers.SetBlockers( i, layerTypes );

			}

			return blockers;

		}

	} // class