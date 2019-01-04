import TileMap from "../tileMap";
import { decodeLayerTiles } from "./encoding";

	/**
	* Information about a TileLayer.
	*/
export class TileLayerInfo {

		private static LEGACY_TILE_BYTES:number = 6;

		public preferredSet:string;

		/**
		 * Expected size of each encoded tile, in bytes.
		 */
		public tileBytes:number = TileLayerInfo.LEGACY_TILE_BYTES;

		public mapData:string;

		public constructor( setName:string, bytes_per_tile:number, data:string ) {

			this.preferredSet = setName;
			this.tileBytes = bytes_per_tile;
			this.mapData = data;

		}

}

/**
* Information about a TileMap.
Currently unused.
*/
export default class TileMapInfo {

		public name:string;
		public rows:number;
		public cols:number;

		public layersInfo:TileLayerInfo[];
		public SetLayerData( layerData:TileLayerInfo[] ):void {

			this.layersInfo = layerData;

		}

		/**
		 * Create an empty TileMap using the information.
		 */
		public CreateMap():TileMap {

			var map:TileMap;

			if ( this.rows === 0 || this.cols === 0 ) {

				if ( this.layersInfo ) {
					return new TileMap( this.layersInfo.length );
				} else {
					return new TileMap();
				}

			}

			if ( this.layersInfo && this.layersInfo.length > 0 ) {
				map = new TileMap( this.layersInfo.length, this.rows, this.cols );
			} else {
				map = new TileMap( this.rows, this.cols );
			}

			if ( this.layersInfo && this.layersInfo.length > 0 ) {
				this.initLayers( map );
			}

			return map;

		}

		initLayers( map:TileMap ):void {

			var len:number = this.layersInfo.length;
			for ( var i:number = 0; i < len; i++ ) {
				decodeLayerTiles( map.getLayer( i ), this.layersInfo[i].mapData, this.layersInfo[i].tileBytes );
			}

		}

	} // class

