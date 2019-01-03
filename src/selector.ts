import TileCoord from './tileCoord';
import TileType from './tileType';

export default class TileSelector {

		/**
		 * layer the tile comes from.
		 */
		public layerIndex:number;

		//public var tileLayer:TileLayer;

		/**
		 * tile location.
		 */
		public coord:TileCoord;

		public tileType:TileType;

		public TileSelector( layer:number, loc:TileCoord, t_type:TileType ) {

			this.layerIndex = layer;
			this.coord = loc;
			this.tileType = t_type;

		} //

		public equals( other:TileSelector ):boolean {
			return this.coord === other.coord && this.layerIndex === other.layerIndex && this.tileType == other.tileType;
		}

	} // class