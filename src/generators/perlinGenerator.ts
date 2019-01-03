import ITileRegion from '../regions/iTileRegion';
import TileMap from '../tileMap';
import TileLayer from '../tileLayer';

export default class PerlinGenerator implements ITileRegion {

		/**
		 * values below this generate the tileType on the given layer.
		 */
		private _cutOff:number = 0.5;
		public get cutOff():number {
				return this._cutOff;
			}

		public set cutOff(v) {
			this._cutOff = v;
		}

		/**
		 * region in which to generate the tiles.
		 */
		private region:ITileRegion;

		private tileLayer:number;
		private tileTypes:number[];

		constructor( layer:number, region:ITileRegion, tileTypes:number[] ) {

			this.tileLayer = layer;
			this.tileTypes = tileTypes;
			this.region = region;

		}

		public generate( map:TileMap ):void {

			if ( this.tileLayer >= map.layerCount ) {
				console.log( "error: no such layer: " + this.tileLayer );
				return;
			}
			if ( this.tileTypes == null ) {
				console.log( "PerlinGenerator layer: " + this.tileLayer + " :No tile types defined." );
				return;
			}
			if ( this.region == null ) {
				console.log( "PerlinGenerator: No Region defined." );
				return;
			}

			if ( this.tileTypes.length == 0 ) {
				return;
			}

			var offsetX:number = Math.random()*1000000.0;
			var offsetY:number = Math.random()*1000000.0;

			var noise:number;
			var layer:TileLayer = map.getLayer( this.tileLayer );
			for ( var coord of region ) {

				noise = Math.PerlinNoise( offsetX + coord.col, offsetY + coord.row );
				if ( noise <= this.cutOff ) {
					layer.setTileType( coord.row, coord.col, this.GetTileType() );
				}

			}

		}

		private GetTileType():number {
			return this.tileTypes[
				Math.floor( Math.random()*this.tileTypes.length )
			];
		}
	
	}