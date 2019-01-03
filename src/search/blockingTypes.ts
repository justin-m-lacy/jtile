import TileType from "../tileType";
import TileMap from "../tileMap";
import TileCoord from "../tileCoord";
import TileLayer from "../tileLayer";
import { ITileTypeChoice } from '../regions/tileTypeChoice';
/**
* Describes which tileTypes are treated as blocked at each layer of a tile map.
*/
export default class BlockingTypes {

		/**
		 * defines a set of blocking tile types for each tile layer. Tile layer is the list index.
		 */
		protected blockers:List<ICollection<TileType>>;

		constructor() {
			this.blockers = new List<ICollection<TileType>>();
		}

		/**
		 * Set the blocking tile types for a given tile map layer.
		 */
		public setBlockers( layer:number, blockers:ICollection<TileType> ):void {

			this.blockers[layer] = blockers;

		}

		/**
		 * Returns the tiles that are considered blocking tiles for the given tile layer.
		 */
		public getBlockers( layer:number ):ICollection<TileType> {

			return this.blockers[layer];

		}

	}

	/**
	 * defines BlockingTypes (parent), plus types that can replace these types in order to
	 * ensure a map has a path between specific coordinates.
	 */
	export class ReplaceTypes extends BlockingTypes {

		/**
		 * defines a set of replacement tile types for each tile layer. Tile layer is the list index.
		 */
		protected  replaceTypes:ITileTypeChoice[];

		constructor() {

			super();
			this.replaceTypes = new Array<ITileTypeChoice>();

		}

		public SetReplacements( layer:number, replace:ITileTypeChoice ):void {

			this.replaceTypes[layer] = replace;

		}

		public getReplacement( layer:number ):TileType {
			return this.replaceTypes[layer].GetTileType();
		}

		/**
		 * replace any blocked tile types on a map path with walkable types.
		 */
		public ReplacePath( map:TileMap, path:TileCoord[] ):void {

			var type:TileType;
			var layer:TileLayer;

			var num_layers:number = map.layerCount;

			for ( var i:number = num_layers - 1; i >= 0; i-- ) {

				layer = map.getLayer( i );

				// ensure a walkable tile type at EVERY layer.
				for ( var coord of path ) {

					type = layer.getTileType( coord.row, coord.col );
					if ( this.blockers[i].contains( type ) ) {

						layer.setTileType( coord.row, coord.col, this.replaceTypes[i].getTileType().id );

					}
					// NOTE: a non-solid tile that coversLowerLayers, might not need its lower layer tiles replaced
					// even if they are solid: e.g. a bridge tile over water.
					// But since these tiles are directional, it's safer to build an absolute route to goal.

				}

			}
	
		} // ReplacePath()

	} // class